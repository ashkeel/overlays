import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig((env) => ({
  base: '/static/',
  build: {
    rollupOptions: {
      input: {
        chat: resolve(__dirname, 'chat/index.html'),
        alerts: resolve(__dirname, 'alerts/index.html'),
      },
    },
  },
}));
