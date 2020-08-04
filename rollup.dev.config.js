import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import html from '@rollup/plugin-html'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'

// eslint-disable-next-line no-undef
const dev = process.env.ROLLUP_WATCH === 'true'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

export default {
  input: 'example/index.ts',
  output: [
    {
      dir: 'docs',
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
    postcss(),
    html({
      publicPath: dev ? '' : '/virtual-list/',
      title: 'Virtual list page',
      template: ({ title, files, publicPath }) => {
        const scripts = (files.js || [])
          .map(({ fileName }) => {
            return `<script src="${publicPath}${fileName}"></script>`
          })
          .join('\n')
        const links = (files.css || [])
          .map(({ fileName }) => {
            return `<link href="${publicPath}${fileName}" rel="stylesheet">`
          })
          .join('\n');
        return `
          <!doctype html>
          <html>
            <head>
              <meta charset="utf-8"/>
              <title>${title}</title>
              ${links}
            </head>
            <body>
              <div id="app"></div>
              ${scripts}
            </body>
          </html>
        `
      },
    }),
    dev && serve('docs'),
  ],
}
