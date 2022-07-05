const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const WebpackBarPlugin = require('webpackbar');
const {
  srcPath, resolvePath, appModulePath, publicPath, envConfig,
} = require('./path');
const {
  isDev, isProd, cssRegex, cssModuleRegex, sassRegex, sassModuleRegex,
} = require('./constant');

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isDev && require.resolve('style-loader'),
    isProd && MiniCssExtractPlugin.loader,
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    // require.resolve('postcss-loader'),
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push({
      loader: require.resolve('resolve-url-loader'),
      options: {},
    }, {
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: true,
      },
    });
  }
  return loaders;
};

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: `${srcPath}/index.tsx`,
  output: {
    path: resolvePath(appModulePath, 'dist'),
    clean: true,
    filename: 'js/[name].[contenthash:8].js',
    assetModuleFilename: 'assets/[name].[ext]',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  infrastructureLogging: {
    level: 'error',
  },
  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 10,
        },
        common: {
          name: 'common',
          test: /[\\/]src[\\/]/,
          minSize: 1024,
          chunks: 'all',
          priority: 5,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [{
          loader: require.resolve('babel-loader'),
        }],
      },
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: true,
          modules: {
            mode: 'icss',
          },
        }),
        sideEffects: true,
      },
      {
        test: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: true,
          modules: {
            mode: 'local',
            getLocalIdent: getCSSModuleLocalIdent,
          },
        }),
      },
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 3,
            sourceMap: true,
            modules: {
              mode: 'icss',
            },
          },
          'sass-loader',
        ),
        sideEffects: true,
      },
      {
        test: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 3,
            sourceMap: true,
            modules: {
              mode: 'local',
              getLocalIdent: getCSSModuleLocalIdent,
            },
          },
          'sass-loader',
        ),
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolvePath(publicPath, 'index.html'),
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {}),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:5].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    }),
    new Dotenv({
      path: envConfig[process.env.NODE_ENV],
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true,
    }),
    new WebpackBarPlugin({
      color: '#1890ff',
    }),
  ].filter(Boolean),
};
