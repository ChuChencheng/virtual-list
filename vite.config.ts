import path from 'path'
import { defineConfig, UserConfigExport } from 'vite'

export default defineConfig(({ mode }) => {
  let buildOptions: UserConfigExport = {
    build: {
      target: 'es2015',
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'VirtualList',
      },
    },
  }

  if (mode === 'docs') {
    buildOptions = {
      base: '/virtual-list/',
      build: {
        target: 'es2015',
        outDir: path.resolve(__dirname, 'docs'),
      },
    }
  }

  return {
    root: mode === 'production' ? process.cwd() : path.resolve(process.cwd(), 'demo'),
    ...buildOptions,
  }
})
