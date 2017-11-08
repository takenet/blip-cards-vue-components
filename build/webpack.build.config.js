process.env.NODE_ENV = 'production'

var webpack = require("webpack");
var path = require('path')
var version = require("./../package.json").version;
var banner = "/**\n" + " * blip-cards v" + version + "\n" + " * https://github.com/takenet/blip-cards-vue-components\n" + " * Released under the MIT License.\n" + " */\n";
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var StatsPlugin = require("stats-webpack-plugin");

var utils = require('./utils')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')

var cssFileName = "blip-cards.css";
var jsFileName = "blip-cards.js";

if(process.env.MINIFY && process.env.MINIFY === "false"){
  jsFileName = "blip-cards-full.js"
}
var minifyPlugins = [
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    sourceMap:true,
    comments: false,
    beautify: false
  }),
];

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({sourceMap: true,extract: true})
  },
  entry: path.join(__dirname, '..', "src/index.js"),
  output: {
    path: path.join(__dirname, '..', "dist"),
    filename: jsFileName,
    library: "BlipCards",
    libraryTarget: "umd"
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.BannerPlugin({
      banner: banner,
      raw: true
    }),
    new ExtractTextPlugin({filename: cssFileName, allChunks: true}),
    new StatsPlugin('stats.json')
  ],
  resolve: {
    aliasFields: ["browser"]
  }
});

if(process.env.MINIFY && process.env.MINIFY === "true"){
  webpackConfig.plugins = webpackConfig.plugins.concat(minifyPlugins);
}
module.exports = webpackConfig;
