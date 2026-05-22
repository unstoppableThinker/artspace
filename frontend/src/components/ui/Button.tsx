import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const base = `
  inline-flex items-center justify-center font-medium transition-all duration-150
  focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none
`;

const variants: Record<Variant, string> = {
  primary:   'bg-black text-white hover:bg-neutral-800 active:bg-neutral-900',
  secondary: 'bg-white text-black border border-black hover:bg-neutral-50',
  ghost:     'bg-transparent text-black hover:bg-neutral-100',
  danger:    'bg-white text-red-600 border border-red-300 hover:bg-red-50',
};

const sizes: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5 rounded',
  md: 'text-sm px-4 py-2 rounded',
  lg: 'text-base px-6 py-3 rounded',
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
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      style={{ letterSpacing: '0.01em' }}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite', marginRight: children ? 8 : 0 }} />
      ) : null}
      {children}
    </button>
  );
}
