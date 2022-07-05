const { merge } = require('webpack-merge');
const openBrowser = require('react-dev-utils/openBrowser');
const clearConsole = require('react-dev-utils/clearConsole');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const baseConfig = require('./webpack.config');
const { resolvePath, srcPath } = require('./path');
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const StylelintWebpackPlugin = require("stylelint-webpack-plugin");

const port = 3000;
module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  stats: 'errors-only',
  devServer: {
    hot: true,
    port,
    client: {
      logging: 'error',
      overlay: true,
      progress: true,
    },
    setupMiddlewares(middlewares, devServer) {
      openBrowser(`http://localhost:${port}`);
      clearConsole();
      return middlewares;
    },
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['You application is running here http://localhost:3000'],
        notes: ['Some additionnal notes to be displayed unpon successful compilation'],
      },
    }),
    new ForkTsCheckerWebpackPlugin({
      issue: {
        include: [
          { file: resolvePath(srcPath, '*.{ts,tsx}'), severity: 'warning' },
          { file: '**/src/**/*.{ts,tsx}', severity: 'warning' },
        ],
        exclude: [],
      },
      typescript: {
        mode: 'write-references',
      },
    }),
    new ESLintWebpackPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      formatter: require.resolve('react-dev-utils/eslintFormatter'),
    }),
    new StylelintWebpackPlugin({
      fix: true,
    }),
  ].filter(Boolean),
});
