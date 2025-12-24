import type { Meta, StoryObj } from "@storybook/vue3";

import BdInputPassword from "./index.vue";

/**
 * BdInputPassword component stories
 * @description Stories for the BdInputPassword component that provides a password input with toggle visibility
 */
const meta: Meta<typeof BdInputPassword> = {
    title: "Components/BdInputPassword",
    component: BdInputPassword,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A password input component with toggle visibility functionality. Users can click the eye icon to show/hide the password.",
            },
        },
    },
    argTypes: {
        placeholder: {
            control: { type: "text" },
            description: "Placeholder text for the input",
        },
        disabled: {
            control: { type: "boolean" },
            description: "Whether the input is disabled",
        },
        size: {
            control: { type: "select" },
            options: ["xs", "sm", "md", "lg", "xl"],
            description: "Size of the input",
        },
        color: {
            control: { type: "select" },
            options: ["primary", "gray", "black", "white"],
            description: "Color variant of the input",
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default password input
 */
export const Default: Story = {
    args: {
        placeholder: "Enter your password",
    },
    render: (args: any) => ({
        components: { BdInputPassword },
        setup() {
            const password = ref("");
            return { args, password };
        },
        template: `
      <div class="w-80">
        <BdInputPassword 
          v-bind="args" 
          v-model="password"
        />
        <div class="mt-2 text-sm text-gray-600">
          Value: {{ password }}
        </div>
      </div>
    `,
    }),
};

/**
 * Password input with different sizes
 */
export const Sizes: Story = {
    render: () => ({
        components: { BdInputPassword },
        setup() {
            const passwords = ref({
                xs: "",
                sm: "",
                md: "",
                lg: "",
                xl: "",
            });
            return { passwords };
        },
        template: `
      <div class="space-y-4">
        <div v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" class="flex items-center gap-4">
          <label class="w-8 text-sm text-gray-600">{{ size }}:</label>
          <BdInputPassword 
            :size="size"
            :placeholder="\`\${size} size password input\`"
            v-model="passwords[size]"
            class="w-64"
          />
        </div>
      </div>
    `,
    }),
};

/**
 * Password input with different colors
 */
export const Colors: Story = {
    render: () => ({
        components: { BdInputPassword },
        setup() {
            const passwords = ref({
                primary: "",
                gray: "",
                black: "",
                white: "",
            });
            return { passwords };
        },
        template: `
      <div class="space-y-4">
        <div v-for="color in ['primary', 'gray', 'black', 'white']" :key="color" class="flex items-center gap-4">
          <label class="w-16 text-sm text-gray-600">{{ color }}:</label>
          <BdInputPassword 
            :color="color"
            :placeholder="\`\${color} color password input\`"
            v-model="passwords[color]"
            class="w-64"
          />
        </div>
      </div>
    `,
    }),
};

/**
 * Disabled password input
 */
export const Disabled: Story = {
    args: {
        placeholder: "Disabled password input",
        disabled: true,
    },
    render: (args: any) => ({
        components: { BdInputPassword },
        setup() {
            return { args };
        },
        template: `
      <div class="w-80">
        <BdInputPassword v-bind="args" />
        <div class="mt-2 text-sm text-gray-500">
          This input is disabled
        </div>
      </div>
    `,
    }),
};

/**
 * Password input with validation states
 */
export const ValidationStates: Story = {
    render: () => ({
        components: { BdInputPassword },
        setup() {
            const passwords = ref({
                error: "",
                warning: "",
                success: "",
            });
            return { passwords };
        },
        template: `
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <label class="w-16 text-sm text-gray-600">Error:</label>
          <BdInputPassword 
            placeholder="Password with error state"
            v-model="passwords.error"
            class="w-64"
            :ui="{ color: { red: { outline: 'ring-2 ring-red-500 dark:ring-red-400' } } }"
            color="red"
          />
        </div>
        <div class="flex items-center gap-4">
          <label class="w-16 text-sm text-gray-600">Warning:</label>
          <BdInputPassword 
            placeholder="Password with warning state"
            v-model="passwords.warning"
            class="w-64"
            :ui="{ color: { yellow: { outline: 'ring-2 ring-yellow-500 dark:ring-yellow-400' } } }"
            color="yellow"
          />
        </div>
        <div class="flex items-center gap-4">
          <label class="w-16 text-sm text-gray-600">Success:</label>
          <BdInputPassword 
            placeholder="Password with success state"
            v-model="passwords.success"
            class="w-64"
            :ui="{ color: { green: { outline: 'ring-2 ring-green-500 dark:ring-green-400' } } }"
            color="green"
          />
        </div>
      </div>
    `,
    }),
};

/**
 * Password input with custom slots
 */
export const WithCustomSlots: Story = {
    render: () => ({
        components: { BdInputPassword },
        setup() {
            const password = ref("");
            return { password };
        },
        template: `
      <div class="w-80">
        <BdInputPassword 
          v-model="password"
          placeholder="Password with custom leading icon"
        >
          <template #leading>
            <UIcon name="i-lucide-lock" class="text-gray-400" />
          </template>
        </BdInputPassword>
        <div class="mt-2 text-sm text-gray-600">
          Value: {{ password }}
        </div>
      </div>
    `,
    }),
};
