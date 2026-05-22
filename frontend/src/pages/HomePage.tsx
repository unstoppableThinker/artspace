import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from 'types';
import { timelineApi } from 'api/timeline';
import { postsApi } from 'api/posts';
import { extractError } from 'api/client';
import { useAuth } from 'context/AuthContext';
import Layout from 'components/layout/Layout';
import PostGrid from 'components/post/PostGrid';
import Button from 'components/ui/Button';
import CreatePostModal from 'components/post/CreatePostModal';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const fetchPage = useCallback(async (p: number) => {
    try {
      const data = await timelineApi.getTimeline(p);
      if (p === 1) {
        setPosts(data);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === 20);
    } catch {
      setHasMore(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPage(1).finally(() => setLoading(false));
  }, [fetchPage]);

  const loadMore = async () => {
    const next = page + 1;
    setPage(next);
    setLoadingMore(true);
    await fetchPage(next);
    setLoadingMore(false);
  };

  const handleDelete = async (postId: string) => {
    await postsApi.deletePost(postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handlePostCreated = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
    setShowCreate(false);
  };

  return (
    <Layout>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>Feed</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#737373' }}>
            Posts from tags you follow, then everything else
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm">+ New post</Button>
      </div>

      <PostGrid
        posts={posts}
        loading={loading}
        onDelete={handleDelete}
        currentUserId={user?.id}
        emptyTitle="Your feed is empty"
        emptyDescription="Follow some tags or wait for others to post."
        emptyAction={
          <Button onClick={() => navigate('/tags')} variant="secondary" size="sm">
            Browse tags
          </Button>
        }
      />

      {hasMore && !loading && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Button variant="secondary" onClick={loadMore} loading={loadingMore}>
            Load more
          </Button>
        </div>
      )}

      <CreatePostModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handlePostCreated}
      />
    </Layout>
  );
}
