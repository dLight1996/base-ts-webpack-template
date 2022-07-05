const { isDev } = require('./config/constant');

// console.log(isDev, process.env, 1);
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  plugins: [isDev && 'react-refresh/babel'].filter(Boolean),
};
