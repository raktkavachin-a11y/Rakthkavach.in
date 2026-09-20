import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';

const basePath = process.env.BASE_PATH || '/';
const appRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'icon-192.svg', 'icon-512.svg'],
      manifest: {
        name: 'Rakt Kavach National Blood Grid',
        short_name: 'Rakt Kavach',
        description: 'A calm, auditable emergency blood network.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#edf1f6',
        theme_color: '#151d2b',
        lang: 'en-IN',
        icons: [
          { src: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/',
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(appRoot, 'src'),
      '@assets': path.resolve(appRoot, '..', '..', 'attached_assets'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: appRoot,
  build: {
    outDir: path.resolve(appRoot, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port: Number(process.env.PORT || 3000),
    host: true,
  },
  preview: {
    port: Number(process.env.PORT || 3000),
    host: true,
  },
});
