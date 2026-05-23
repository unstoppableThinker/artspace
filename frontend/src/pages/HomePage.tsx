import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { fetchFeedPage, deleteFeedPost, setShowCreate, prependPost } from 'store/slices/feedSlice';
import Layout from 'components/layout/Layout';
import PostGrid from 'components/post/PostGrid';
import Button from 'components/ui/Button';
import CreatePostModal from 'components/post/CreatePostModal';
import { Post } from 'types';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const { posts, status, page, hasMore, showCreate } = useAppSelector((s) => s.feed);

  useEffect(() => {
    dispatch(fetchFeedPage(1));
  }, [dispatch]);

  const loadMore = () => {
    dispatch(fetchFeedPage(page + 1));
  };

  const handleDelete = (postId: string) => {
    dispatch(deleteFeedPost(postId));
  };

  const handlePostCreated = (post: Post) => {
    dispatch(prependPost(post));
    dispatch(setShowCreate(false));
  };

  return (
    <Layout>
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink leading-none">Feed</h1>
          <p className="text-sm text-ink-muted mt-1">Posts from tags you follow, then everything else</p>
        </div>
        <Button onClick={() => dispatch(setShowCreate(true))} size="sm">+ New post</Button>
      </div>

      <PostGrid
        posts={posts}
        loading={status === 'loading'}
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

      {hasMore && status !== 'loading' && (
        <div className="text-center mt-8">
          <Button variant="secondary" onClick={loadMore} loading={status === 'loadingMore'}>
            Load more
          </Button>
        </div>
      )}

      <CreatePostModal
        isOpen={showCreate}
        onClose={() => dispatch(setShowCreate(false))}
        onCreated={handlePostCreated}
      />
    </Layout>
  );
}
