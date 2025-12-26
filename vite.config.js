import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3010, strictPort: true, cors: true },
  optimizeDeps: { entries: ['index.html', 'src/main.jsx'] }, // evita scansioni su tutto il disco
});
