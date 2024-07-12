import {defineConfig} from 'vite';
import path from 'path';

const projectRootDir = path.resolve(__dirname);

export default defineConfig({
  plugins: [],
  build: {
    emptyOutDir: false,
    outDir: './public/',

    // make a manifest and source maps.
    manifest: true,
    sourcemap: true,

    rollupOptions: {
      // Use a custom non-html entry point
      input: path.resolve(projectRootDir, './resources/js/index.js'),
    },
  },
  resolve: {
    alias: [
      {
        find: 'app',
        replacement: path.resolve(projectRootDir, './resources/js'),
      },
    ],
  },
  esbuild: {},
  optimizeDeps: {
    include: [],
  }
});