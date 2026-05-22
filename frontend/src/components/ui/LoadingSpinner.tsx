import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  fullPage?: boolean;
}

export default function LoadingSpinner({ size = 24, fullPage = false }: LoadingSpinnerProps) {
  const spinner = (
    <div
      style={{
        width: size,
        height: size,
        border: '2px solid #e5e5e5',
        borderTopColor: '#111',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  );

  if (fullPage) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        {spinner}
      </div>
    );
  }

  return spinner;
}
