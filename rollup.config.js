/* eslint env:"node" */

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

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
