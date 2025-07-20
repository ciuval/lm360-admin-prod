import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_'], // carica solo variabili che iniziano con VITE_
  server: {
    port: 5173,
    open: true // apre il browser automaticamente
  }
});
