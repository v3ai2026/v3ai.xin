import { defineBuildingAIEslintConfig } from "@buildingai/eslint-config/nuxt";

export default await defineBuildingAIEslintConfig({
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
    },
});
