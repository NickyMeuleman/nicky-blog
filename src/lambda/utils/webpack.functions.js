const nodeExternals = require('webpack-node-externals');

// https://github.com/apollographql/react-apollo/issues/1737#issuecomment-372946515

module.exports = {
  module: {
    rules: [
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: [],
      },
    ],
  },
  externals: [nodeExternals()],
};
