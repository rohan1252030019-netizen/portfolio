import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow unescaped entities in JSX (common in portfolio copy)
      "react/no-unescaped-entities": "off",
      // Allow explicit any in some places
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
