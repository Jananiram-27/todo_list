import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3500,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3500,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        ws: true, // Allow WebSocket connections
      }
    }
  }
});
