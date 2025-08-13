import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ NECESSARIO per HashRouter e deploy statici
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  },
});
