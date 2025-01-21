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
      "no-unused-vars": [
        "warn", // JS のルール
        {
          varsIgnorePattern: "^_", // _ で始まる変数を無視
          argsIgnorePattern: "^_", // 関数引数も無視
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn", // TS のルール
        {
          varsIgnorePattern: "^_", // _ で始まる変数を無視
          argsIgnorePattern: "^_", // 関数引数も無視
        },
      ],
    },
  },
];

export default eslintConfig;
