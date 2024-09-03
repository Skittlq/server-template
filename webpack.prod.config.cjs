const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.config"); // Adjust the path to your base config
const TerserPlugin = require("terser-webpack-plugin"); // For minification

module.exports = merge(commonConfig, {
  mode: "production",
  devtool: "source-map", // Optional: Source maps for production (could be omitted)
  optimization: {
    minimize: true, // Enable minification
    minimizer: [new TerserPlugin()], // Use Terser for minification
  },
  // You can add more production-specific optimizations here
});
