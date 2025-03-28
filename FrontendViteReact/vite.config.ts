import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Usa './' o '/' para asegurar que las rutas estén bien configuradas
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});