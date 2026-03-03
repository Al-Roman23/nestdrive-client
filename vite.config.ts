import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// This Is The Vite Configuration
export default defineConfig({
  plugins: [
    react(),
    // This Enables Tailwind CSS Version Four Support
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // This Maps The Src Directory To The At Symbol
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
