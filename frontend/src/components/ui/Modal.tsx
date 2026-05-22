import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: number;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = 560 }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded w-full overflow-auto shadow-2xl"
        style={{ maxWidth, maxHeight: '90vh' }}
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-5">
            <h2 className="text-lg font-semibold text-ink">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-ink-faint hover:text-ink text-xl leading-none p-1 transition-colors"
            >
              ×
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
