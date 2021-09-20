module.exports = {
  mode: "production",
  entry: {
    main: "./lib/index.js",
  },
  target: "node",
  output: {
    filename: "oh-my-plateau.js",
    path: __dirname + "/dist",
  },
  externalsPresets: { node: true },
};
