import React from 'react';

interface TagBadgeProps {
  name: string;
  onClick?: () => void;
  active?: boolean;
  size?: 'sm' | 'md';
}

export default function TagBadge({ name, onClick, active = false, size = 'md' }: TagBadgeProps) {
  const base = [
    'inline-flex items-center border rounded-sm tracking-widest lowercase select-none transition-all duration-150',
    size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
    active
      ? 'bg-ink text-white border-ink'
      : 'bg-transparent text-ink-soft border-neutral-300',
    onClick ? 'cursor-pointer hover:border-ink hover:text-ink' : '',
  ].join(' ');

  if (onClick) {
    return <button onClick={onClick} className={base}>#{name}</button>;
  }
  return <span className={base}>#{name}</span>;
}
