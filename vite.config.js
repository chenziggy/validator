// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: true,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'MyLib',
      formats: ['iife'],
      fileName: 'index',
    },
  },
})