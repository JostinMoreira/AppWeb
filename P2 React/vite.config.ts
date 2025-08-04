import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import singleSpa from 'vite-plugin-single-spa';

export default defineConfig({
  plugins: [
    react(),
    singleSpa({
      type: 'mife',
      serverPort: 4201,
      spaEntryPoints: 'src/main.single-spa.tsx'
    })
  ],
  server: {
    port: 4201,
    cors: true // <-- AÑADE ESTA LÍNEA
  }
})