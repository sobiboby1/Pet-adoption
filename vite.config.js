import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // ⬅️ This keeps your asset paths working perfectly on the phone
  plugins: [react()],
})