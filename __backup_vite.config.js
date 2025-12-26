import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 3010, strictPort: true },
  // evita che Vite tenti di parsare .html come entry JS
  assetsInclude: ['**/*.html']
})
