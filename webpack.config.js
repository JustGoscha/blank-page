const path = require("path")
const webpack = require("webpack")
const { CheckerPlugin } = require("awesome-typescript-loader")

module.exports = {
  mode: process.env.NOVE_ENV,
  entry: {
    "blank-page": "./src/index.ts",
    "blank-page.min": "./src/index.ts"
  },
  output: {
    path: path.resolve(__dirname, "_bundles"),
    filename: "[name].js",
    libraryTarget: "umd",
    library: "BlankPage",
    umdNamedDefine: true
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: "awesome-typescript-loader",
          options: {
            silent: true,
            useCache: true
          }
        }
      }
    ]
  },
  optimization: {
    minimize: true
  }
}
