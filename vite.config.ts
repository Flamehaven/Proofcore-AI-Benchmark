import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// v1.0.2: Bundle Optimization for Offline-First Performance
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    })
  ],
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // [+] Production builds: no sourcemaps (save 20-30%)
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        dead_code: true
      },
      mangle: true
    },
    rollupOptions: {
      output: {
        // [+] Code splitting: separate vendors & core
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'd3-vendor': ['d3'],
          'ui-core': [
            'src/design-system',
            'src/components'
          ]
        },
        // [+] Minimize chunk names for smaller filenames
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (name.endsWith('.css')) {
            return 'css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    // [+] Optimize chunk size thresholds
    chunkSizeWarningLimit: 600,
    reportCompressedSize: true,
    // [+] CSS code splitting
    cssCodeSplit: true,
    // [+] Module preload
    modulePreload: {
      polyfill: false // Already in modern browsers
    }
  },
  // [+] Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'd3'],
    exclude: ['pyodide'] // Lazy-load heavy modules
  }
});
