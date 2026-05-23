import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { fetchCurrentUser } from 'store/slices/authSlice';
import {
  fetchProfile,
  fetchProfilePosts,
  checkFriendStatus,
  sendFriendRequest,
  updateProfile,
  uploadAvatar,
  deleteProfilePost,
  clearProfile,
  setEditOpen,
  setEditForm,
} from 'store/slices/profileSlice';
import Layout from 'components/layout/Layout';
import Avatar from 'components/ui/Avatar';
import Button from 'components/ui/Button';
import PostGrid from 'components/post/PostGrid';
import Modal from 'components/ui/Modal';
import Input from 'components/ui/Input';
import { Textarea } from 'components/ui/Input';
import LoadingSpinner from 'components/ui/LoadingSpinner';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = useAppSelector((s) => s.auth.user);
  const {
    profile,
    posts,
    loadingProfile,
    loadingPosts,
    isFriend,
    requestSent,
    editOpen,
    editForm,
    saving,
    editError,
    uploadingAvatar,
  } = useAppSelector((s) => s.profile);

  const avatarRef = useRef<HTMLInputElement>(null);
  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    if (!username) return;
    dispatch(clearProfile());
    dispatch(fetchProfile(username))
      .unwrap()
      .catch(() => navigate('/feed'));
    dispatch(fetchProfilePosts(username));
  }, [username, dispatch, navigate]);

  useEffect(() => {
    if (isOwnProfile || !profile) return;
    dispatch(checkFriendStatus(profile.id));
  }, [profile, isOwnProfile, dispatch]);

  const openEdit = () => {
    dispatch(setEditForm({ username: currentUser?.username ?? '', bio: currentUser?.bio ?? '' }));
    dispatch(setEditOpen(true));
  };

  const saveEdit = async () => {
    const result = await dispatch(updateProfile(editForm));
    if (updateProfile.fulfilled.match(result)) {
      dispatch(fetchCurrentUser());
      if (editForm.username !== username) navigate(`/profile/${editForm.username}`);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await dispatch(uploadAvatar(file));
    dispatch(fetchCurrentUser());
  };

  if (loadingProfile) return <Layout><LoadingSpinner fullPage /></Layout>;
  if (!profile) return null;

  return (
    <Layout>
      {/* Profile header */}
      <div className="flex gap-6 items-start mb-10 pb-8 border-b border-neutral-200">
        {/* Avatar with upload button */}
        <div className="relative flex-shrink-0">
          <Avatar src={profile.profile_picture_url} username={profile.username} size={88} />
          {isOwnProfile && (
            <>
              <button
                onClick={() => avatarRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-0 right-0 w-6 h-6 bg-ink text-white rounded-full text-xs flex items-center justify-center border-none cursor-pointer disabled:opacity-50"
              >
                {uploadingAvatar ? '…' : '↑'}
              </button>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-xl font-semibold text-ink">{profile.username}</h1>
            {isOwnProfile ? (
              <Button variant="secondary" size="sm" onClick={openEdit}>Edit profile</Button>
            ) : isFriend ? (
              <span className="text-xs text-ink-muted px-2.5 py-1 border border-neutral-200 rounded">Friends</span>
            ) : requestSent ? (
              <span className="text-xs text-ink-muted">Request sent</span>
            ) : (
              <Button size="sm" onClick={() => dispatch(sendFriendRequest(profile.id))}>+ Add friend</Button>
            )}
          </div>
          {profile.bio && (
            <p className="text-sm text-ink-soft leading-relaxed max-w-sm mb-2">{profile.bio}</p>
          )}
          <p className="text-xs text-ink-faint">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <PostGrid
        posts={posts}
        loading={loadingPosts}
        onDelete={isOwnProfile ? (id) => dispatch(deleteProfilePost(id)) : undefined}
        currentUserId={currentUser?.id}
        emptyTitle="No posts yet"
        emptyDescription={isOwnProfile ? 'Share your first work.' : `${profile.username} hasn't posted yet.`}
      />

      <Modal isOpen={editOpen} onClose={() => dispatch(setEditOpen(false))} title="Edit profile">
        <div className="flex flex-col gap-4">
          <Input
            label="Username"
            value={editForm.username}
            onChange={(e) => dispatch(setEditForm({ username: e.target.value }))}
          />
          <Textarea
            label="Bio"
            value={editForm.bio}
            onChange={(e) => dispatch(setEditForm({ bio: e.target.value }))}
            placeholder="Tell people about your practice…"
            rows={3}
          />
          {editError && <p className="text-sm text-red-500">{editError}</p>}
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => dispatch(setEditOpen(false))}>Cancel</Button>
            <Button onClick={saveEdit} loading={saving}>Save</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
