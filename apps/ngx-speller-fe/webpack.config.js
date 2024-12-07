const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      assert: require.resolve('assert'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
      process: require.resolve('process'),
      url: require.resolve('url')
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
};
