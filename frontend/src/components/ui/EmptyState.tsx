import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px' }}>
      <p style={{ fontSize: 32, margin: '0 0 12px', lineHeight: 1 }}>◻</p>
      <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: '#111' }}>{title}</h3>
      {description && (
        <p style={{ margin: '0 0 20px', fontSize: 14, color: '#737373', maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
