import React from 'react';

interface AvatarProps {
  src?: string | null;
  username: string;
  size?: number;
}

export default function Avatar({ src, username, size = 40 }: AvatarProps) {
  const initial = username.charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={username}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1px solid #e5e5e5',
          flexShrink: 0,
          display: 'block',
        }}
      />
    );
  }

  return (
    <div
      aria-label={username}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#111',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 600,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initial}
    </div>
  );
}
