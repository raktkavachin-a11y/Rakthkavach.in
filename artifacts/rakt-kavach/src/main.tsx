import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element was not found.');

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((error: unknown) => {
      console.error('PWA service worker registration failed:', error);
    });
  });
}

createRoot(root).render(<ErrorBoundary><App /></ErrorBoundary>);
