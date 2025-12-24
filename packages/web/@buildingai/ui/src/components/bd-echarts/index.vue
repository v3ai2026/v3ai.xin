<script setup lang="ts">
import { useElementSize, useResizeObserver, useThrottleFn } from "@vueuse/core";
import type { EChartsType } from "echarts";
// Import common charts, the suffix of the chart is Chart
import {
    BarChart,
    LineChart,
    MapChart,
    PictorialBarChart,
    PieChart,
    RadarChart,
    ScatterChart,
} from "echarts/charts";
// Import tooltip, title, Cartesian coordinate system, dataset, built-in data converter components, the suffix of the component is Component
import {
    AriaComponent,
    CalendarComponent,
    DataZoomComponent,
    GraphicComponent,
    GridComponent,
    LegendComponent,
    ParallelComponent,
    PolarComponent,
    RadarComponent,
    TimelineComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    VisualMapComponent,
} from "echarts/components";
// Import echarts core module, the core module provides the interface that echarts must use
const echarts = await import("echarts/core");
// Label automatic layout, global transition animation and other features
const { LabelLayout, UniversalTransition } = await import("echarts/features");
// Import Canvas renderer, note that importing CanvasRenderer or SVGRenderer is a necessary step
const { CanvasRenderer } = await import("echarts/renderers");
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";

import type { BdEchartsProps } from "./types";

// Register required components
echarts.use([
    LegendComponent,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    PolarComponent,
    AriaComponent,
    ParallelComponent,
    BarChart,
    LineChart,
    PieChart,
    MapChart,
    RadarChart,
    PictorialBarChart,
    RadarComponent,
    ToolboxComponent,
    DataZoomComponent,
    VisualMapComponent,
    TimelineComponent,
    CalendarComponent,
    GraphicComponent,
    ScatterChart,
    CanvasRenderer,
    LabelLayout,
    UniversalTransition,
]);

/**
 * Component property definition
 */
const props = withDefaults(defineProps<BdEchartsProps>(), {
    theme: "",
    height: "100%",
    autoResize: true,
    animation: true,
    renderer: "canvas",
    loading: false,
    loadingText: "Loading...",
});

// Chart container reference
const chartRef = ref<HTMLElement | null>(null);
// ECharts instance (using shallowRef to avoid unnecessary deep reactivity)
const chartInstance = shallowRef<EChartsType | null>(null);
// Container size
const { width, height } = useElementSize(chartRef);

/**
 * Initialize chart
 */
const initChart = () => {
    if (!chartRef.value) return;

    // Destroy old instance
    disposeChart();

    // Create new instance
    chartInstance.value = echarts.init(chartRef.value, props.theme, {
        renderer: props.renderer,
    }) as unknown as EChartsType;

    // Set configuration
    updateChart();

    // Set loading state
    if (props.loading && chartInstance.value) {
        chartInstance.value.showLoading("default", {
            text: props.loadingText,
            maskColor: "rgba(255, 255, 255, 0.8)",
            textColor: "#999",
            fontSize: 14,
        });
    }
};

/**
 * Update chart configuration
 * 使用 requestAnimationFrame 延迟更新,避免强制重排
 */
const updateChart = () => {
    if (!chartInstance.value || !props.options) return;

    // 使用 requestAnimationFrame 延迟执行,避免在 JavaScript 执行过程中强制重排
    requestAnimationFrame(() => {
        if (!chartInstance.value) return;

        // Set configuration
        chartInstance.value.setOption(props.options, true);

        // Update loading state
        if (props.loading) {
            chartInstance.value.showLoading("default", {
                text: props.loadingText,
                maskColor: "rgba(255, 255, 255, 0.8)",
                textColor: "#999",
                fontSize: 14,
            });
        } else {
            chartInstance.value.hideLoading();
        }
    });
};

/**
 * Adjust chart size
 * 使用 requestAnimationFrame 延迟调整大小,避免强制重排
 */
const resizeChart = useThrottleFn(() => {
    // 使用 requestAnimationFrame 延迟执行,避免在 JavaScript 执行过程中强制重排
    requestAnimationFrame(() => {
        if (chartInstance.value) {
            chartInstance.value.resize();
        }
    });
}, 100);

/**
 * Destroy chart instance
 */
const disposeChart = () => {
    if (chartInstance.value) {
        chartInstance.value.dispose();
        chartInstance.value = null;
    }
};

// Listen to configuration changes
watch(
    () => props.options,
    () => {
        // 使用 nextTick 确保 DOM 更新完成后再更新图表
        // updateChart 内部已经使用 requestAnimationFrame 延迟执行,避免强制重排
        nextTick(() => {
            if (chartInstance.value) {
                updateChart();
            } else {
                initChart();
            }
        });
    },
    { deep: true, immediate: true },
);

// Listen to loading state changes
watch(
    () => props.loading,
    (val) => {
        if (!chartInstance.value) return;

        if (val) {
            chartInstance.value.showLoading("default", {
                text: props.loadingText,
                maskColor: "rgba(255, 255, 255, 0.8)",
                textColor: "#999",
                fontSize: 14,
            });
        } else {
            chartInstance.value.hideLoading();
        }
    },
);

// Listen to container size changes
if (props.autoResize) {
    watch([width, height], () => {
        resizeChart();
    });

    // Use ResizeObserver to listen to container size changes
    useResizeObserver(chartRef, () => {
        resizeChart();
    });
}

// Initialize chart when component is mounted
onMounted(() => {
    // 使用 nextTick 确保 DOM 渲染完成,再使用 requestAnimationFrame 延迟初始化
    nextTick(() => {
        requestAnimationFrame(() => {
            initChart();
        });
    });
});

// Destroy chart before component is unmounted
onBeforeUnmount(() => {
    disposeChart();
});

// Expose methods to parent components
defineExpose({
    // Get ECharts instance
    getChartInstance: () => chartInstance.value,
});
</script>

<template>
    <div ref="chartRef" class="bd-echarts" :style="{ height: props.height }"></div>
</template>

<style scoped>
.bd-echarts {
    width: 100%;
    min-height: 200px;
}
</style>
