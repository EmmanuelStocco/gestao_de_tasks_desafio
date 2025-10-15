import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@gestao-tarefas/types': path.resolve(__dirname, '../../packages/types/src'),
      '@gestao-tarefas/utils': path.resolve(__dirname, '../../packages/utils/src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
})
