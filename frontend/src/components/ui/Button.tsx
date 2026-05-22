import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:   'bg-ink text-white border border-ink hover:bg-neutral-800 active:bg-neutral-900',
  secondary: 'bg-white text-ink border border-ink hover:bg-neutral-50',
  ghost:     'bg-transparent text-ink border border-transparent hover:bg-neutral-100',
  danger:    'bg-white text-red-600 border border-red-300 hover:bg-red-50',
};

const sizes: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5 rounded',
  md: 'text-sm px-4 py-2 rounded',
  lg: 'text-sm px-6 py-3 rounded',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center font-medium tracking-wide',
        'transition-all duration-150 cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
    </button>
  );
}
