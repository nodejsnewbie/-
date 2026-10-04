import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // admin 用 5173，商城用 5174，两端可同时开着联调同一个后端。
      port: 5174,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // 后端（NestJS）是独立进程，开发期由 Vite 代理 /api，避免前端直连跨域。
      proxy: {
        '/api': {
          target: process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:3000',
          changeOrigin: true,
        },
      },
    },
  };
});
