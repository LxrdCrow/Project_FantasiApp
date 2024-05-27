const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinPlugin = require('imagemin-webpack-plugin').default;
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  mode: 'production', 
  entry: "./src/JS/script.js",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "js/[name].[contenthash].js",
    assetModuleFilename: "assets/[hash][ext][query]",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource'
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin(), 
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new ImageMinPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }), 
    new CompressionPlugin() 
  ],
  performance: {
    hints: false 
  },
  devServer: {
    port: 5000,
    open: {
      app: {
        name: "chrome",
      },
    },
    static: {
      directory: path.resolve(__dirname, 'docs'),
    },
  }
};

