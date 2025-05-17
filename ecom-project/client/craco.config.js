module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable source maps in development
      webpackConfig.devtool = false;
      
      // Add rule to exclude source map loading for problematic modules
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [
          /node_modules\/@reduxjs\/toolkit/,
          /node_modules\/react-redux/,
          /node_modules\/react-toastify/
        ]
      });

      // Handle module not found errors for specific packages
      webpackConfig.resolve = webpackConfig.resolve || {};
      webpackConfig.resolve.fallback = webpackConfig.resolve.fallback || {};
      
      // Add fallbacks for problematic packages
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'react-redux/es/index.js': require.resolve('react-redux'),
        'react-toastify/dist/react-toastify.esm.mjs': require.resolve('react-toastify')
      };
      
      return webpackConfig;
    }
  }
}; 