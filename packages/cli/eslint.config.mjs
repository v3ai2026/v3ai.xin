import { config as baseConfig } from "@buildingai/eslint-config/base";
import { defineConfig } from "eslint/config";

export default defineConfig([
    baseConfig,
    {
        rules: {
            "no-undef": "off",
            "@typescript-eslint/no-require-imports": "off",
        },
    },
]);
