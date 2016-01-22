module.exports = {
 entry: ['./app/'],
 output: {
   filename: "./build/bundle.js"
 },
 module: {
  loaders: [
    {
      test: /\.js$/,
      loader: "babel-loader",
      exclude: /node_modules/,
      // Options to configure babel with
      query: {
        plugins: ['transform-runtime'],
        presets: ['es2015'],
      }
    },
  ]
},
 resolve: {
   extensions: ['', '.js', '.es6']
 },
}
