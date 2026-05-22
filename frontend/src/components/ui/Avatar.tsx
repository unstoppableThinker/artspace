import React from 'react';

interface AvatarProps {
  src?: string | null;
  username: string;
  size?: number;
}

export default function Avatar({ src, username, size = 40 }: AvatarProps) {
  const initial = username.charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={username}
        className="rounded-full object-cover border border-neutral-200 flex-shrink-0 block"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      aria-label={username}
      className="rounded-full bg-ink text-white flex items-center justify-center font-semibold flex-shrink-0 select-none"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}
