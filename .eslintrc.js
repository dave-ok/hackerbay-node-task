module.exports = {
  plugins: ["mocha"],
  env: {
    es2020: true,
    node: true,
    mocha: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:mocha/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "no-console": "warn",
  },
};
