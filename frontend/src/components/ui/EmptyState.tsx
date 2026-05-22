import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6">
      <p className="text-3xl mb-3 leading-none">◻</p>
      <h3 className="text-sm font-semibold text-ink mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-ink-muted max-w-xs mx-auto mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
