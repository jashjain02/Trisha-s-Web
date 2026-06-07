import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('firebase')) return 'firebase'
          if (id.includes('framer-motion')) return 'animation'
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('react/')) return 'vendor'
        },
      },
    },
  },
})
