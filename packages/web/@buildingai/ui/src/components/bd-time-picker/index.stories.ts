import type { Meta, StoryObj } from "@storybook/vue3";

import BdTimePicker from "./index.vue";

/**
 * BdTimePicker component stories
 * @description Stories for the BdTimePicker component that provides time selection
 */
const meta: Meta<typeof BdTimePicker> = {
    title: "Components/BdTimePicker",
    component: BdTimePicker,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: "A time picker with hour/minute/second columns and smooth scrolling.",
            },
        },
    },
    argTypes: {
        modelValue: { control: { type: "date" } },
        timeStyle: { control: { type: "select" }, options: ["full", "long", "medium", "short"] },
        disabled: { control: { type: "boolean" } },
        readonly: { control: { type: "boolean" } },
        clearable: { control: { type: "boolean" } },
        size: { control: { type: "select" }, options: ["xs", "sm", "md", "lg", "xl"] },
        showSeconds: { control: { type: "boolean" } },
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
        timeStyle: "medium",
        showSeconds: true,
    },
    render: (args) => ({
        components: { BdTimePicker },
        setup() {
            const value = ref<Date | null>(new Date());
            return { args, value };
        },
        template: `
      <div class="w-64">
        <BdTimePicker v-bind="args" v-model="value" />
        <div class="mt-2 text-sm text-gray-600">Value: {{ value?.toString() }}</div>
      </div>
    `,
    }),
};

export const WithoutSeconds: Story = {
    render: () => ({
        components: { BdTimePicker },
        setup() {
            const value = ref<Date | null>(new Date());
            return { value };
        },
        template: `
      <div class="w-64">
        <BdTimePicker v-model="value" :show-seconds="false" />
        <div class="mt-2 text-sm text-gray-600">Value: {{ value?.toString() }}</div>
      </div>
    `,
    }),
};
