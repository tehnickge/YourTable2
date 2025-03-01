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
      "no-unused-vars": "warn", // Было "error", теперь "warn"
      "react/no-unescaped-entities": "warm", // Отключает предупреждение об апострофах
      "@typescript-eslint/no-explicit-any": "warm", // Разрешает использование `any`
      "import/no-extraneous-dependencies": "warn", // Вместо ошибки - предупреждение
      "react/jsx-props-no-spreading": "warm", // Разрешает спред пропсы
      "no-console": "warn", // Консоль не вызывает ошибку, а только предупреждение
    },
  },
];

export default eslintConfig;
