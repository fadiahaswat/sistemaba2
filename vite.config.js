import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 1918,
    strictPort: true,
    watch: {
      ignored: ['**/*.svg', '**/*.pdf']
    }
  },
});
