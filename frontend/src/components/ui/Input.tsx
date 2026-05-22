import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-ink tracking-wide">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'w-full px-3 py-2.5 text-sm text-ink bg-white',
          'border rounded outline-none transition-colors duration-150',
          'placeholder:text-neutral-400',
          'focus:border-ink',
          error ? 'border-red-400' : 'border-neutral-300',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, id, className = '', ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-ink tracking-wide">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={[
          'w-full px-3 py-2.5 text-sm text-ink bg-white',
          'border rounded outline-none resize-y min-h-[100px]',
          'font-sans placeholder:text-neutral-400',
          'focus:border-ink transition-colors duration-150',
          error ? 'border-red-400' : 'border-neutral-300',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
