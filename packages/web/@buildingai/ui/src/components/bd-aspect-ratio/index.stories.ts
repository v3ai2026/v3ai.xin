import type { Meta, StoryObj } from "@storybook/vue3";

import BdAspectRatio from "./index.vue";

/**
 * BdAspectRatio component stories
 * @description Stories for the BdAspectRatio component that maintains aspect ratios
 */
const meta: Meta<typeof BdAspectRatio> = {
    title: "Components/BdAspectRatio",
    component: BdAspectRatio,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A component that maintains a specific aspect ratio for its content. Useful for responsive images, videos, and other media content.",
            },
        },
    },
    argTypes: {
        ratio: {
            control: { type: "number", step: 0.1 },
            description: "The aspect ratio to maintain (width/height)",
            defaultValue: 16 / 9,
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default aspect ratio (16:9)
 */
export const Default: Story = {
    args: {
        ratio: 16 / 9,
    },
    render: (args) => ({
        components: { BdAspectRatio },
        setup() {
            return { args };
        },
        template: `
      <div class="w-96">
        <BdAspectRatio v-bind="args" class="bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
          <div class="text-gray-600">16:9 Aspect Ratio</div>
        </BdAspectRatio>
      </div>
    `,
    }),
};

/**
 * Square aspect ratio (1:1)
 */
export const Square: Story = {
    args: {
        ratio: 1,
    },
    render: (args) => ({
        components: { BdAspectRatio },
        setup() {
            return { args };
        },
        template: `
      <div class="w-64">
        <BdAspectRatio v-bind="args" class="bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center">
          <div class="text-blue-600">1:1 Square</div>
        </BdAspectRatio>
      </div>
    `,
    }),
};

/**
 * Portrait aspect ratio (3:4)
 */
export const Portrait: Story = {
    args: {
        ratio: 3 / 4,
    },
    render: (args) => ({
        components: { BdAspectRatio },
        setup() {
            return { args };
        },
        template: `
      <div class="w-64">
        <BdAspectRatio v-bind="args" class="bg-green-100 border border-green-300 rounded-lg flex items-center justify-center">
          <div class="text-green-600">3:4 Portrait</div>
        </BdAspectRatio>
      </div>
    `,
    }),
};

/**
 * Wide aspect ratio (21:9)
 */
export const Wide: Story = {
    args: {
        ratio: 21 / 9,
    },
    render: (args) => ({
        components: { BdAspectRatio },
        setup() {
            return { args };
        },
        template: `
      <div class="w-full max-w-4xl">
        <BdAspectRatio v-bind="args" class="bg-purple-100 border border-purple-300 rounded-lg flex items-center justify-center">
          <div class="text-purple-600">21:9 Ultra Wide</div>
        </BdAspectRatio>
      </div>
    `,
    }),
};

/**
 * With image content
 */
export const WithImage: Story = {
    args: {
        ratio: 16 / 9,
    },
    render: (args) => ({
        components: { BdAspectRatio },
        setup() {
            return { args };
        },
        template: `
      <div class="w-96">
        <BdAspectRatio v-bind="args" class="overflow-hidden rounded-lg border border-gray-300">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop" 
            alt="Mountain landscape"
            class="w-full h-full object-cover"
          />
        </BdAspectRatio>
      </div>
    `,
    }),
};
