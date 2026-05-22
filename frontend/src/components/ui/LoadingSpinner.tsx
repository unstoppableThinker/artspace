import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  fullPage?: boolean;
}

export default function LoadingSpinner({ size = 24, fullPage = false }: LoadingSpinnerProps) {
  const spinner = (
    <div
      className="border-2 border-neutral-200 border-t-ink rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  );

  if (fullPage) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        {spinner}
      </div>
    );
  }

  return spinner;
}
