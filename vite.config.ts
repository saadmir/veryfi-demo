import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/veryfi/': {
        target: 'https://api.veryfi.com/api/v8/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/veryfi/, ''),
      },
    },
  },
})
