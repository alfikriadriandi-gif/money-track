import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.ts
export default defineConfig({
  // ... config lain
  resolve: {
    alias: {
      "react-is": "react-is",
    },
  },
})  
