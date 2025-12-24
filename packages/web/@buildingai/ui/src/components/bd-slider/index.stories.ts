import type { Meta, StoryObj } from "@storybook/vue3";

import BdSlider from "./index.vue";

/**
 * BdSlider component stories
 * @description Stories for the BdSlider component that combines a slider with a numeric input
 */
const meta: Meta<typeof BdSlider> = {
    title: "Components/BdSlider",
    component: BdSlider,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A professional slider component that combines a USlider with a numeric input box. Users can adjust values by dragging the slider or typing in the input field.",
            },
        },
    },
    argTypes: {
        modelValue: {
            control: { type: "number" },
            description: "Current value of the slider",
        },
        min: {
            control: { type: "number" },
            description: "Minimum value",
        },
        max: {
            control: { type: "number" },
            description: "Maximum value",
        },
        step: {
            control: { type: "number" },
            description: "Step size for value changes",
        },
        size: {
            control: { type: "select" },
            options: ["xs", "sm", "md", "lg", "xl"],
            description: "Size of the component",
        },
        disabled: {
            control: { type: "boolean" },
            description: "Whether the slider is disabled",
        },
        color: {
            control: { type: "select" },
            options: ["primary", "secondary", "success", "info", "warning", "error", "neutral"],
            description: "Color variant of the slider",
        },
        inputWidth: {
            control: { type: "text" },
            description: "Width of the input box",
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default slider
 */
export const Default: Story = {
    args: {
        modelValue: 50,
        min: 0,
        max: 100,
        step: 1,
        size: "sm",
        disabled: false,
        color: "primary",
        inputWidth: "60px",
    },
    render: (args) => ({
        components: { BdSlider },
        setup() {
            const value = ref(50);
            return { args, value };
        },
        template: `
      <div class="w-80">
        <BdSlider 
          v-bind="args" 
          v-model="value"
        />
        <div class="mt-4 text-sm text-gray-600">
          Current value: {{ value }}
        </div>
      </div>
    `,
    }),
};

/**
 * Different sizes
 */
export const Sizes: Story = {
    render: () => ({
        components: { BdSlider },
        setup() {
            const values = ref({
                xs: 25,
                sm: 50,
                md: 75,
                lg: 30,
                xl: 60,
            });
            return { values };
        },
        template: `
      <div class="space-y-6 w-96">
        <div v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ size }} size:</label>
          <BdSlider 
            :size="size"
            :model-value="values[size]"
            @update:model-value="values[size] = $event"
            min="0"
            max="100"
            step="1"
          />
          <div class="text-xs text-gray-500">Value: {{ values[size] }}</div>
        </div>
      </div>
    `,
    }),
};

/**
 * Different colors
 */
export const Colors: Story = {
    render: () => ({
        components: { BdSlider },
        setup() {
            const values = ref({
                primary: 30,
                secondary: 40,
                success: 50,
                info: 60,
                warning: 70,
                error: 80,
                neutral: 90,
            });
            return { values };
        },
        template: `
      <div class="space-y-4 w-96">
        <div v-for="color in ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral']" :key="color" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ color }} color:</label>
          <BdSlider 
            :color="color"
            :model-value="values[color]"
            @update:model-value="values[color] = $event"
            min="0"
            max="100"
            step="1"
          />
          <div class="text-xs text-gray-500">Value: {{ values[color] }}</div>
        </div>
      </div>
    `,
    }),
};

/**
 * Different ranges
 */
export const Ranges: Story = {
    render: () => ({
        components: { BdSlider },
        setup() {
            const values = ref({
                small: 5,
                medium: 50,
                large: 500,
                decimal: 2.5,
            });
            return { values };
        },
        template: `
      <div class="space-y-6 w-96">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Small range (0-10):</label>
          <BdSlider 
            :model-value="values.small"
            @update:model-value="values.small = $event"
            min="0"
            max="10"
            step="1"
          />
          <div class="text-xs text-gray-500">Value: {{ values.small }}</div>
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Medium range (0-100):</label>
          <BdSlider 
            :model-value="values.medium"
            @update:model-value="values.medium = $event"
            min="0"
            max="100"
            step="1"
          />
          <div class="text-xs text-gray-500">Value: {{ values.medium }}</div>
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Large range (0-1000):</label>
          <BdSlider 
            :model-value="values.large"
            @update:model-value="values.large = $event"
            min="0"
            max="1000"
            step="10"
          />
          <div class="text-xs text-gray-500">Value: {{ values.large }}</div>
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Decimal range (0-5, step 0.1):</label>
          <BdSlider 
            :model-value="values.decimal"
            @update:model-value="values.decimal = $event"
            min="0"
            max="5"
            step="0.1"
          />
          <div class="text-xs text-gray-500">Value: {{ values.decimal }}</div>
        </div>
      </div>
    `,
    }),
};

/**
 * With custom formatter
 */
export const WithCustomFormatter: Story = {
    render: () => ({
        components: { BdSlider },
        setup() {
            const value = ref(50);
            const formatter = (val: number) => `${val}%`;
            const parser = (displayValue: string) => parseFloat(displayValue.replace("%", "")) || 0;

            return { value, formatter, parser };
        },
        template: `
      <div class="w-96">
        <div class="mb-4">
          <label class="text-sm font-medium text-gray-700">Percentage slider (0-100%):</label>
        </div>
        <BdSlider 
          v-model="value"
          :formatter="formatter"
          :parser="parser"
          min="0"
          max="100"
          step="1"
          input-width="80px"
        />
        <div class="mt-4 text-sm text-gray-600">
          Current value: {{ value }}%
        </div>
      </div>
    `,
    }),
};

/**
 * Disabled state
 */
export const Disabled: Story = {
    args: {
        modelValue: 50,
        min: 0,
        max: 100,
        step: 1,
        disabled: true,
    },
    render: (args) => ({
        components: { BdSlider },
        setup() {
            return { args };
        },
        template: `
      <div class="w-80">
        <BdSlider v-bind="args" />
        <div class="mt-4 text-sm text-gray-500">
          This slider is disabled
        </div>
      </div>
    `,
    }),
};

/**
 * Volume control example
 */
export const VolumeControl: Story = {
    render: () => ({
        components: { BdSlider },
        setup() {
            const volume = ref(75);
            const formatter = (val: number) => val.toString();
            const parser = (displayValue: string) => parseFloat(displayValue) || 0;

            return { volume, formatter, parser };
        },
        template: `
      <div class="w-80 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-volume-2" class="text-gray-600" />
          <div class="flex-1">
            <BdSlider 
              v-model="volume"
              :formatter="formatter"
              :parser="parser"
              min="0"
              max="100"
              step="1"
              color="primary"
              input-width="50px"
            />
          </div>
          <UIcon name="i-lucide-volume-x" class="text-gray-600" />
        </div>
        <div class="mt-2 text-sm text-gray-600">
          Volume: {{ volume }}%
        </div>
      </div>
    `,
    }),
};
