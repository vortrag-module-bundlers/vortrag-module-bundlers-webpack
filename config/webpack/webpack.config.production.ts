import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import { SubresourceIntegrityPlugin } from 'webpack-subresource-integrity';
import WorkboxPlugin from 'workbox-webpack-plugin';

import { buildWebpackConfig } from './webpack.config.common';

export default buildWebpackConfig('production', {
  devtool: 'source-map',

  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[id].[chunkhash].js',
    clean: true,
    crossOriginLoading: 'anonymous',
  },

  plugins: [
    new BundleAnalyzerPlugin({ analyzerMode: 'static', reportFilename: '../temp/report.html' }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
    <any>new WebpackPwaManifest({
      name: 'Vortrag Module Bundlers',
      short_name: 'R-Demo',
      description: 'Beispielapp für den Vortrag - Webpack Version',
      display: 'standalone',
      publicPath: '/',
      background_color: '#ffffff',
      crossorigin: 'use-credentials',
      icons: [
        {
          src: 'src/assets/icon.png',
          sizes: [96, 128, 192, 256, 384, 512],
        },
      ],
      theme_color: '#317EFB',
    }),
    new SubresourceIntegrityPlugin({
      hashFuncNames: ['sha256'],
    }),
  ],
});
