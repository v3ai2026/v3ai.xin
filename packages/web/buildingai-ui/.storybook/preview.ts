import { sharedPreview } from "../../@buildingai/storybook/preview";

const preview = {
    ...sharedPreview,
    parameters: {
        ...sharedPreview.parameters,
        docs: {
            ...sharedPreview.parameters?.docs,
            description: {
                component: "BuildingAI Web Project Components",
            },
        },
    },
};

export default preview;
