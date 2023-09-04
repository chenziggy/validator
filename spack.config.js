const { config } = require("@swc/core/spack");

module.exports = config({
  entry: {
    web: __dirname + "/src/index.js",
  },
  output: {
    path: __dirname + "/dist",
  },
  module: {},
  options: {
    "module": {
      "type": "es6"
    },
    "env": {
      "targets": "Chrome >= 79"
    },
    "jsc": {
      "parser": {
        "syntax": "ecmascript",
        "jsx": false,
        "minify": {
          "unused": false
        }
      }
    },
    "minify": true
  }
});