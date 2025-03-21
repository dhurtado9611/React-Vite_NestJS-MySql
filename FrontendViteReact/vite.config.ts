import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'/FrontendViteReact/', // Ruta base para producción
  build: {
    chunkSizeWarningLimit: 1000, // Aumentar el límite a 1000 kB
  },
})
