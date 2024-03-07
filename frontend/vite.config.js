import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react([
    'src/index.css',
    'src/main.jsx', // Update the entry module here
])],
})
