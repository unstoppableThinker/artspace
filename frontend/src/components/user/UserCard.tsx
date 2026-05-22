import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'types';
import Avatar from 'components/ui/Avatar';

interface UserCardProps {
  user: User;
  action?: React.ReactNode;
}

export default function UserCard({ user, action }: UserCardProps) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-neutral-100 last:border-0">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate(`/profile/${user.username}`)}
      >
        <Avatar src={user.profile_picture_url} username={user.username} size={44} />
        <div>
          <p className="text-sm font-semibold text-ink">{user.username}</p>
          {user.bio && (
            <p className="text-xs text-ink-muted mt-0.5 max-w-[260px] truncate">{user.bio}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
