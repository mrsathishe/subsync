import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  // Remove base path for direct port access
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',  // Allow external connections
    port: 5000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  },
  preview: {
    host: '0.0.0.0',  // Allow external connections for production preview
    port: 5000
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  assetsInclude: ['**/*.woff', '**/*.woff2'],
  publicDir: 'public'
})
