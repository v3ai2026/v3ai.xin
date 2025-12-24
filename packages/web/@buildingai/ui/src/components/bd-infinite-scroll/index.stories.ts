import type { Meta, StoryObj } from "@storybook/vue3";

import BdScrollArea from "../pro-scroll-area/index.vue";
import BdInfiniteScroll from "./index.vue";

/**
 * BdInfiniteScroll component stories
 * @description Stories for the BdInfiniteScroll component that triggers load on reaching bottom
 */
const meta: Meta<typeof BdInfiniteScroll> = {
    title: "Components/BdInfiniteScroll",
    component: BdInfiniteScroll,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component:
                    "An infinite scroll utility that emits loadMore when scrolled near the bottom.",
            },
        },
    },
    argTypes: {
        loading: { control: { type: "boolean" } },
        hasMore: { control: { type: "boolean" } },
        threshold: { control: { type: "number" } },
        loadingText: { control: { type: "text" } },
        noMoreText: { control: { type: "text" } },
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => ({
        components: { BdInfiniteScroll, BdScrollArea },
        setup() {
            const items = ref(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`));
            const loading = ref(false);
            const hasMore = ref(true);
            let page = 1;

            async function loadMore() {
                if (loading.value || !hasMore.value) return;
                loading.value = true;
                await new Promise((r) => setTimeout(r, 600));
                const newOnes = Array.from({ length: 10 }, (_, i) => `Item ${page * 10 + i + 1}`);
                items.value.push(...newOnes);
                page++;
                if (page >= 5) hasMore.value = false;
                loading.value = false;
            }

            return { items, loading, hasMore, loadMore };
        },
        template: `
      <div class="h-80 w-full max-w-md">
        <BdScrollArea class="h-full">
          <BdInfiniteScroll :loading="loading" :has-more="hasMore" @load-more="loadMore">
            <div v-for="(item, i) in items" :key="i" class="border-b p-3 text-sm">{{ item }}</div>
          </BdInfiniteScroll>
        </BdScrollArea>
      </div>
    `,
    }),
};
