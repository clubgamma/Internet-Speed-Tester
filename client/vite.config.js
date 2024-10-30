import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.BACK_END_URL': JSON.stringify(env.BACK_END_URL)
    },
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: true
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.BACK_END_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    base: '/' // Ensures assets are loaded from the correct path
  }
})