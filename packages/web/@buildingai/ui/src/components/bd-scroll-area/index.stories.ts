import type { Meta, StoryObj } from "@storybook/vue3";

import BdScrollArea from "./index.vue";

/**
 * BdScrollArea component stories
 * @description Stories for the BdScrollArea component that provides custom scrollable areas
 */
const meta: Meta<typeof BdScrollArea> = {
    title: "Components/BdScrollArea",
    component: BdScrollArea,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A scrollable area component with custom scrollbars and smooth scrolling behavior. Built on top of Reka UI's ScrollArea component.",
            },
        },
    },
    argTypes: {
        type: {
            control: { type: "select" },
            options: ["hover", "always", "scroll", "never"],
            description: "When to show scrollbars",
        },
        scrollHideDelay: {
            control: { type: "number" },
            description: "Delay before hiding scrollbars (ms)",
        },
        scrollbarSize: {
            control: { type: "number" },
            description: "Size of the scrollbar",
        },
        variant: {
            control: { type: "select" },
            options: ["default", "thin", "none"],
            description: "Scrollbar variant",
        },
        horizontal: {
            control: { type: "boolean" },
            description: "Enable horizontal scrolling",
        },
        vertical: {
            control: { type: "boolean" },
            description: "Enable vertical scrolling",
        },
        shadow: {
            control: { type: "boolean" },
            description: "Show shadow when scrolling",
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default scroll area
 */
export const Default: Story = {
    args: {
        type: "hover",
        scrollHideDelay: 0,
        scrollbarSize: 10,
        variant: "default",
        horizontal: false,
        vertical: true,
        shadow: true,
    },
    render: (args) => ({
        components: { BdScrollArea },
        setup() {
            return { args };
        },
        template: `
      <div class="w-96 h-64 border border-gray-200 rounded-lg">
        <BdScrollArea v-bind="args" class="h-full">
          <div class="p-4 space-y-4">
            <div v-for="i in 20" :key="i" class="p-3 bg-gray-50 rounded-lg">
              <h4 class="font-medium">Item {{ i }}</h4>
              <p class="text-sm text-gray-600">
                This is content for item {{ i }}. It demonstrates the scrollable area functionality.
              </p>
            </div>
          </div>
        </BdScrollArea>
      </div>
    `,
    }),
};

/**
 * Horizontal scroll area
 */
export const Horizontal: Story = {
    render: () => ({
        components: { BdScrollArea },
        setup() {
            return {};
        },
        template: `
      <div class="w-96 h-32 border border-gray-200 rounded-lg">
        <BdScrollArea 
          type="hover"
          horizontal
          vertical="false"
          class="h-full"
        >
          <div class="flex space-x-4 p-4" style="width: 800px;">
            <div v-for="i in 10" :key="i" class="flex-none w-32 h-20 bg-blue-100 rounded-lg flex items-center justify-center">
              <span class="text-blue-800 font-medium">Card {{ i }}</span>
            </div>
          </div>
        </BdScrollArea>
      </div>
    `,
    }),
};

/**
 * Both horizontal and vertical scroll
 */
export const BothDirections: Story = {
    render: () => ({
        components: { BdScrollArea },
        setup() {
            return {};
        },
        template: `
      <div class="w-96 h-64 border border-gray-200 rounded-lg">
        <BdScrollArea 
          type="hover"
          horizontal
          vertical
          class="h-full"
        >
          <div class="p-4" style="width: 600px;">
            <div class="grid grid-cols-3 gap-4">
              <div v-for="i in 30" :key="i" class="p-3 bg-green-50 rounded-lg">
                <h4 class="font-medium text-green-800">Item {{ i }}</h4>
                <p class="text-sm text-green-600">
                  Content for item {{ i }}
                </p>
              </div>
            </div>
          </div>
        </BdScrollArea>
      </div>
    `,
    }),
};

/**
 * Always visible scrollbars
 */
export const AlwaysVisible: Story = {
    render: () => ({
        components: { BdScrollArea },
        setup() {
            return {};
        },
        template: `
      <div class="w-96 h-64 border border-gray-200 rounded-lg">
        <BdScrollArea 
          type="always"
          class="h-full"
        >
          <div class="p-4 space-y-4">
            <div v-for="i in 15" :key="i" class="p-3 bg-purple-50 rounded-lg">
              <h4 class="font-medium text-purple-800">Item {{ i }}</h4>
              <p class="text-sm text-purple-600">
                Scrollbars are always visible in this example.
              </p>
            </div>
          </div>
        </BdScrollArea>
      </div>
    `,
    }),
};

/**
 * Thin scrollbars
 */
export const ThinScrollbars: Story = {
    render: () => ({
        components: { BdScrollArea },
        setup() {
            return {};
        },
        template: `
      <div class="w-96 h-64 border border-gray-200 rounded-lg">
        <BdScrollArea 
          type="hover"
          variant="thin"
          scrollbar-size="6"
          class="h-full"
        >
          <div class="p-4 space-y-4">
            <div v-for="i in 20" :key="i" class="p-3 bg-yellow-50 rounded-lg">
              <h4 class="font-medium text-yellow-800">Item {{ i }}</h4>
              <p class="text-sm text-yellow-600">
                This example uses thin scrollbars for a more subtle appearance.
              </p>
            </div>
          </div>
        </BdScrollArea>
      </div>
    `,
    }),
};

/**
 * With shadow
 */
export const WithShadow: Story = {
    render: () => ({
        components: { BdScrollArea },
        setup() {
            return {};
        },
        template: `
      <div class="w-96 h-64 border border-gray-200 rounded-lg">
        <BdScrollArea 
          type="hover"
          shadow
          class="h-full"
        >
          <div class="p-4 space-y-4">
            <div v-for="i in 25" :key="i" class="p-3 bg-red-50 rounded-lg">
              <h4 class="font-medium text-red-800">Item {{ i }}</h4>
              <p class="text-sm text-red-600">
                This example shows shadow effects when scrolling.
              </p>
            </div>
          </div>
        </BdScrollArea>
      </div>
    `,
    }),
};

/**
 * Code content
 */
export const CodeContent: Story = {
    render: () => ({
        components: { BdScrollArea },
        setup() {
            const codeContent = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(result);

// This is a longer code example
class Calculator {
  constructor() {
    this.history = [];
  }
  
  add(a, b) {
    const result = a + b;
    this.history.push(\`\${a} + \${b} = \${result}\`);
    return result;
  }
  
  subtract(a, b) {
    const result = a - b;
    this.history.push(\`\${a} - \${b} = \${result}\`);
    return result;
  }
  
  getHistory() {
    return this.history;
  }
}

const calc = new Calculator();
calc.add(5, 3);
calc.subtract(10, 4);
console.log(calc.getHistory());`;

            return { codeContent };
        },
        template: `
      <div class="w-96 h-64 border border-gray-200 rounded-lg">
        <BdScrollArea 
          type="hover"
          class="h-full"
        >
          <pre class="p-4 text-sm font-mono text-gray-800 bg-gray-50"><code>{{ codeContent }}</code></pre>
        </BdScrollArea>
      </div>
    `,
    }),
};

/**
 * Chat messages
 */
export const ChatsMessages: Story = {
    render: () => ({
        components: { BdScrollArea },
        setup() {
            const messages = ref([
                { id: 1, text: "Hello! How are you today?", sender: "user" },
                { id: 2, text: "I'm doing great, thank you! How about you?", sender: "other" },
                {
                    id: 3,
                    text: "I'm also doing well. What are your plans for the weekend?",
                    sender: "user",
                },
                {
                    id: 4,
                    text: "I'm planning to go hiking with some friends. What about you?",
                    sender: "other",
                },
                {
                    id: 5,
                    text: "That sounds fun! I'm thinking of reading a book and relaxing.",
                    sender: "user",
                },
                {
                    id: 6,
                    text: "That sounds like a perfect weekend too! What book are you reading?",
                    sender: "other",
                },
                {
                    id: 7,
                    text: "I'm reading 'The Great Gatsby'. Have you read it?",
                    sender: "user",
                },
                {
                    id: 8,
                    text: "Yes, I have! It's a classic. What do you think of it so far?",
                    sender: "other",
                },
                {
                    id: 9,
                    text: "I'm really enjoying it. The writing style is beautiful.",
                    sender: "user",
                },
                {
                    id: 10,
                    text: "I agree! Fitzgerald's prose is truly remarkable.",
                    sender: "other",
                },
            ]);

            return { messages };
        },
        template: `
      <div class="w-96 h-64 border border-gray-200 rounded-lg">
        <BdScrollArea 
          type="hover"
          class="h-full"
        >
          <div class="p-4 space-y-3">
            <div 
              v-for="message in messages" 
              :key="message.id"
              :class="[
                'flex',
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              ]"
            >
              <div 
                :class="[
                  'max-w-xs px-3 py-2 rounded-lg text-sm',
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-800'
                ]"
              >
                {{ message.text }}
              </div>
            </div>
          </div>
        </BdScrollArea>
      </div>
    `,
    }),
};
