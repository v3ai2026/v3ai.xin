import type { Meta, StoryObj } from "@storybook/vue3";

import BdDateRangePicker from "./index.vue";

/**
 * BdDateRangePicker component stories
 * @description Stories for the BdDateRangePicker component that provides date range selection
 */
const meta: Meta<typeof BdDateRangePicker> = {
    title: "Components/BdDateRangePicker",
    component: BdDateRangePicker,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A date range picker with optional time selection and multiple month display.",
            },
        },
    },
    argTypes: {
        start: { control: { type: "date" }, description: "Start date" },
        end: { control: { type: "date" }, description: "End date" },
        dateStyle: { control: { type: "select" }, options: ["full", "long", "medium", "short"] },
        disabled: { control: { type: "boolean" } },
        readonly: { control: { type: "boolean" } },
        clearable: { control: { type: "boolean" } },
        size: { control: { type: "select" }, options: ["xs", "sm", "md", "lg", "xl"] },
        numberOfMonths: { control: { type: "number" }, description: "Number of months to display" },
        showTime: { control: { type: "boolean" } },
        timeFormat: { control: { type: "text" } },
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
        start: new Date(),
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
        dateStyle: "medium",
        numberOfMonths: 2,
        showTime: false,
    },
    render: (args: any) => {
        const startDate = args.start;
        const endDate = args.end;
        return {
            components: { BdDateRangePicker },
            setup() {
                const start = ref<Date | null>(startDate as Date);
                const end = ref<Date | null>(endDate as Date);
                return { args, start, end };
            },
            template: `
      <div class="w-96">
        <BdDateRangePicker v-bind="args" v-model:start="start" v-model:end="end" />
        <div class="mt-2 text-sm text-gray-600">
          Start: {{ start?.toString() }}<br/>
          End: {{ end?.toString() }}
        </div>
      </div>
    `,
        };
    },
};

export const WithTime: Story = {
    render: () => ({
        components: { BdDateRangePicker },
        setup() {
            const start = ref<Date | null>(new Date());
            const end = ref<Date | null>(new Date(Date.now() + 24 * 60 * 60 * 1000));
            return { start, end };
        },
        template: `
      <div class="w-96">
        <BdDateRangePicker v-model:start="start" v-model:end="end" :show-time="true" time-format="HH:mm:ss" />
        <div class="mt-2 text-sm text-gray-600">
          Start: {{ start?.toString() }}<br/>
          End: {{ end?.toString() }}
        </div>
      </div>
    `,
    }),
};

export const SingleMonth: Story = {
    render: () => ({
        components: { BdDateRangePicker },
        setup() {
            const start = ref<Date | null>(new Date());
            const end = ref<Date | null>(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
            return { start, end };
        },
        template: `
      <div class="w-80">
        <BdDateRangePicker v-model:start="start" v-model:end="end" :number-of-months="1" />
        <div class="mt-2 text-sm text-gray-600">
          Start: {{ start?.toString() }}<br/>
          End: {{ end?.toString() }}
        </div>
      </div>
    `,
    }),
};
