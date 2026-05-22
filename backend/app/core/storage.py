"""
Pluggable object-storage service.

All configuration comes from environment variables – never hardcoded.
Swap the provider by pointing the env vars at a different S3-compatible
endpoint (MinIO, Cloudflare R2, Backblaze B2, etc.).
"""

import uuid
import mimetypes
from typing import Optional
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from app.core.config import settings


def _get_client():
    return boto3.client(
        "s3",
        endpoint_url=settings.STORAGE_BUCKET_URL if settings.STORAGE_BUCKET_URL != "https://s3.amazonaws.com" else None,
        aws_access_key_id=settings.STORAGE_ACCESS_KEY,
        aws_secret_access_key=settings.STORAGE_SECRET_KEY,
        region_name=settings.STORAGE_REGION,
        config=Config(signature_version="s3v4"),
    )


def upload_file(file_bytes: bytes, filename: str, content_type: Optional[str] = None) -> str:
    """
    Upload raw bytes to the configured bucket.

    Returns the public URL of the stored object.
    Raises RuntimeError on failure.
    """
    if not settings.STORAGE_ACCESS_KEY:
        # Dev fallback: return a placeholder URL so the app still works
        # without a real bucket configured.
        return f"/media/placeholder/{filename}"

    ext = filename.rsplit(".", 1)[-1] if "." in filename else "bin"
    key = f"media/{uuid.uuid4().hex}.{ext}"

    if content_type is None:
        content_type, _ = mimetypes.guess_type(filename)
        content_type = content_type or "application/octet-stream"

    try:
        client = _get_client()
        client.put_object(
            Bucket=settings.STORAGE_BUCKET_NAME,
            Key=key,
            Body=file_bytes,
            ContentType=content_type,
            ACL="public-read",
        )
    except ClientError as exc:
        raise RuntimeError(f"Storage upload failed: {exc}") from exc

    base = settings.STORAGE_PUBLIC_URL.rstrip("/") if settings.STORAGE_PUBLIC_URL else (
        f"{settings.STORAGE_BUCKET_URL.rstrip('/')}/{settings.STORAGE_BUCKET_NAME}"
    )
    return f"{base}/{key}"


def delete_file(url: str) -> None:
    """Delete an object from the bucket given its public URL. Silent on failure."""
    if not settings.STORAGE_ACCESS_KEY or not url.startswith("http"):
        return

    base = settings.STORAGE_PUBLIC_URL.rstrip("/") if settings.STORAGE_PUBLIC_URL else (
        f"{settings.STORAGE_BUCKET_URL.rstrip('/')}/{settings.STORAGE_BUCKET_NAME}"
    )
    key = url.replace(base + "/", "", 1)

    try:
        client = _get_client()
        client.delete_object(Bucket=settings.STORAGE_BUCKET_NAME, Key=key)
    except ClientError:
        pass
