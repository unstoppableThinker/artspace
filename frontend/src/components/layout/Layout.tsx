import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: number;
}

export default function Layout({ children, maxWidth = 680 }: LayoutProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <main style={{ maxWidth, margin: '0 auto', padding: '32px 16px 80px' }}>
        {children}
      </main>
    </div>
  );
}
