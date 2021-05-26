module.exports = {
  "root": true,
  "parserOptions": {
    // Required for certain syntax usages
    "ecmaVersion": 2017,
  },
  "env": {
    es6: true,
    node: true,
  },
  "extends": [
    "eslint:recommended",
    "google",
  ],
  "rules": {
    "quotes": ["error", "double"],
    "linebreak-style": 0,
    "new-cap": 0,
    "max-len": ["error", {"code": 120}],
  },
};
