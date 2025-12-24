import type { Meta, StoryObj } from "@storybook/vue3";

import BdEditor from "./index.vue";

/**
 * BdEditor component stories
 * @description Stories for the BdEditor component that provides rich text editing
 */
const meta: Meta<typeof BdEditor> = {
    title: "Components/BdEditor",
    component: BdEditor,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "A rich text editor with Markdown support and HTML output.",
            },
        },
    },
    argTypes: {
        modelValue: { control: { type: "text" }, description: "Editor content" },
        customClass: { control: { type: "text" }, description: "Custom CSS classes" },
        placeholder: { control: { type: "text" }, description: "Placeholder text" },
        enableMarkdown: { control: { type: "boolean" }, description: "Enable Markdown mode" },
        outputFormat: {
            control: { type: "select" },
            options: ["html", "markdown"],
            description: "Output format",
        },
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        modelValue: "<p>Hello <strong>World</strong>!</p>",
        placeholder: "Start typing...",
        enableMarkdown: false,
        outputFormat: "html",
    },
    render: (args: any) => {
        const modelValue = args.modelValue;
        return {
            components: { BdEditor },
            setup() {
                const content = ref(modelValue as string);
                return { args, content };
            },
            template: `
      <div class="h-96 w-full max-w-4xl">
        <BdEditor v-bind="args" v-model="content" />
        <div class="mt-4 text-sm text-gray-600">
          <strong>Content:</strong><br/>
          <pre class="whitespace-pre-wrap">{{ content }}</pre>
        </div>
      </div>
    `,
        };
    },
};

export const MarkdownMode: Story = {
    render: () => ({
        components: { BdEditor },
        setup() {
            const content = ref(
                "# Hello World\n\nThis is **bold** and *italic* text.\n\n- List item 1\n- List item 2",
            );
            return { content };
        },
        template: `
      <div class="h-96 w-full max-w-4xl">
        <BdEditor v-model="content" :enable-markdown="true" output-format="markdown" placeholder="Write in Markdown..." />
        <div class="mt-4 text-sm text-gray-600">
          <strong>Markdown Content:</strong><br/>
          <pre class="whitespace-pre-wrap">{{ content }}</pre>
        </div>
      </div>
    `,
    }),
};

export const Empty: Story = {
    render: () => ({
        components: { BdEditor },
        setup() {
            const content = ref("");
            return { content };
        },
        template: `
      <div class="h-96 w-full max-w-4xl">
        <BdEditor v-model="content" placeholder="Start writing your content..." />
        <div class="mt-4 text-sm text-gray-600">
          <strong>Content:</strong><br/>
          <pre class="whitespace-pre-wrap">{{ content }}</pre>
        </div>
      </div>
    `,
    }),
};
