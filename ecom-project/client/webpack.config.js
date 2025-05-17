module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        // Exclude the problematic modules from source-map-loader
        exclude: [
          /node_modules\/@reduxjs\/toolkit/,
          /node_modules\/react-redux/,
          /node_modules\/react-toastify/
        ]
      }
    ]
  },
  ignoreWarnings: [/Failed to parse source map/]
}; 