import type { Meta, StoryObj } from "@storybook/vue3";

import BdMarkdown from "./index.vue";

/**
 * BdMarkdown component stories
 * @description Stories for the BdMarkdown component that renders markdown with plugins
 */
const meta: Meta<typeof BdMarkdown> = {
    title: "Components/BdMarkdown",
    component: BdMarkdown,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component:
                    "A markdown renderer supporting math (KaTeX), mermaid, alerts, and more.",
            },
        },
    },
    argTypes: {
        content: { control: { type: "text" }, description: "Markdown content" },
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const sample = `# Title\n\n- List item 1\n- List item 2\n\n**Bold** and _italic_.\n\n$$a^2+b^2=c^2$$\n\n\`\`\`js\nconsole.log('hello')\n\`\`\``;

export const Default: Story = {
    args: { content: sample },
    render: (args) => ({
        components: { BdMarkdown },
        setup() {
            return { args };
        },
        template: `
      <div class="prose max-w-none">
        <BdMarkdown v-bind="args" />
      </div>
    `,
    }),
};
