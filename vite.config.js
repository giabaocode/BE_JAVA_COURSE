import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE is set by GitHub Actions to /<repo-name>/ when deploying to GH Pages.
// For local dev it defaults to '/'.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
