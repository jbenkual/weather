module.exports = {
  entry: "./src/js/main.js",
  output: {
    filename: "./src/js/bundle.js"
  },
  watch: true,
  module: {
    loaders: [
        { test: /\.css$/, loader: "style!css" }
    ]
	}
}
