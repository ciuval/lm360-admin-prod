// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { Analytics } from "@vercel/analytics/next"export default 
defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1500 }
})

