import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  narrow?: boolean;
}

export default function Layout({ children, narrow = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className={`mx-auto px-4 pt-8 pb-20 ${narrow ? 'max-w-2xl' : 'max-w-4xl'}`}>
        {children}
      </main>
    </div>
  );
}
