import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3500, // Set frontend to run on port 3500
    strictPort: true, // Ensures the exact port is used
    hmr: {
      overlay: false, // Disable WebSocket error overlay
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Your backend URL
        changeOrigin: true,
        secure: false,
        ws: true, // Enable WebSocket proxy
      }
    }
  }
});
