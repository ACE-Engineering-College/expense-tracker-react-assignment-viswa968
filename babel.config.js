module.exports = {
  presets: [
    '@babel/preset-env', // Allows Babel to compile JavaScript for older browsers
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
};
