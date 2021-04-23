import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ForkTsCheckerNotifierWebpackPlugin from 'fork-ts-checker-notifier-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import {
  Configuration,
  DefinePlugin,
  HotModuleReplacementPlugin,
  ProgressPlugin,
  RuleSetRule,
  WebpackOptionsNormalized,
} from 'webpack';
import merge from 'webpack-merge';

export type Mode = Configuration['mode'];
export type WebpackConfiguration = Configuration & { devServer?: WebpackOptionsNormalized['devServer'] };

const root = path.resolve(__dirname, '..', '..');
const srcFolders = [path.resolve(root, 'src'), path.resolve(root, 'packages')];

function buildCssLoader(isModule: boolean): Array<RuleSetRule | string> {
  return [
    MiniCssExtractPlugin.loader,
    ...(isModule ? ['css-modules-typescript-loader'] : []),
    {
      loader: 'css-loader',
      options: {
        importLoaders: 2,
        modules: isModule,
        sourceMap: true,
      },
    },
    {
      loader: 'postcss-loader',
      options: { postcssOptions: { plugins: ['postcss-preset-env'] } },
    },
    {
      loader: 'sass-loader',
    },
  ];
}

export function buildWebpackConfig(mode: Mode, overrides: WebpackConfiguration): WebpackConfiguration {
  const isProduction = mode === 'production';
  const isDevelopment = !isProduction;

  const defaultConfig: WebpackConfiguration = {
    context: root,
    mode,

    entry: isDevelopment ? ['react-hot-loader/patch', './src/index.tsx'] : './src/index.tsx',
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      mainFields: ['es2015', 'module', 'main'],
      plugins: [new TsconfigPathsPlugin()],
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[id].js',
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: srcFolders,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env']],
                plugins: isDevelopment ? [require.resolve('react-refresh/babel')] : [],
              },
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: isDevelopment,
              },
            },
          ],
        },
        {
          test: /\.module.((c|sa|sc)ss)$/i,
          use: buildCssLoader(true),
          include: srcFolders,
        },
        {
          test: /\.((c|sa|sc)ss)$/i,
          use: buildCssLoader(false),
          include: srcFolders,
          exclude: /\.module.((c|sa|sc)ss)$/i,
        },
        {
          test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
          type: 'asset',
        },
      ],
    },
    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',

      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 2020,
            module: true,
          },
        }),
        new CssMinimizerPlugin(),
      ],
    },
    plugins: [
      new ProgressPlugin(),
      new DefinePlugin({ 'process.env.mode': JSON.stringify(mode) }),
      new MiniCssExtractPlugin(),

      new ForkTsCheckerNotifierWebpackPlugin({ excludeWarnings: true }),
      new ForkTsCheckerWebpackPlugin({
        async: isDevelopment,

        eslint: {
          enabled: true,
          files: ['./src/**/*.{ts,tsx}'],
        },
      }),

      new HtmlWebpackPlugin({
        template: 'src/index.html',
        minify: isProduction,
      }),

      <any>new CircularDependencyPlugin({
        exclude: /dist|node_modules/,
        include: /src|packages/,
        failOnError: true,
        allowAsyncCycles: false,
        cwd: __dirname,
      }),

      ...(isDevelopment ? [new HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()] : []),
    ],
  };

  return merge(defaultConfig, overrides);
}
