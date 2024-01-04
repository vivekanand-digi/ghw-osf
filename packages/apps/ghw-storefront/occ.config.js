/* eslint-env node */

module.exports = {
  splitting: true, // "esbuild" splitting // https://esbuild.github.io/api/#splitting
  external: [], // "esbuild" externals - https://esbuild.github.io/api/#external
  loader: {}, // "esbuild" loaders - https://esbuild.github.io/api/#loader
  plugins: [],     // "esbuild" plugins - https://esbuild.github.io/plugins/
  loader: { '.js': 'jsx' },
  // "esbuild" plugins - https://esbuild.github.io/plugins/
  css: {
    // options passed to the "css" plugin
    loader: {} // "esbuild" plugins - https://esbuild.github.io/api/#loader
  },
  sass: {
    // options passed to the sass plugin
    // https://sass-lang.com/documentation/js-api/interfaces/Options
  }
};
