import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // ── Compresión Gzip ──
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Solo comprimir archivos > 10KB
    }),

    // ── Compresión Brotli (mejor ratio) ──
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
    }),
  ],

  build: {
    // ── Minificación con Terser (más agresiva que esbuild) ──
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,    // Elimina console.log en producción
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },

    // ── Target mínimo moderno ──
    target: 'es2015',

    // ── Separación de Chunks (Code Splitting) ──
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — siempre se necesita, chunk separado y cacheable
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // Redux — cargado junto al core de la app
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],

          // Leaflet + react-leaflet — pesado (~200KB), solo se usa en /ubicacion
          'vendor-maps': ['leaflet', 'react-leaflet'],

          // GSAP — animaciones, solo se usa en el carousel
          'vendor-gsap': ['gsap'],

          // axios — cliente HTTP
          'vendor-axios': ['axios'],

          // Íconos — pueden ser pesados dependiendo de cuántos se importen
          'vendor-icons': ['react-icons'],
        },
      },
    },

    // ── Tamaño de chunk para warning ──
    chunkSizeWarningLimit: 1000,
  },

  // ── Pre-bundling de dependencias frecuentes ──
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'axios',
      'react-hook-form',
    ],
  },
})
