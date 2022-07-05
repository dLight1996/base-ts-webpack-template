const path = require('path');

const appModulePath = path.resolve(process.cwd());
const srcPath = path.resolve(process.cwd(), 'src');
const publicPath = path.resolve(process.cwd(), 'public');

const resolvePath = (module, pathname) => path.resolve(module, pathname);
const envConfig = {
  development: resolvePath(appModulePath, '.env.dev'),
  production: resolvePath(appModulePath, '.env.prod'),
};
module.exports = {
  appModulePath,
  srcPath,
  publicPath,
  resolvePath,
  envConfig,
};
