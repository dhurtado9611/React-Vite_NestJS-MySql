import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/FrontendViteReact/', // ✅ Ruta base ajustada a la carpeta del proyecto
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000, // Aumenta el límite a 1000 kB
  },
});