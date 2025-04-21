import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Inline dynamic imports for fully bundled entries
      inlineDynamicImports: true,
      // Define all entry points used by your manifest
      input: {
        popup: resolve(__dirname, 'src/popup.html'),
        options: resolve(__dirname, 'src/options.html'),
        // include the background service worker and content script as entry points
        'service-worker': resolve(__dirname, 'src/service-worker.jsx'),
        script: resolve(__dirname, 'src/script.jsx'),
      },
      output: {
        // output files so that the manifest references (eg. "src/script.js") match correctly
        entryFileNames: 'src/[name].js',
        chunkFileNames: 'src/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
