import { sharedConfig } from "../../@buildingai/storybook/main";

const config = {
    ...sharedConfig,
    stories: [
        // Project-specific stories
        "../app/components/**/*.mdx",
        "../app/components/**/*.stories.@(js|jsx|ts|tsx|mdx)",
        // Include BuildingAI UI components stories
        "../../@buildingai/ui/src/components/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    ],
};

export default config;
