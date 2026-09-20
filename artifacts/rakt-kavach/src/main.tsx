import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';
import './index.css';

if ('serviceWorker' in navigator) window.addEventListener('load', () => { void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}registerSW.js`); });
const root = document.getElementById('root');
if (!root) throw new Error('Root element was not found.');
createRoot(root).render(<ErrorBoundary><App /></ErrorBoundary>);
