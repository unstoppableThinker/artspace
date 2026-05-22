import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ fontSize: 13, fontWeight: 500, color: '#111', letterSpacing: '0.01em' }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: `1px solid ${error ? '#ef4444' : '#d4d4d4'}`,
          borderRadius: 4,
          fontSize: 14,
          color: '#111',
          background: '#fff',
          outline: 'none',
          transition: 'border-color 0.15s',
          boxSizing: 'border-box',
        }}
        className={className}
        {...props}
      />
      {error && (
        <span style={{ fontSize: 12, color: '#ef4444' }}>{error}</span>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ fontSize: 13, fontWeight: 500, color: '#111' }}
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: `1px solid ${error ? '#ef4444' : '#d4d4d4'}`,
          borderRadius: 4,
          fontSize: 14,
          color: '#111',
          background: '#fff',
          outline: 'none',
          resize: 'vertical',
          minHeight: 100,
          fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
        {...props}
      />
      {error && <span style={{ fontSize: 12, color: '#ef4444' }}>{error}</span>}
    </div>
  );
}
