import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react([
    'resources/css/app.css',
    'resources/js/main.jsx', // Update the entry module here
])],
})
