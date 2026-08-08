import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    watch: {
      ignored: [
        '**/public/*.png',
        '**/public/*.jpg',
        '**/public/*.jpeg',
        '**/public/*.svg',
        '**/public/*.mp4',
        '**/public/*.webm',
        '**/public/*.mov',
        '**/*.crdownload',
        '**/*.part',
        '**/*.tmp',
      ]
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      // Proxy /uploads to backend so local dev matches production exactly.
      // Uploaded files are stored in server/uploads/ (not client/public/).
      '/uploads': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      }
    }
  }
});
