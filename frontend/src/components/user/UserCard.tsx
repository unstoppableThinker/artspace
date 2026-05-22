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
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0', borderBottom: '1px solid #f5f5f5',
    }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
        onClick={() => navigate(`/profile/${user.username}`)}
      >
        <Avatar src={user.profile_picture_url} username={user.username} size={44} />
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{user.username}</p>
          {user.bio && (
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#737373', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.bio}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
