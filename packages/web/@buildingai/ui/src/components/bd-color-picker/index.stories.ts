import type { Meta, StoryObj } from "@storybook/vue3";

import BdColorPicker from "./index.vue";

/**
 * BdColorPicker component stories
 * @description Stories for the BdColorPicker component that allows selecting colors or CSS variables
 */
const meta: Meta<typeof BdColorPicker> = {
    title: "Components/BdColorPicker",
    component: BdColorPicker,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A color picker component with presets, alpha channel support, and CSS variable input.",
            },
        },
    },
    argTypes: {
        modelValue: { control: { type: "text" }, description: "Current color value" },
        size: {
            control: { type: "select" },
            options: ["xs", "sm", "md", "lg", "xl"],
            description: "Size",
        },
        disabled: { control: { type: "boolean" }, description: "Disabled state" },
        placeholder: { control: { type: "text" }, description: "Placeholder text" },
        format: {
            control: { type: "select" },
            options: ["hex", "rgb", "hsl"],
            description: "Color format",
        },
        alpha: { control: { type: "boolean" }, description: "Enable alpha channel" },
        colorWidth: { control: { type: "text" }, description: "Color block width" },
        colorHeight: { control: { type: "text" }, description: "Color block height" },
        presets: { control: { type: "object" }, description: "Preset colors" },
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        modelValue: "#4F46E5",
        size: "sm",
        format: "hex",
        alpha: false,
    },
    render: (args: any) => {
        const modelValue = args.modelValue;
        return {
            components: { BdColorPicker },
            setup() {
                const color = ref(modelValue as string);
                return { args, color };
            },
            template: `
      <div class="w-64">
        <BdColorPicker v-bind="args" v-model="color" />
        <div class="mt-3 text-sm text-gray-600">Value: {{ color }}</div>
      </div>
    `,
        };
    },
};

export const WithAlpha: Story = {
    render: () => ({
        components: { BdColorPicker },
        setup() {
            const color = ref("rgba(79, 70, 229, 0.5)");
            return { color };
        },
        template: `
      <div class="w-64">
        <BdColorPicker v-model="color" format="rgb" :alpha="true" />
        <div class="mt-3 text-sm text-gray-600">Value: {{ color }}</div>
      </div>
    `,
    }),
};

export const Presets: Story = {
    render: () => ({
        components: { BdColorPicker },
        setup() {
            const color = ref("#22C55E");
            const presets = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"];
            return { color, presets };
        },
        template: `
      <div class="w-64">
        <BdColorPicker v-model="color" :presets="presets" />
        <div class="mt-3 text-sm text-gray-600">Value: {{ color }}</div>
      </div>
    `,
    }),
};

export const CssVariable: Story = {
    render: () => ({
        components: { BdColorPicker },
        setup() {
            const color = ref("var(--primary)");
            return { color };
        },
        template: `
      <div class="w-64">
        <BdColorPicker v-model="color" />
        <div class="mt-3 text-sm text-gray-600">Value: {{ color }}</div>
      </div>
    `,
    }),
};
