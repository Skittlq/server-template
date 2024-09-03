const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.config"); // Adjust the path to your base config

module.exports = merge(commonConfig, {
  mode: "development",
  devtool: "inline-source-map", // Source maps for debugging
  // You can add more development-specific settings here
});
