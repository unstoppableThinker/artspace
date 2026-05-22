import React from 'react';

interface TagBadgeProps {
  name: string;
  onClick?: () => void;
  active?: boolean;
  size?: 'sm' | 'md';
}

export default function TagBadge({ name, onClick, active = false, size = 'md' }: TagBadgeProps) {
  const isButton = !!onClick;
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: size === 'sm' ? '2px 8px' : '4px 10px',
    borderRadius: 2,
    fontSize: size === 'sm' ? 11 : 12,
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'lowercase',
    cursor: isButton ? 'pointer' : 'default',
    border: '1px solid',
    borderColor: active ? '#111' : '#d4d4d4',
    background: active ? '#111' : 'transparent',
    color: active ? '#fff' : '#525252',
    transition: 'all 0.12s',
    userSelect: 'none',
  };

  if (isButton) {
    return (
      <button onClick={onClick} style={{ ...style, background: active ? '#111' : 'transparent' }}>
        #{name}
      </button>
    );
  }

  return <span style={style}>#{name}</span>;
}
