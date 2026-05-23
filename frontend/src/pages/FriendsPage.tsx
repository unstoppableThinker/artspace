import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  loadFriends,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from 'store/slices/friendsSlice';
import Layout from 'components/layout/Layout';
import UserCard from 'components/user/UserCard';
import Button from 'components/ui/Button';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import EmptyState from 'components/ui/EmptyState';
import { useState } from 'react';

type Tab = 'incoming' | 'friends' | 'outgoing';

export default function FriendsPage() {
  const dispatch = useAppDispatch();
  const { friends, incoming, outgoing, status } = useAppSelector((s) => s.friends);
  const [tab, setTab] = useState<Tab>('incoming');

  useEffect(() => {
    dispatch(loadFriends());
  }, [dispatch]);

  const accept = async (id: string) => {
    await dispatch(acceptFriendRequest(id));
    dispatch(loadFriends());
  };

  const reject = async (id: string) => {
    await dispatch(rejectFriendRequest(id));
    dispatch(loadFriends());
  };

  const unfriend = (id: string) => {
    dispatch(removeFriend(id));
  };

  const tabCls = (t: Tab) =>
    [
      'pb-2 mr-6 text-sm border-b-2 bg-transparent border-x-0 border-t-0 cursor-pointer transition-colors',
      tab === t
        ? 'font-semibold text-ink border-ink'
        : 'font-normal text-ink-muted border-transparent hover:text-ink',
    ].join(' ');

  return (
    <Layout>
      <h1 className="font-serif text-2xl font-semibold text-ink mb-6">Friends</h1>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 mb-6">
        <button className={tabCls('incoming')} onClick={() => setTab('incoming')}>
          Requests
          {incoming.length > 0 && (
            <span className="ml-1.5 bg-ink text-white text-[10px] rounded-full px-1.5 py-px">
              {incoming.length}
            </span>
          )}
        </button>
        <button className={tabCls('friends')} onClick={() => setTab('friends')}>Friends</button>
        <button className={tabCls('outgoing')} onClick={() => setTab('outgoing')}>Sent</button>
      </div>

      {status === 'loading' ? (
        <LoadingSpinner fullPage />
      ) : (
        <>
          {tab === 'incoming' && (
            incoming.length === 0
              ? <EmptyState title="No pending requests" description="When someone adds you, it will appear here." />
              : incoming.map((req) => (
                  <UserCard
                    key={req.id}
                    user={req.sender}
                    action={
                      <div className="flex gap-1.5">
                        <Button size="sm" onClick={() => accept(req.id)}>Accept</Button>
                        <Button size="sm" variant="secondary" onClick={() => reject(req.id)}>Decline</Button>
                      </div>
                    }
                  />
                ))
          )}

          {tab === 'friends' && (
            friends.length === 0
              ? <EmptyState title="No friends yet" description="Find artists you like and send a friend request from their profile." />
              : friends.map((f) => (
                  <UserCard
                    key={f.id}
                    user={f}
                    action={
                      <Button size="sm" variant="ghost" onClick={() => unfriend(f.id)}
                              className="text-ink-faint hover:text-red-500">
                        Remove
                      </Button>
                    }
                  />
                ))
          )}

          {tab === 'outgoing' && (
            outgoing.length === 0
              ? <EmptyState title="No sent requests" description="Visit an artist's profile to send a friend request." />
              : outgoing.map((req) => <UserCard key={req.id} user={req.receiver} />)
          )}
        </>
      )}
    </Layout>
  );
}
