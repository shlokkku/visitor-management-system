import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Proxy API requests in development
    },
  },
  build: {
    sourcemap: false, // Disable sourcemaps for production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Split vendor libraries for optimization
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Avoid warnings for large chunks
  },
  preview: {
    port: 5000, // Optional: Set a custom port for `vite preview`
  },
  base: '/', // Use root-relative paths for deployment on Vercel
});
