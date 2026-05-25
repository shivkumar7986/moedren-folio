/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**", "**/drizzle/**"]
  },
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "prefer-const": "error",
      "no-unused-vars": "off"
    }
  }
];
