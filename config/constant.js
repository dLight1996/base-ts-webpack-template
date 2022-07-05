const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
module.exports = {
  isDev,
  isProd,
  cssRegex,
  cssModuleRegex,
  sassRegex,
  sassModuleRegex,
};
