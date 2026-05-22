import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from 'types';
import Avatar from 'components/ui/Avatar';
import TagBadge from 'components/tag/TagBadge';
import CommentSection from './CommentSection';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
  currentUserId?: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PostCard({ post, onDelete, currentUserId }: PostCardProps) {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [activeMedia, setActiveMedia] = useState(0);

  const isOwner = currentUserId === post.author.id;
  const firstMedia = post.media[activeMedia];

  return (
    <article style={{
      border: '1px solid #e5e5e5',
      borderRadius: 4,
      overflow: 'hidden',
      background: '#fff',
      marginBottom: 1,
    }}>
      {/* Media */}
      {firstMedia && (
        <div style={{ position: 'relative', background: '#f5f5f5', aspectRatio: '4/3', overflow: 'hidden' }}>
          {firstMedia.media_type === 'video' ? (
            <video
              src={firstMedia.media_url}
              controls
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img
              src={firstMedia.media_url}
              alt={post.caption || 'Post media'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
          )}
          {/* Thumbnail strip for multiple media */}
          {post.media.length > 1 && (
            <div style={{
              position: 'absolute', bottom: 8, left: 0, right: 0,
              display: 'flex', justifyContent: 'center', gap: 4,
            }}>
              {post.media.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMedia(i)}
                  style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: i === activeMedia ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: 'none', padding: 0, cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ padding: '16px' }}>
        {/* Author row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            onClick={() => navigate(`/profile/${post.author.username}`)}
          >
            <Avatar src={post.author.profile_picture_url} username={post.author.username} size={36} />
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>{post.author.username}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#a3a3a3' }}>{formatDate(post.created_at)}</p>
            </div>
          </div>
          {isOwner && onDelete && (
            <button
              onClick={() => onDelete(post.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3', fontSize: 12, padding: '4px 8px' }}
            >
              Delete
            </button>
          )}
        </div>

        {/* Caption */}
        {post.caption && (
          <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.6, color: '#111' }}>
            {post.caption}
          </p>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
            {post.tags.map((tag) => (
              <TagBadge key={tag.id} name={tag.name} size="sm" />
            ))}
          </div>
        )}

        {/* Comment toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, color: '#737373', padding: 0,
          }}
        >
          {post.comment_count > 0 ? `${post.comment_count} comment${post.comment_count !== 1 ? 's' : ''}` : 'Add a comment'}
          {showComments ? ' ▲' : ' ▼'}
        </button>

        {showComments && (
          <div style={{ marginTop: 12 }}>
            <CommentSection postId={post.id} currentUserId={currentUserId} />
          </div>
        )}
      </div>
    </article>
  );
}
