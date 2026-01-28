import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ninja-store/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
