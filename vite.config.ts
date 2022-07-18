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
      build: {
        target: 'es2015',
        outDir: path.resolve(__dirname, 'docs'),
      },
    }
  }

  return {
    root: path.resolve(process.cwd(), 'demo'),
    ...buildOptions,
  }
})
