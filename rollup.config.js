import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/virtual-list.es.js',
      format: 'es',
    },
    {
      file: 'dist/virtual-list.umd.js',
      format: 'umd',
      name: 'VirtualList',
    },
  ],
  plugins: [
    resolve({ extensions }),
    typescript(),
    babel({
      babelHelpers: 'bundled',
    }),
  ],
}
