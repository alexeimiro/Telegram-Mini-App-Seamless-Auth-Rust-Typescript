import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    cors: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    hmr: {
      clientPort: 443,
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'customer-support-app.loca.lt',
      '.loca.lt', // Allow all subdomains of loca.lt
    ],
  },
  preview: {
    host: true,
  },
  base: './',
  build: {
    outDir: 'dist',
  },
  optimizeDeps: {
    exclude: ['@telegram-apps/sdk'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
});