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
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PostCard({ post, onDelete, currentUserId }: PostCardProps) {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [activeMedia, setActiveMedia] = useState(0);

  const isOwner = currentUserId === post.author.id;
  const firstMedia = post.media[activeMedia];

  return (
    <article className="border border-neutral-200 rounded overflow-hidden bg-white mb-px">

      {/* Media */}
      {firstMedia && (
        <div className="relative bg-neutral-100 aspect-[4/3] overflow-hidden">
          {firstMedia.media_type === 'video' ? (
            <video src={firstMedia.media_url} controls className="w-full h-full object-cover" />
          ) : (
            <img
              src={firstMedia.media_url}
              alt={post.caption || 'Post media'}
              className="w-full h-full object-cover block"
              loading="lazy"
            />
          )}
          {post.media.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {post.media.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMedia(i)}
                  className={[
                    'w-1.5 h-1.5 rounded-full border-none p-0 cursor-pointer transition-colors',
                    i === activeMedia ? 'bg-white' : 'bg-white/50',
                  ].join(' ')}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Author row */}
        <div className="flex items-center justify-between mb-3">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate(`/profile/${post.author.username}`)}
          >
            <Avatar src={post.author.profile_picture_url} username={post.author.username} size={36} />
            <div>
              <p className="text-xs font-semibold text-ink leading-none">{post.author.username}</p>
              <p className="text-[11px] text-ink-faint mt-0.5">{formatDate(post.created_at)}</p>
            </div>
          </div>
          {isOwner && onDelete && (
            <button
              onClick={() => onDelete(post.id)}
              className="text-xs text-ink-faint hover:text-red-500 bg-transparent border-none cursor-pointer px-2 py-1 transition-colors"
            >
              Delete
            </button>
          )}
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm leading-relaxed text-ink mb-3">{post.caption}</p>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.map((tag) => (
              <TagBadge key={tag.id} name={tag.name} size="sm" />
            ))}
          </div>
        )}

        {/* Comment toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-xs text-ink-muted bg-transparent border-none cursor-pointer p-0 hover:text-ink transition-colors"
        >
          {post.comment_count > 0
            ? `${post.comment_count} comment${post.comment_count !== 1 ? 's' : ''}`
            : 'Add a comment'}
          {' '}{showComments ? '▲' : '▼'}
        </button>

        {showComments && (
          <div className="mt-3">
            <CommentSection postId={post.id} currentUserId={currentUserId} />
          </div>
        )}
      </div>
    </article>
  );
}
