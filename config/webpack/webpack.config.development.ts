import { buildWebpackConfig } from './webpack.config.common';

export default buildWebpackConfig('development', {
  devtool: 'cheap-module-source-map',

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },

  devServer: {
    historyApiFallback: true,
    port: 3000,
    hot: true,
    liveReload: false,
  },
});
