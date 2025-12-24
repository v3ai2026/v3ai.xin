import { config as baseConfig } from "@buildingai/eslint-config/base";
import { defineConfig } from "eslint/config";

export default defineConfig([
    baseConfig,
    {
        files: ["**/*.{js,mjs,cjs,ts,d.ts,vue}"],
        rules: {
            "@typescript-eslint/no-unsafe-function-type": "off",
            "@typescript-eslint/no-unused-vars": "off",
        },
    },
]);
