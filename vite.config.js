import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: './', // relative base path so it deploys seamlessly to GitHub Pages or any subpath
  plugins: [react()],
  server: {
    port: 5173,
    host: true // allows testing from mobile phones on same local network!
  }
});
