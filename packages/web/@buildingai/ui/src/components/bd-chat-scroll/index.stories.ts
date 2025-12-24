import type { Meta, StoryObj } from "@storybook/vue3";

import BdChatScroll from "./index.vue";

/**
 * BdChatScroll component stories
 * @description Stories for the BdChatScroll component that provides chat-style infinite scroll
 */
const meta: Meta<typeof BdChatScroll> = {
    title: "Components/BdChatScroll",
    component: BdChatScroll,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component:
                    "A chat-style infinite scroll component with flipped layout for chat messages.",
            },
        },
    },
    argTypes: {
        loading: { control: { type: "boolean" } },
        hasMore: { control: { type: "boolean" } },
        threshold: { control: { type: "number" } },
        loadingText: { control: { type: "text" } },
        contentClass: { control: { type: "text" } },
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => ({
        components: { BdChatScroll },
        setup() {
            const messages = ref([
                { id: 1, text: "Hello! How are you today?", sender: "user", timestamp: "10:30 AM" },
                {
                    id: 2,
                    text: "I'm doing great, thank you! How about you?",
                    sender: "other",
                    timestamp: "10:31 AM",
                },
                {
                    id: 3,
                    text: "I'm also doing well. What are your plans for the weekend?",
                    sender: "user",
                    timestamp: "10:32 AM",
                },
                {
                    id: 4,
                    text: "I'm planning to go hiking with some friends. What about you?",
                    sender: "other",
                    timestamp: "10:33 AM",
                },
                {
                    id: 5,
                    text: "That sounds fun! I'm thinking of reading a book and relaxing.",
                    sender: "user",
                    timestamp: "10:34 AM",
                },
            ]);
            const loading = ref(false);
            const hasMore = ref(true);
            let messageId = 6;

            async function loadMore() {
                if (loading.value || !hasMore.value) return;
                loading.value = true;
                await new Promise((r) => setTimeout(r, 1000));

                const newMessages = Array.from({ length: 5 }, (_, i) => ({
                    id: messageId + i,
                    text: `This is message ${messageId + i}`,
                    sender: i % 2 === 0 ? "user" : "other",
                    timestamp: new Date().toLocaleTimeString(),
                }));

                messages.value.unshift(...newMessages);
                messageId += 5;

                if (messageId > 20) hasMore.value = false;
                loading.value = false;
            }

            return { messages, loading, hasMore, loadMore };
        },
        template: `
      <div class="h-96 w-full max-w-md border rounded-lg">
        <BdChatScroll :loading="loading" :has-more="hasMore" @load-more="loadMore">
          <div v-for="message in messages" :key="message.id" class="p-3 border-b">
            <div :class="{'text-right': message.sender === 'user', 'text-left': message.sender === 'other'}">
              <div class="text-sm font-medium">{{ message.sender }}</div>
              <div class="text-sm">{{ message.text }}</div>
              <div class="text-xs text-gray-500">{{ message.timestamp }}</div>
            </div>
          </div>
        </BdChatScroll>
      </div>
    `,
    }),
};

export const Loading: Story = {
    render: () => ({
        components: { BdChatScroll },
        setup() {
            const messages = ref([
                { id: 1, text: "Message 1", sender: "user" },
                { id: 2, text: "Message 2", sender: "other" },
            ]);
            const loading = ref(true);
            const hasMore = ref(true);

            return { messages, loading, hasMore };
        },
        template: `
      <div class="h-96 w-full max-w-md border rounded-lg">
        <BdChatScroll :loading="loading" :has-more="hasMore">
          <div v-for="message in messages" :key="message.id" class="p-3 border-b">
            <div :class="{'text-right': message.sender === 'user', 'text-left': message.sender === 'other'}">
              <div class="text-sm">{{ message.text }}</div>
            </div>
          </div>
        </BdChatScroll>
      </div>
    `,
    }),
};

export const NoMoreData: Story = {
    render: () => ({
        components: { BdChatScroll },
        setup() {
            const messages = ref([
                { id: 1, text: "First message", sender: "user" },
                { id: 2, text: "Second message", sender: "other" },
                { id: 3, text: "Third message", sender: "user" },
            ]);
            const loading = ref(false);
            const hasMore = ref(false);

            return { messages, loading, hasMore };
        },
        template: `
      <div class="h-96 w-full max-w-md border rounded-lg">
        <BdChatScroll :loading="loading" :has-more="hasMore">
          <div v-for="message in messages" :key="message.id" class="p-3 border-b">
            <div :class="{'text-right': message.sender === 'user', 'text-left': message.sender === 'other'}">
              <div class="text-sm">{{ message.text }}</div>
            </div>
          </div>
        </BdChatScroll>
      </div>
    `,
    }),
};
