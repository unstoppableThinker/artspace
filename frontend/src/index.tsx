import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global styles
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #fff;
    color: #111;
    -webkit-font-smoothing: antialiased;
  }

  :focus-visible {
    outline: 2px solid #111;
    outline-offset: 2px;
  }

  img { max-width: 100%; }

  ::selection {
    background: #111;
    color: #fff;
  }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
