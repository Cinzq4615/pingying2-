import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // 确保本地开发时 process.env.API_KEY 能够被正确识别
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY || process.env.API_KEY),
  },
  server: {
    port: 5173,
    strictPort: true,
  }
});