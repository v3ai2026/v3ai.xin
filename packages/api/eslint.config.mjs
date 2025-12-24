import { config as baseConfig } from "@buildingai/eslint-config/base";
import { defineConfig } from "eslint/config";

export default defineConfig([
    baseConfig,
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        rules: {
            "no-undef": "off",
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-floating-promises": "warn",
            // "@typescript-eslint/no-unsafe-argument": "warn",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
        },
    },
]);
