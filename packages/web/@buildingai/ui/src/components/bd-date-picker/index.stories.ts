import type { Meta, StoryObj } from "@storybook/vue3";

import BdDatePicker from "./index.vue";

/**
 * BdDatePicker component stories
 * @description Stories for the BdDatePicker component that provides date (and time) selection
 */
const meta: Meta<typeof BdDatePicker> = {
    title: "Components/BdDatePicker",
    component: BdDatePicker,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A date picker with optional time selection, keyboard shortcuts, and accessible UI.",
            },
        },
    },
    argTypes: {
        modelValue: { control: { type: "date" }, description: "Selected date" },
        dateStyle: { control: { type: "select" }, options: ["full", "long", "medium", "short"] },
        timeStyle: { control: { type: "select" }, options: ["full", "long", "medium", "short"] },
        disabled: { control: { type: "boolean" } },
        readonly: { control: { type: "boolean" } },
        clearable: { control: { type: "boolean" } },
        size: { control: { type: "select" }, options: ["xs", "sm", "md", "lg", "xl"] },
        showTime: { control: { type: "boolean" } },
        timeFormat: { control: { type: "text" } },
        icon: { control: { type: "text" } },
        placement: {
            control: { type: "select" },
            options: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"],
        },
        variant: {
            control: { type: "select" },
            options: ["outline", "soft", "subtle", "ghost", "none"],
        },
        color: {
            control: { type: "select" },
            options: ["primary", "secondary", "success", "error", "warning", "neutral", "info"],
        },
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        modelValue: new Date(),
        dateStyle: "medium",
        timeStyle: "medium",
        showTime: false,
    },
    render: (args) => ({
        components: { BdDatePicker },
        setup() {
            const value = ref<Date | null>(new Date());
            return { args, value };
        },
        template: `
      <div class="w-72">
        <BdDatePicker v-bind="args" v-model="value" />
        <div class="mt-2 text-sm text-gray-600">Value: {{ value?.toString() }}</div>
      </div>
    `,
    }),
};

export const WithTime: Story = {
    render: () => ({
        components: { BdDatePicker },
        setup() {
            const value = ref<Date | null>(new Date());
            return { value };
        },
        template: `
      <div class="w-80">
        <BdDatePicker v-model="value" :show-time="true" time-format="HH:mm:ss" />
        <div class="mt-2 text-sm text-gray-600">Value: {{ value?.toString() }}</div>
      </div>
    `,
    }),
};

export const Disabled: Story = {
    render: () => ({
        components: { BdDatePicker },
        template: `
      <div class="w-72">
        <BdDatePicker :disabled="true" />
      </div>
    `,
    }),
};
