import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app':       path.resolve(__dirname, './src/app'),
      '@features':  path.resolve(__dirname, './src/features'),
      '@shared':    path.resolve(__dirname, './src/shared'),
      '@styles':    path.resolve(__dirname, './src/styles'),
      '@pages':     path.resolve(__dirname, './src/pages'),
      '@lib':       path.resolve(__dirname, './src/lib'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@assets':    path.resolve(__dirname, './src/assets'),
    },
  },
})
