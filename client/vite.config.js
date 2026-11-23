import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { siteMetadata, resolveSiteUrl } from './site-metadata.js'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react(), {
    name: 'portfolio-site-metadata',
    transformIndexHtml() {
      const local = loadEnv('production', fileURLToPath(new URL('../', import.meta.url)), 'SITE_');
      return siteMetadata(resolveSiteUrl({ ...local, ...process.env }));
    }
  }],
  base: '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
              return 'vendor-react';
            }
            if (id.includes('react-markdown') || id.includes('remark-gfm')) {
              return 'vendor-md';
            }
          }
        }
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
})
