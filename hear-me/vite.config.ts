import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Polyfill globals
export default defineConfig({

  server: {
    host: "0.0.0.0", // 👈 allows access from LAN
    port: 5173,
  },
  plugins: [react(),
        tailwindcss(),

  ],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
})
