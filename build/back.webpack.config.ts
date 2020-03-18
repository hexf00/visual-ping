// @ts-ignore
const path = require("path");
// @ts-ignore
const nodeExternals = require("webpack-node-externals")
module.exports = {
  entry: {
    back: path.join(__dirname, '../src/back/server.ts')
  },
  mode: "development",
  externals: [nodeExternals()],
  target: 'node',
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs',
    publicPath: './dist/', //与import函数配合使用，只能在浏览器环境使用
    path: path.join(__dirname, '../dist')
  },
  // 必须存在，否则TS报错
  resolve: {
    extensions: [".ts", ".js"]
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //     name: "common"
  //   }
  // },
  // 开启后才能看到
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.ts$/,
      use: [{
        loader: 'ts-loader'
      }],
    }
    ]
  },
  plugins: []
}