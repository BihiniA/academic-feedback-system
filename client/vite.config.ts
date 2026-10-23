import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  esbuild: {
    loader: "jsx",
    include: /\.(jsx|js)$/,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': '/src',  // Add alias to point to the src directory
    },
  },
  build: {
    outDir: 'dist',
  },
  // Specify the correct entry point
  server: {
    open: true,
  },
  root: '.',
  publicDir: 'public',
});
