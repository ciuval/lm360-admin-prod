import react from "eslint-plugin-react";
export default [
  {
    name: "lm360-app",
    files: ["**/*.{js,jsx}"],
    ignores: ["dist/**", ".vercel/**", "node_modules/**"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    plugins: { react },
    settings: { react: { version: "detect" } },
    rules: {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-undef": "error",
      "react/react-in-jsx-scope": "off",
      "react/jsx-key": "error",
      "react/jsx-no-target-blank": "error",
      "react/no-unknown-property": "error"
    }
  }
];
