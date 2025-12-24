import type { Meta, StoryObj } from "@storybook/vue3";

import BdButtonCopy from "./index.vue";

/**
 * BdButtonCopy component stories
 * @description Stories for the BdButtonCopy component that provides a copy-to-clipboard button
 */
const meta: Meta<typeof BdButtonCopy> = {
    title: "Components/BdButtonCopy",
    component: BdButtonCopy,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A button component that copies content to clipboard with visual feedback. Shows different icons and tooltips based on copy state.",
            },
        },
    },
    argTypes: {
        content: {
            control: { type: "text" },
            description: "The content to copy to clipboard",
        },
        copiedText: {
            control: { type: "text" },
            description: "Success message text after copying",
        },
        defaultText: {
            control: { type: "text" },
            description: "Default text for the button",
        },
        copiedIcon: {
            control: { type: "text" },
            description: "Icon to show after successful copy",
        },
        defaultIcon: {
            control: { type: "text" },
            description: "Default icon for the button",
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default copy button
 */
export const Default: Story = {
    args: {
        content: "Hello, World!",
        copiedText: "Copied!",
        defaultText: "Copy",
        copiedIcon: "i-lucide-copy-check",
        defaultIcon: "i-lucide-copy",
    },
    render: (args: any) => {
        const content = args.content;
        return {
            components: { BdButtonCopy },
            setup() {
                return { args, content };
            },
            template: `
      <div class="flex items-center gap-4">
        <div class="text-sm text-gray-600">Click to copy: "${content}"</div>
        <BdButtonCopy v-bind="args" />
      </div>
    `,
        };
    },
};

/**
 * Copy button with custom text
 */
export const WithCustomText: Story = {
    args: {
        content: "This is a custom text to copy",
        copiedText: "Text copied successfully!",
        defaultText: "Copy Text",
        copiedIcon: "i-lucide-check",
        defaultIcon: "i-lucide-copy",
    },
    render: (args: any) => {
        const content = args.content;
        return {
            components: { BdButtonCopy },
            setup() {
                return { args, content };
            },
            template: `
      <div class="flex items-center gap-4">
        <div class="text-sm text-gray-600">Custom text: "${content}"</div>
        <BdButtonCopy v-bind="args" />
      </div>
    `,
        };
    },
};

/**
 * Copy button with long content
 */
export const WithLongContent: Story = {
    args: {
        content:
            "This is a very long text that contains multiple lines and should be copied to clipboard when the button is clicked. It demonstrates how the component handles longer content.",
        copiedText: "Long text copied!",
        defaultText: "Copy Long Text",
        copiedIcon: "i-lucide-copy-check",
        defaultIcon: "i-lucide-copy",
    },
    render: (args: any) => {
        const content = args.content;
        return {
            components: { BdButtonCopy },
            setup() {
                return { args, content };
            },
            template: `
      <div class="max-w-md">
        <div class="text-sm text-gray-600 mb-2">Long content:</div>
        <div class="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded border">
          ${content}
        </div>
        <BdButtonCopy v-bind="args" />
      </div>
    `,
        };
    },
};

/**
 * Copy button with JSON content
 */
export const WithJsonContent: Story = {
    args: {
        content: JSON.stringify({ name: "John Doe", age: 30, city: "New York" }, null, 2),
        copiedText: "JSON copied!",
        defaultText: "Copy JSON",
        copiedIcon: "i-lucide-copy-check",
        defaultIcon: "i-lucide-copy",
    },
    render: (args: any) => {
        const content = args.content;
        return {
            components: { BdButtonCopy },
            setup() {
                return { args, content };
            },
            template: `
      <div class="max-w-md">
        <div class="text-sm text-gray-600 mb-2">JSON content:</div>
        <pre class="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded border overflow-auto">${content}</pre>
        <BdButtonCopy v-bind="args" />
      </div>
    `,
        };
    },
};

/**
 * Copy button with different variants
 */
export const Variants: Story = {
    render: () => ({
        components: { BdButtonCopy },
        setup() {
            const variants = [
                { content: "Primary", variant: "primary" },
                { content: "Secondary", variant: "secondary" },
                { content: "Outline", variant: "outline" },
                { content: "Ghost", variant: "ghost" },
            ];
            return { variants };
        },
        template: `
      <div class="flex flex-wrap gap-4">
        <div v-for="item in variants" :key="item.variant" class="flex items-center gap-2">
          <span class="text-sm text-gray-600">{{ item.variant }}:</span>
          <BdButtonCopy 
            :content="item.content" 
            :variant="item.variant"
            copied-text="Copied!"
            default-text="Copy"
          />
        </div>
      </div>
    `,
    }),
};
