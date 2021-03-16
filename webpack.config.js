const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
// const VueLoaderPlugin  = require("vue-loader");

module.exports = (env, argv) => {
  return {
    entry: './src/app.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html"
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "main.css",
        chunkFilename: "main.css"
      }),
      // new VueLoaderPlugin()

      // To strip all locales except “en”
      new MomentLocalesPlugin(),
    //   new MomentLocalesPlugin({
    //     localesToKeep: ['my'],
    // }),
    ],
    module: {
      rules: [{
          test: /\.css$/,
          use: [{
              loader: MiniCssExtractPlugin.loader,
              options: {
                // you can specify a publicPath here
                // by default it use publicPath in webpackOptions.output
                publicPath: './dist/'
              }
            },
            "css-loader"
          ]
        },
        {
          test: /\.scss$/,
          use: [
            argv.mode !== "production" ? "style-loader" : MiniCssExtractPlugin.loader, // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
            "sass-loader" // compiles Sass to CSS, using Node Sass by default
          ]
        },
        // {
        //   test: /.vue$/,
        //   loader: "vue-loader"
        //   }
      ]
    },
    resolve: {
      // alias: {
      //   'vue$': 'vue/dist/vue.esm.js'
      // },
      // extensions: ['*', '.js', '.vue', '.json']
    },
  }
};