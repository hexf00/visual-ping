// @ts-ignore
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    front: path.join(__dirname, '../src/front/index.ts'),
  },
  mode: "development",
  output: {
    filename: '[name].js',
    publicPath: '/public/dist/', //与import函数配合使用，只能在浏览器环境使用
    path: path.join(__dirname, '../public/dist')
  },
  devServer: {
    // https://webpack.docschina.org/configuration/dev-server/#devserver-openpage
    host: 'localhost',
    port: '8088',
    open: true,//自动拉起浏览器
    hot: true,//热加载
    openPage: "src/front/views/index.html"
    //hotOnly:true
  },
  // 必须存在，否则TS报错
  resolve: {
    extensions: [".ts", ".js"]
  },
  optimization: {
    splitChunks: {
      //所有公共模块
      chunks: 'all',
      name: "front-common"
    }
  },
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
  plugins: [
    //热更新插件
    new webpack.HotModuleReplacementPlugin()
  ]
}