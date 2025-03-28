import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Asegúrate de que esté configurado correctamente
  build: {
    outDir: 'dist',
  },
});