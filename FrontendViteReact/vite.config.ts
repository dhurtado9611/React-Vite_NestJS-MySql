import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'https:dhurtado9611/React-Vite_NestJS-MySql',
  build: {
    chunkSizeWarningLimit: 1000, // Aumentar el límite a 1000 kB
  },
})
