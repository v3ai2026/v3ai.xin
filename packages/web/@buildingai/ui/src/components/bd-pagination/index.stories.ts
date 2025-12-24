import type { Meta, StoryObj } from "@storybook/vue3";

import BdPagination from "./index.vue";

/**
 * BdPagination component stories
 * @description Stories for the BdPagination component that provides pagination controls
 */
const meta: Meta<typeof BdPagination> = {
    title: "Components/BdPagination",
    component: BdPagination,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A pagination component that provides navigation controls for large datasets. Includes first, previous, next, and last page buttons with customizable page sizes.",
            },
        },
    },
    argTypes: {
        size: {
            control: { type: "number" },
            description: "Number of items per page",
        },
        page: {
            control: { type: "number" },
            description: "Current page number",
        },
        total: {
            control: { type: "number" },
            description: "Total number of items",
        },
        pageSizes: {
            control: { type: "object" },
            description: "Available page sizes",
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default pagination
 */
export const Default: Story = {
    args: {
        size: 10,
        page: 1,
        total: 100,
        pageSizes: [5, 10, 20, 50],
    },
    render: (args) => ({
        components: { BdPagination },
        setup() {
            const page = ref(1);
            const size = ref(10);
            const total = ref(100);

            const handlePageChange = (newPage: number) => {
                page.value = newPage;
                console.log("Page changed to:", newPage);
            };

            const handleSizeChange = (newSize: number) => {
                size.value = newSize;
                page.value = 1; // Reset to first page when size changes
                console.log("Size changed to:", newSize);
            };

            return {
                args,
                page,
                size,
                total,
                handlePageChange,
                handleSizeChange,
            };
        },
        template: `
      <div class="w-full max-w-2xl">
        <div class="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-2">Pagination Demo</h3>
          <div class="text-sm text-gray-600 space-y-1">
            <div>Current page: {{ page }}</div>
            <div>Items per page: {{ size }}</div>
            <div>Total items: {{ total }}</div>
            <div>Total pages: {{ Math.ceil(total / size) }}</div>
          </div>
        </div>
        
        <BdPagination 
          :size="size"
          :page="page"
          :total="total"
          :page-sizes="args.pageSizes"
          @update:page="handlePageChange"
          @update:size="handleSizeChange"
        />
      </div>
    `,
    }),
};

/**
 * Small dataset
 */
export const SmallDataset: Story = {
    render: () => ({
        components: { BdPagination },
        setup() {
            const page = ref(1);
            const size = ref(5);
            const total = ref(23);

            return { page, size, total };
        },
        template: `
      <div class="w-full max-w-2xl">
        <div class="mb-4 p-4 bg-blue-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-2">Small Dataset (23 items)</h3>
          <div class="text-sm text-gray-600">
            Showing {{ (page - 1) * size + 1 }}-{{ Math.min(page * size, total) }} of {{ total }} items
          </div>
        </div>
        
        <BdPagination 
          :size="size"
          :page="page"
          :total="total"
          :page-sizes="[5, 10, 20]"
          @update:page="page = $event"
          @update:size="size = $event; page = 1"
        />
      </div>
    `,
    }),
};

/**
 * Large dataset
 */
export const LargeDataset: Story = {
    render: () => ({
        components: { BdPagination },
        setup() {
            const page = ref(1);
            const size = ref(20);
            const total = ref(1250);

            return { page, size, total };
        },
        template: `
      <div class="w-full max-w-2xl">
        <div class="mb-4 p-4 bg-green-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-2">Large Dataset (1,250 items)</h3>
          <div class="text-sm text-gray-600">
            Showing {{ (page - 1) * size + 1 }}-{{ Math.min(page * size, total) }} of {{ total }} items
          </div>
        </div>
        
        <BdPagination 
          :size="size"
          :page="page"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          @update:page="page = $event"
          @update:size="size = $event; page = 1"
        />
      </div>
    `,
    }),
};

/**
 * Different page sizes
 */
export const DifferentPageSizes: Story = {
    render: () => ({
        components: { BdPagination },
        setup() {
            const page = ref(1);
            const size = ref(10);
            const total = ref(200);

            const pageSizeOptions = [
                { label: "Small (5 items)", sizes: [5, 10, 15] },
                { label: "Medium (10 items)", sizes: [10, 20, 30] },
                { label: "Large (25 items)", sizes: [25, 50, 100] },
            ];

            return { page, size, total, pageSizeOptions };
        },
        template: `
      <div class="w-full max-w-4xl">
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-2">Different Page Size Options</h3>
          <div class="text-sm text-gray-600">
            Current: {{ size }} items per page, Page {{ page }} of {{ Math.ceil(total / size) }}
          </div>
        </div>
        
        <div class="space-y-6">
          <div v-for="option in pageSizeOptions" :key="option.label" class="space-y-2">
            <h4 class="text-md font-medium text-gray-700">{{ option.label }}</h4>
            <BdPagination 
              :size="size"
              :page="page"
              :total="total"
              :page-sizes="option.sizes"
              @update:page="page = $event"
              @update:size="size = $event; page = 1"
            />
          </div>
        </div>
      </div>
    `,
    }),
};

/**
 * Edge cases
 */
export const EdgeCases: Story = {
    render: () => ({
        components: { BdPagination },
        setup() {
            const scenarios = ref([
                { name: "Single page", page: 1, size: 10, total: 5 },
                { name: "Exactly one page", page: 1, size: 10, total: 10 },
                { name: "Last page", page: 3, size: 10, total: 25 },
                { name: "Large page size", page: 1, size: 100, total: 150 },
            ]);

            return { scenarios };
        },
        template: `
      <div class="w-full max-w-4xl">
        <div class="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-2">Edge Cases</h3>
          <div class="text-sm text-gray-600">
            Testing pagination behavior in various scenarios
          </div>
        </div>
        
        <div class="space-y-6">
          <div v-for="scenario in scenarios" :key="scenario.name" class="space-y-2">
            <h4 class="text-md font-medium text-gray-700">{{ scenario.name }}</h4>
            <div class="text-sm text-gray-500 mb-2">
              Page {{ scenario.page }}, Size {{ scenario.size }}, Total {{ scenario.total }}
            </div>
            <BdPagination 
              :size="scenario.size"
              :page="scenario.page"
              :total="scenario.total"
              :page-sizes="[5, 10, 20, 50, 100]"
            />
          </div>
        </div>
      </div>
    `,
    }),
};

/**
 * In a table context
 */
export const InTableContext: Story = {
    render: () => ({
        components: { BdPagination },
        setup() {
            const page = ref(1);
            const size = ref(10);
            const total = ref(87);

            // Mock data
            const items = ref(
                Array.from({ length: total.value }, (_, i) => ({
                    id: i + 1,
                    name: `Item ${i + 1}`,
                    status: ["Active", "Inactive", "Pending"][i % 3],
                    date: new Date(2024, 0, i + 1).toLocaleDateString(),
                })),
            );

            const paginatedItems = computed(() => {
                const start = (page.value - 1) * size.value;
                const end = start + size.value;
                return items.value.slice(start, end);
            });

            return { page, size, total, paginatedItems };
        },
        template: `
      <div class="w-full max-w-4xl">
        <div class="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-2">Table with Pagination</h3>
          <div class="text-sm text-gray-600">
            Showing {{ (page - 1) * size + 1 }}-{{ Math.min(page * size, total) }} of {{ total }} items
          </div>
        </div>
        
        <div class="bg-white rounded-lg border overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="item in paginatedItems" :key="item.id">
                <td class="px-4 py-3 text-sm text-gray-900">{{ item.id }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ item.name }}</td>
                <td class="px-4 py-3 text-sm">
                  <span :class="{
                    'bg-green-100 text-green-800': item.status === 'Active',
                    'bg-red-100 text-red-800': item.status === 'Inactive',
                    'bg-yellow-100 text-yellow-800': item.status === 'Pending'
                  }" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ item.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mt-4 flex justify-center">
          <BdPagination 
            :size="size"
            :page="page"
            :total="total"
            :page-sizes="[5, 10, 20, 50]"
            @update:page="page = $event"
            @update:size="size = $event; page = 1"
          />
        </div>
      </div>
    `,
    }),
};
