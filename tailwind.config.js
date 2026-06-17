/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ini biar Tailwind baca file .tsx lo
    "./App.tsx",                 // Tambahin ini kalau file App.tsx ada di luar folder src
  ],
  theme: {
    extend: {
      colors: {
        ovo: {
          dark: '#0b0b0f',
          purple: '#4c2a86',
          light: '#f4f7fe',
        }
      },
    },
  },
  plugins: [],
}