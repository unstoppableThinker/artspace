import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Post } from 'types';
import { usersApi } from 'api/users';
import { postsApi } from 'api/posts';
import { friendsApi } from 'api/friends';
import { extractError } from 'api/client';
import { useAuth } from 'context/AuthContext';
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
  const { user: currentUser, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const avatarRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    if (!username) return;
    setLoadingProfile(true);
    usersApi.getProfile(username)
      .then(setProfile)
      .catch(() => navigate('/feed'))
      .finally(() => setLoadingProfile(false));
  }, [username, navigate]);

  useEffect(() => {
    if (!username) return;
    setLoadingPosts(true);
    postsApi.getUserPosts(username).then(setPosts).finally(() => setLoadingPosts(false));
  }, [username]);

  useEffect(() => {
    if (isOwnProfile || !profile) return;
    friendsApi.getFriends().then((friends) => setIsFriend(friends.some((f) => f.id === profile.id)));
    friendsApi.getOutgoingRequests().then((reqs) =>
      setRequestSent(reqs.some((r) => r.receiver.id === profile.id))
    );
  }, [profile, isOwnProfile]);

  const sendRequest = async () => {
    if (!profile) return;
    await friendsApi.sendRequest(profile.id);
    setRequestSent(true);
  };

  const openEdit = () => {
    setEditForm({ username: currentUser?.username || '', bio: currentUser?.bio || '' });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    setSaving(true); setEditError('');
    try {
      await usersApi.updateProfile(editForm);
      await refreshUser();
      setEditOpen(false);
      if (editForm.username !== username) navigate(`/profile/${editForm.username}`);
    } catch (err) {
      setEditError(extractError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      await usersApi.uploadAvatar(file);
      await refreshUser();
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    await postsApi.deletePost(postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
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
              <Button size="sm" onClick={sendRequest}>+ Add friend</Button>
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
        onDelete={isOwnProfile ? handleDeletePost : undefined}
        currentUserId={currentUser?.id}
        emptyTitle="No posts yet"
        emptyDescription={isOwnProfile ? 'Share your first work.' : `${profile.username} hasn't posted yet.`}
      />

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit profile">
        <div className="flex flex-col gap-4">
          <Input
            label="Username"
            value={editForm.username}
            onChange={(e) => setEditForm((p) => ({ ...p, username: e.target.value }))}
          />
          <Textarea
            label="Bio"
            value={editForm.bio}
            onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))}
            placeholder="Tell people about your practice…"
            rows={3}
          />
          {editError && <p className="text-sm text-red-500">{editError}</p>}
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit} loading={saving}>Save</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
