import type { Meta, StoryObj } from "@storybook/vue3";

import BdCard from "./index.vue";
import type { ActionItem } from "./types";

/**
 * BdCard component stories
 * @description Stories for the BdCard component that provides a flexible card layout
 */
const meta: Meta<typeof BdCard> = {
    title: "Components/BdCard",
    component: BdCard,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A flexible card component that supports selection, operation menus, icons, and various layouts. Perfect for displaying content in a structured way.",
            },
        },
    },
    argTypes: {
        selectable: {
            control: { type: "boolean" },
            description: "Whether the card can be selected",
        },
        selected: {
            control: { type: "boolean" },
            description: "Whether the card is currently selected",
        },
        clickable: {
            control: { type: "boolean" },
            description: "Whether the card can be clicked",
        },
        size: {
            control: { type: "select" },
            options: ["sm", "md", "lg", "xl"],
            description: "Size of the card",
        },
        showActions: {
            control: { type: "boolean" },
            description: "Whether to show the actions menu",
        },
        variant: {
            control: { type: "select" },
            options: ["default", "outlined", "elevated", "flat"],
            description: "Visual variant of the card",
        },
        disabled: {
            control: { type: "boolean" },
            description: "Whether the card is disabled",
        },
        loading: {
            control: { type: "boolean" },
            description: "Whether the card is in loading state",
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default card with basic content
 */
export const Default: Story = {
    args: {
        size: "md",
        variant: "default",
    },
    render: (args) => ({
        components: { BdCard },
        setup() {
            return { args };
        },
        template: `
      <div class="w-80">
        <BdCard v-bind="args">
          <template #title>
            <h3 class="text-lg font-semibold text-gray-900">Card Title</h3>
          </template>
          <template #description>
            <p class="text-gray-600">This is a description of the card content. It can contain multiple lines of text.</p>
          </template>
        </BdCard>
      </div>
    `,
    }),
};

/**
 * Card with icon and actions
 */
export const WithIconAndActions: Story = {
    args: {
        size: "md",
        variant: "default",
        showActions: true,
        actions: [
            { label: "Edit", icon: "i-lucide-edit", onSelect: () => console.log("Edit clicked") },
            {
                label: "Delete",
                icon: "i-lucide-trash",
                color: "error",
                onSelect: () => console.log("Delete clicked"),
            },
        ] as ActionItem[],
    },
    render: (args) => ({
        components: { BdCard },
        setup() {
            return { args };
        },
        template: `
      <div class="w-80">
        <BdCard v-bind="args">
          <template #icon>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-file-text" class="w-6 h-6 text-blue-600" />
            </div>
          </template>
          <template #title>
            <h3 class="text-lg font-semibold text-gray-900">Document</h3>
          </template>
          <template #description>
            <p class="text-gray-600">A document with actions menu</p>
          </template>
        </BdCard>
      </div>
    `,
    }),
};

/**
 * Selectable card
 */
export const Selectable: Story = {
    args: {
        size: "md",
        variant: "outlined",
        selectable: true,
        selected: false,
    },
    render: (args) => ({
        components: { BdCard },
        setup() {
            return { args };
        },
        template: `
      <div class="w-80">
        <BdCard v-bind="args">
          <template #icon>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-check-circle" class="w-6 h-6 text-green-600" />
            </div>
          </template>
          <template #title>
            <h3 class="text-lg font-semibold text-gray-900">Selectable Item</h3>
          </template>
          <template #description>
            <p class="text-gray-600">This card can be selected</p>
          </template>
        </BdCard>
      </div>
    `,
    }),
};

/**
 * Clickable card
 */
export const Clickable: Story = {
    args: {
        size: "md",
        variant: "elevated",
        clickable: true,
    },
    render: (args) => ({
        components: { BdCard },
        setup() {
            const handleClick = () => {
                console.log("Card clicked!");
            };
            return { args, handleClick };
        },
        template: `
      <div class="w-80">
        <BdCard v-bind="args" @click="handleClick">
          <template #icon>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-mouse-pointer-click" class="w-6 h-6 text-purple-600" />
            </div>
          </template>
          <template #title>
            <h3 class="text-lg font-semibold text-gray-900">Clickable Card</h3>
          </template>
          <template #description>
            <p class="text-gray-600">Click this card to trigger an action</p>
          </template>
        </BdCard>
      </div>
    `,
    }),
};

/**
 * Card with tags and footer
 */
export const WithTagsAndFooter: Story = {
    args: {
        size: "lg",
        variant: "default",
    },
    render: (args) => ({
        components: { BdCard },
        setup() {
            return { args };
        },
        template: `
      <div class="w-96">
        <BdCard v-bind="args">
          <template #icon>
            <div class="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-package" class="w-8 h-8 text-orange-600" />
            </div>
          </template>
          <template #title>
            <h3 class="text-xl font-semibold text-gray-900">Project Package</h3>
          </template>
          <template #description>
            <p class="text-gray-600">A comprehensive project package with multiple features and components.</p>
          </template>
          <template #tags>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              React
            </span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              TypeScript
            </span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Storybook
            </span>
          </template>
          <template #footer>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Last updated 2 hours ago</span>
              <UButton size="sm" color="primary">View Details</UButton>
            </div>
          </template>
        </BdCard>
      </div>
    `,
    }),
};

/**
 * Loading state
 */
export const Loading: Story = {
    args: {
        size: "md",
        variant: "default",
        loading: true,
    },
    render: (args) => ({
        components: { BdCard },
        setup() {
            return { args };
        },
        template: `
      <div class="w-80">
        <BdCard v-bind="args">
          <template #icon>
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-file" class="w-6 h-6 text-gray-400" />
            </div>
          </template>
          <template #title>
            <h3 class="text-lg font-semibold text-gray-900">Loading Card</h3>
          </template>
          <template #description>
            <p class="text-gray-600">This card is in loading state</p>
          </template>
        </BdCard>
      </div>
    `,
    }),
};

/**
 * Disabled state
 */
export const Disabled: Story = {
    args: {
        size: "md",
        variant: "outlined",
        disabled: true,
    },
    render: (args) => ({
        components: { BdCard },
        setup() {
            return { args };
        },
        template: `
      <div class="w-80">
        <BdCard v-bind="args">
          <template #icon>
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-lock" class="w-6 h-6 text-gray-400" />
            </div>
          </template>
          <template #title>
            <h3 class="text-lg font-semibold text-gray-500">Disabled Card</h3>
          </template>
          <template #description>
            <p class="text-gray-400">This card is disabled</p>
          </template>
        </BdCard>
      </div>
    `,
    }),
};
