import type { Meta, StoryObj } from "@storybook/vue3";

import BdThemeToggle from "./index.vue";

const meta = {
    title: "Components/BdThemeToggle",
    component: BdThemeToggle,
    tags: ["autodocs"],
    argTypes: {},
    args: {},
} satisfies Meta<typeof BdThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default theme toggle
 */
export const Default: Story = {
    args: {},
};

/**
 * Multiple toggles in a row
 */
export const Multiple: Story = {
    render: () => ({
        components: { BdThemeToggle },
        template: `
            <div class="flex items-center gap-4">
                <BdThemeToggle />
                <BdThemeToggle />
                <BdThemeToggle />
            </div>
        `,
    }),
};
