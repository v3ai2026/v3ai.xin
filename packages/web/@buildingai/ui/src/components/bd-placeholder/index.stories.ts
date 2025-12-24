import type { Meta, StoryObj } from "@storybook/vue3";

import BdPlaceholder from "./index.vue";

/**
 * BdPlaceholder component stories
 * @description Stories for the BdPlaceholder component that provides a placeholder with pattern background
 */
const meta: Meta<typeof BdPlaceholder> = {
    title: "Components/BdPlaceholder",
    component: BdPlaceholder,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A placeholder component with a dashed border and pattern background. Useful for showing empty states or loading placeholders.",
            },
        },
    },
    argTypes: {
        ratio: {
            control: { type: "text" },
            description: "Aspect ratio class for the placeholder",
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default placeholder
 */
export const Default: Story = {
    args: {
        ratio: "aspect-w-16 aspect-h-9",
    },
    render: (args) => ({
        components: { BdPlaceholder },
        setup() {
            return { args };
        },
        template: `
      <div class="w-96">
        <BdPlaceholder v-bind="args" />
      </div>
    `,
    }),
};

/**
 * Square placeholder
 */
export const Square: Story = {
    args: {
        ratio: "aspect-w-1 aspect-h-1",
    },
    render: (args) => ({
        components: { BdPlaceholder },
        setup() {
            return { args };
        },
        template: `
      <div class="w-64">
        <BdPlaceholder v-bind="args" />
      </div>
    `,
    }),
};

/**
 * Portrait placeholder
 */
export const Portrait: Story = {
    args: {
        ratio: "aspect-w-3 aspect-h-4",
    },
    render: (args) => ({
        components: { BdPlaceholder },
        setup() {
            return { args };
        },
        template: `
      <div class="w-48">
        <BdPlaceholder v-bind="args" />
      </div>
    `,
    }),
};

/**
 * Wide placeholder
 */
export const Wide: Story = {
    args: {
        ratio: "aspect-w-21 aspect-h-9",
    },
    render: (args) => ({
        components: { BdPlaceholder },
        setup() {
            return { args };
        },
        template: `
      <div class="w-full max-w-4xl">
        <BdPlaceholder v-bind="args" />
      </div>
    `,
    }),
};

/**
 * Different sizes
 */
export const Sizes: Story = {
    render: () => ({
        components: { BdPlaceholder },
        setup() {
            const sizes = [
                { name: "Small", width: "w-32", ratio: "aspect-w-16 aspect-h-9" },
                { name: "Medium", width: "w-64", ratio: "aspect-w-16 aspect-h-9" },
                { name: "Large", width: "w-96", ratio: "aspect-w-16 aspect-h-9" },
                { name: "Extra Large", width: "w-full max-w-2xl", ratio: "aspect-w-16 aspect-h-9" },
            ];
            return { sizes };
        },
        template: `
      <div class="space-y-6">
        <div v-for="size in sizes" :key="size.name" class="space-y-2">
          <h3 class="text-sm font-medium text-gray-700">{{ size.name }}</h3>
          <div :class="size.width">
            <BdPlaceholder :ratio="size.ratio" />
          </div>
        </div>
      </div>
    `,
    }),
};

/**
 * Different aspect ratios
 */
export const AspectRatios: Story = {
    render: () => ({
        components: { BdPlaceholder },
        setup() {
            const ratios = [
                { name: "1:1 (Square)", ratio: "aspect-w-1 aspect-h-1" },
                { name: "4:3 (Standard)", ratio: "aspect-w-4 aspect-h-3" },
                { name: "16:9 (Widescreen)", ratio: "aspect-w-16 aspect-h-9" },
                { name: "21:9 (Ultra Wide)", ratio: "aspect-w-21 aspect-h-9" },
                { name: "3:4 (Portrait)", ratio: "aspect-w-3 aspect-h-4" },
            ];
            return { ratios };
        },
        template: `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="ratio in ratios" :key="ratio.name" class="space-y-2">
          <h3 class="text-sm font-medium text-gray-700">{{ ratio.name }}</h3>
          <div class="w-full">
            <BdPlaceholder :ratio="ratio.ratio" />
          </div>
        </div>
      </div>
    `,
    }),
};

/**
 * In a card layout
 */
export const InCard: Story = {
    render: () => ({
        components: { BdPlaceholder },
        setup() {
            return {};
        },
        template: `
      <div class="max-w-md mx-auto">
        <div class="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 class="text-lg font-semibold text-gray-900">Content Loading</h2>
          <p class="text-sm text-gray-600">This is a placeholder for content that is being loaded...</p>
          <BdPlaceholder ratio="aspect-w-16 aspect-h-9" />
          <div class="flex justify-end">
            <button class="px-4 py-2 bg-gray-200 text-gray-600 rounded-md text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `,
    }),
};
