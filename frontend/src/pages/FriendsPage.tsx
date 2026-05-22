import React, { useState, useEffect } from 'react';
import { FriendRequest, User } from 'types';
import { friendsApi } from 'api/friends';
import Layout from 'components/layout/Layout';
import UserCard from 'components/user/UserCard';
import Button from 'components/ui/Button';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import EmptyState from 'components/ui/EmptyState';

type Tab = 'friends' | 'incoming' | 'outgoing';

export default function FriendsPage() {
  const [tab, setTab] = useState<Tab>('incoming');
  const [friends, setFriends] = useState<User[]>([]);
  const [incoming, setIncoming] = useState<FriendRequest[]>([]);
  const [outgoing, setOutgoing] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    Promise.all([
      friendsApi.getFriends(),
      friendsApi.getIncomingRequests(),
      friendsApi.getOutgoingRequests(),
    ]).then(([f, inc, out]) => {
      setFriends(f);
      setIncoming(inc);
      setOutgoing(out);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const accept = async (requestId: string) => {
    await friendsApi.acceptRequest(requestId);
    reload();
  };

  const reject = async (requestId: string) => {
    await friendsApi.rejectRequest(requestId);
    reload();
  };

  const unfriend = async (friendId: string) => {
    await friendsApi.removeFriend(friendId);
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  };

  const tabStyle = (t: Tab): React.CSSProperties => ({
    padding: '8px 0', marginRight: 24,
    fontSize: 14, fontWeight: tab === t ? 600 : 400,
    color: tab === t ? '#111' : '#737373',
    background: 'none', border: 'none', cursor: 'pointer',
    borderBottom: tab === t ? '2px solid #111' : '2px solid transparent',
  });

  return (
    <Layout>
      <h1 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>Friends</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e5e5', marginBottom: 24 }}>
        <button style={tabStyle('incoming')} onClick={() => setTab('incoming')}>
          Requests {incoming.length > 0 && <span style={{ marginLeft: 4, background: '#111', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 11 }}>{incoming.length}</span>}
        </button>
        <button style={tabStyle('friends')} onClick={() => setTab('friends')}>Friends</button>
        <button style={tabStyle('outgoing')} onClick={() => setTab('outgoing')}>Sent</button>
      </div>

      {loading ? (
        <LoadingSpinner fullPage />
      ) : (
        <>
          {tab === 'incoming' && (
            incoming.length === 0 ? (
              <EmptyState title="No pending requests" description="When someone adds you, it will appear here." />
            ) : (
              incoming.map((req) => (
                <UserCard
                  key={req.id}
                  user={req.sender}
                  action={
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Button size="sm" onClick={() => accept(req.id)}>Accept</Button>
                      <Button size="sm" variant="secondary" onClick={() => reject(req.id)}>Decline</Button>
                    </div>
                  }
                />
              ))
            )
          )}

          {tab === 'friends' && (
            friends.length === 0 ? (
              <EmptyState title="No friends yet" description="Find artists you like and send a friend request from their profile." />
            ) : (
              friends.map((f) => (
                <UserCard
                  key={f.id}
                  user={f}
                  action={
                    <Button size="sm" variant="ghost" onClick={() => unfriend(f.id)} style={{ color: '#a3a3a3' }}>
                      Remove
                    </Button>
                  }
                />
              ))
            )
          )}

          {tab === 'outgoing' && (
            outgoing.length === 0 ? (
              <EmptyState title="No sent requests" description="Visit an artist's profile to send a friend request." />
            ) : (
              outgoing.map((req) => (
                <UserCard key={req.id} user={req.receiver} />
              ))
            )
          )}
        </>
      )}
    </Layout>
  );
}
