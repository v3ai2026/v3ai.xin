import type { Meta, StoryObj } from "@storybook/vue3";

import BdEcharts from "./index.vue";

/**
 * BdEcharts component stories
 * @description Stories for the BdEcharts component that renders ECharts visualizations
 */
const meta: Meta<typeof BdEcharts> = {
    title: "Components/BdEcharts",
    component: BdEcharts,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component:
                    "An ECharts wrapper component for data visualization with auto-resize and loading states.",
            },
        },
    },
    argTypes: {
        options: { control: { type: "object" }, description: "ECharts configuration options" },
        theme: { control: { type: "text" }, description: "Chart theme" },
        height: { control: { type: "text" }, description: "Chart height" },
        autoResize: { control: { type: "boolean" }, description: "Auto resize on window resize" },
        animation: { control: { type: "boolean" }, description: "Enable animations" },
        renderer: {
            control: { type: "select" },
            options: ["canvas", "svg"],
            description: "Rendering mode",
        },
        loading: { control: { type: "boolean" }, description: "Loading state" },
        loadingText: { control: { type: "text" }, description: "Loading text" },
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const lineChartOptions = {
    title: { text: "Line Chart Example" },
    tooltip: { trigger: "axis" },
    xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: { type: "value" },
    series: [
        {
            name: "Sales",
            type: "line",
            data: [120, 200, 150, 80, 70, 110, 130],
        },
    ],
};

const pieChartOptions = {
    title: { text: "Pie Chart Example" },
    tooltip: { trigger: "item" },
    series: [
        {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: [
                { value: 1048, name: "Search Engine" },
                { value: 735, name: "Direct" },
                { value: 580, name: "Email" },
                { value: 484, name: "Union Ads" },
                { value: 300, name: "Video Ads" },
            ],
        },
    ],
};

export const LineChart: Story = {
    args: {
        options: lineChartOptions,
        height: "400px",
        autoResize: true,
        animation: true,
    },
    render: (args) => ({
        components: { BdEcharts },
        setup() {
            return { args };
        },
        template: `
      <div class="w-full">
        <BdEcharts v-bind="args" />
      </div>
    `,
    }),
};

export const PieChart: Story = {
    args: {
        options: pieChartOptions,
        height: "400px",
        autoResize: true,
        animation: true,
    },
    render: (args) => ({
        components: { BdEcharts },
        setup() {
            return { args };
        },
        template: `
      <div class="w-full">
        <BdEcharts v-bind="args" />
      </div>
    `,
    }),
};

export const Loading: Story = {
    args: {
        options: lineChartOptions,
        height: "400px",
        loading: true,
        loadingText: "Loading chart...",
    },
    render: (args) => ({
        components: { BdEcharts },
        setup() {
            return { args };
        },
        template: `
      <div class="w-full">
        <BdEcharts v-bind="args" />
      </div>
    `,
    }),
};

export const SvgRenderer: Story = {
    args: {
        options: pieChartOptions,
        height: "400px",
        renderer: "svg",
        autoResize: true,
    },
    render: (args) => ({
        components: { BdEcharts },
        setup() {
            return { args };
        },
        template: `
      <div class="w-full">
        <BdEcharts v-bind="args" />
      </div>
    `,
    }),
};
