import React, { useState, useEffect } from 'react';
import { Comment } from 'types';
import { commentsApi } from 'api/comments';
import { extractError } from 'api/client';
import Avatar from 'components/ui/Avatar';

interface CommentSectionProps {
  postId: string;
  currentUserId?: string;
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function CommentSection({ postId, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    commentsApi.getComments(postId)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const comment = await commentsApi.addComment(postId, newComment.trim());
      setComments((prev) => [...prev, comment]);
      setNewComment('');
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (commentId: string) => {
    await commentsApi.deleteComment(commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  if (loading) return <p className="text-xs text-ink-faint">Loading…</p>;

  return (
    <div>
      {comments.length === 0 && (
        <p className="text-xs text-ink-faint mb-3">No comments yet.</p>
      )}

      {comments.map((c) => (
        <div key={c.id} className="flex gap-2 mb-2.5">
          <Avatar src={c.author.profile_picture_url} username={c.author.username} size={28} />
          <div className="flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-semibold text-ink">{c.author.username}</span>
              <span className="text-[11px] text-ink-faint">{timeAgo(c.created_at)}</span>
              {currentUserId === c.author.id && (
                <button
                  onClick={() => remove(c.id)}
                  className="text-[11px] text-ink-faint hover:text-ink ml-1 bg-transparent border-none cursor-pointer p-0 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
            <p className="mt-0.5 text-sm text-ink leading-relaxed">{c.content}</p>
          </div>
        </div>
      ))}

      {currentUserId && (
        <form onSubmit={submit} className="flex gap-2 mt-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment…"
            disabled={submitting}
            className="flex-1 border-0 border-b border-neutral-200 py-1.5 text-sm text-ink outline-none bg-transparent placeholder:text-ink-faint focus:border-ink transition-colors"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="text-xs font-semibold text-ink bg-transparent border-none cursor-pointer disabled:opacity-40 transition-opacity"
          >
            Post
          </button>
        </form>
      )}
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}
