// const {createGlobPatternsForDependencies} = require('@nx/react/tailwind');
const {join} = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    // This requires to define nx: { sourceRoot: 'src' } in the package.json of each dependency library
    // ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
