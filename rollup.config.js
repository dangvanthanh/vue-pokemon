import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import vue from 'rollup-plugin-vue'

export default {
  entry: './src/app.js',
  plugins: [
    vue(),
    nodeResolve({
      jsnext: true
    }),
    commonjs({
      include: 'node_modules/**'
    })
  ],
  dest: './bundle.js'
}
