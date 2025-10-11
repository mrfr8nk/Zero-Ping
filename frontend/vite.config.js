import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      clientPort: 443
    },
    allowedHosts: [
      '.replit.dev',
      '.repl.co'
    ],
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  }
});
