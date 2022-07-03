import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: path.resolve(process.cwd(), 'demo'),
  build: {
    target: 'es2015',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VirtualList',
    },
  },
})
