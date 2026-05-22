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

  if (loading) return <p style={{ fontSize: 12, color: '#a3a3a3', margin: 0 }}>Loading…</p>;

  return (
    <div>
      {comments.length === 0 && (
        <p style={{ fontSize: 12, color: '#a3a3a3', margin: '0 0 12px' }}>No comments yet.</p>
      )}

      {comments.map((c) => (
        <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <Avatar src={c.author.profile_picture_url} username={c.author.username} size={28} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 12 }}>{c.author.username}</span>
              <span style={{ fontSize: 11, color: '#a3a3a3' }}>{timeAgo(c.created_at)}</span>
              {currentUserId === c.author.id && (
                <button
                  onClick={() => remove(c.id)}
                  style={{ fontSize: 11, color: '#a3a3a3', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 4, padding: 0 }}
                >
                  ×
                </button>
              )}
            </div>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#111', lineHeight: 1.5 }}>{c.content}</p>
          </div>
        </div>
      ))}

      {/* New comment form */}
      {currentUserId && (
        <form onSubmit={submit} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment…"
            disabled={submitting}
            style={{
              flex: 1, border: 'none', borderBottom: '1px solid #e5e5e5',
              padding: '6px 0', fontSize: 13, outline: 'none', background: 'transparent',
            }}
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, color: '#111',
              opacity: submitting || !newComment.trim() ? 0.4 : 1,
            }}
          >
            Post
          </button>
        </form>
      )}
      {error && <p style={{ fontSize: 12, color: '#ef4444', margin: '6px 0 0' }}>{error}</p>}
    </div>
  );
}
