/* eslint env:"node" */

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/time.js',
        format: 'umd', 
        name: 'minno-time',
        sourcemap: true
    },
    plugins: [
        postcss({plugins:[cssnano()]}),
        resolve(),
        commonjs(),
        production && uglify() // minify, but only in production
    ],
    external:['lodash','minno-sequencer'],
    globals: {
        lodash: '_',
        'minno-sequencer': 'Database'
    }
};
