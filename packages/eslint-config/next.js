/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "./base.js",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
};
