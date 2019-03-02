module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'eslint-loader'
      }
    ]
  },
  devServer: {
    open: 'Google Chrome',
    inline: false,
  }
}
