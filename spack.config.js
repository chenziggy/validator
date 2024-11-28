const { config } = require("@swc/core/spack");

module.exports = config({
  entry: {
    web: __dirname + "/src/index.js",
  },
  output: {
    path: __dirname + "/dist/",
    name: 'index.js'
  },
  options: {
  "env": {
      "targets": "Chrome >= 79"
    },
    "jsc": {
      "parser": {
        "syntax": "ecmascript",
        "jsx": false,
        minify: {
          unused: false,
        }
      },
      transform: {
        optimizer: {
          simplify: true
        }
      }
    },
      "minify": false
  }
});