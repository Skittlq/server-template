const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node", // Optimizes the bundle for Node.js
  entry: "./server.js", // Entry point of your server application
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "bundle.cjs", // Output bundle filename
  },
  resolve: {
    alias: {
      "@": __dirname, // Alias "@" to project root, adjust as necessary
    },
    extensions: [".js", ".json"], // File extensions to resolve
  },
  externals: [nodeExternals()], // Exclude node_modules from the bundle
  module: {
    rules: [
      {
        test: /\.js$/, // Apply the loader to .js files
        exclude: /node_modules/, // Exclude node_modules directory
        use: {
          loader: "babel-loader", // Use Babel to transpile JavaScript files
        },
      },
      // You can add more rules for other file types if needed
    ],
  },
  // You can add plugins if needed
};
