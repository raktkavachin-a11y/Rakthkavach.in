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
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Rakt Kavach',
        short_name: 'Rakt Kavach',
        description: 'Haryana State Emergency Blood & Health Network - A calm, auditable emergency blood network.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#0a0f1d',
        theme_color: '#e11d48',
        lang: 'en-IN',
        dir: 'ltr',
        prefer_related_applications: false,
        categories: ['medical', 'health', 'emergency'],
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Emergency Blood Request',
            short_name: 'Blood Request',
            description: 'Request emergency blood supply',
            url: '/?action=request',
            icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }]
          },
          {
            name: 'Blood Donation',
            short_name: 'Donate Blood',
            description: 'Register as blood donor',
            url: '/?action=donate',
            icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }]
          }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/static\//],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 5242880
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: '/index.html'
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(appRoot, 'src'),
      '@assets': path.resolve(appRoot, '..', '..', 'attached_assets')
    },
    dedupe: ['react', 'react-dom']
  },
  root: appRoot,
  build: {
    outDir: path.resolve(appRoot, 'dist'),
    emptyOutDir: true,
    minify: 'terser',
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: Number(process.env.PORT || 3000),
    host: true,
    strictPort: false
  },
  preview: {
    port: Number(process.env.PORT || 3000),
    host: true,
    strictPort: false
  }
});
