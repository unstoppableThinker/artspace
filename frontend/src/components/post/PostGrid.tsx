import React from 'react';
import { Post } from 'types';
import PostCard from './PostCard';
import EmptyState from 'components/ui/EmptyState';
import LoadingSpinner from 'components/ui/LoadingSpinner';

interface PostGridProps {
  posts: Post[];
  loading?: boolean;
  onDelete?: (postId: string) => void;
  currentUserId?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
}

export default function PostGrid({
  posts,
  loading = false,
  onDelete,
  currentUserId,
  emptyTitle = 'No posts yet',
  emptyDescription,
  emptyAction,
}: PostGridProps) {
  if (loading) return <LoadingSpinner fullPage />;

  if (posts.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  return (
    <div className="flex flex-col gap-px">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={onDelete}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
