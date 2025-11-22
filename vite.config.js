import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/freeicons_claude_sonnet_4/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
