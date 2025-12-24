<script setup lang="ts">
import type {
    AgentStatistics,
    QueryAgentStatisticsParams,
} from "@buildingai/service/consoleapi/ai-agent";
import { apiGetAgentStatistics } from "@buildingai/service/consoleapi/ai-agent";
import { type ColorName, getColor } from "@buildingai/web-config/theme";
import { useColorMode } from "@vueuse/core";

// 路由和配置
const route = useRoute();
const agentId = computed(() => (route.params as Record<string, string>).id) as ComputedRef<string>;
const { t } = useI18n();
const appConfig = useAppConfig();
const colorMode = useColorMode();

// 状态管理
const statistics = shallowRef<AgentStatistics | null>(null);
const loading = shallowRef(true);
const state = reactive<QueryAgentStatisticsParams>({
    startDate: "",
    endDate: "",
});

// 主题色
const currentColor = computed(() => getColor(appConfig.ui.colors.primary as ColorName, 500));
const successColor = computed(() => getColor(appConfig.ui.colors.success as ColorName, 500));
const warningColor = computed(() => getColor(appConfig.ui.colors.warning as ColorName, 500));

// 获取统计数据
const fetchStatistics = async () => {
    try {
        loading.value = true;
        statistics.value = await apiGetAgentStatistics(agentId.value, state);
    } catch (error) {
        console.error("获取统计数据失败:", error);
        statistics.value = null;
    } finally {
        loading.value = false;
    }
};

// 时间范围变化处理
const handleDateChange = () => {
    // 确保日期格式为完整的ISO格式
    if (state.startDate) {
        const startDate = new Date(state.startDate);
        startDate.setHours(0, 0, 0, 0);
        state.startDate = startDate.toISOString();
    }

    if (state.endDate) {
        const endDate = new Date(state.endDate);
        endDate.setHours(23, 59, 59, 999);
        state.endDate = endDate.toISOString();
    }

    fetchStatistics();
};

// 通用图表配置
const getBaseChartConfig = () => ({
    tooltip: {
        trigger: "axis" as const,
        backgroundColor: colorMode.value === "dark" ? "#1f2937" : "#ffffff",
        borderColor: colorMode.value === "dark" ? "#374151" : "#e5e7eb",
        textStyle: { color: colorMode.value === "dark" ? "#f9fafb" : "#111827" },
    },
    grid: { top: 30, left: 20, right: 20, bottom: 20, containLabel: true },
    xAxis: {
        type: "category" as const,
        boundaryGap: false,
        axisLine: { lineStyle: { color: colorMode.value === "dark" ? "#374151" : "#d1d5db" } },
        axisLabel: { color: colorMode.value === "dark" ? "#9ca3af" : "#6b7280", fontSize: 12 },
        splitLine: { show: false },
    },
    yAxis: {
        type: "value" as const,
        splitLine: {
            lineStyle: {
                color: colorMode.value === "dark" ? "#374151" : "#f3f4f6",
                type: "dashed" as const,
            },
        },
        axisLine: { show: false },
        axisLabel: { show: false },
    },
});

const createChartConfig = (
    name: string,
    data: Array<{ date: string; count: number }>,
    color: string,
    type: "line" | "bar" = "line",
) => {
    const baseConfig = getBaseChartConfig();
    const dates = data.map((item) => {
        const date = new Date(item.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    return {
        ...baseConfig,
        xAxis: { ...baseConfig.xAxis, data: dates, boundaryGap: type === "bar" },
        yAxis: type === "bar" ? { ...baseConfig.yAxis, name: "用户数" } : baseConfig.yAxis,
        series: [
            {
                name,
                type,
                data: data.map((item) => item.count),
                ...(type === "line"
                    ? {
                          smooth: true,
                          symbol: "circle",
                          symbolSize: 8,
                          lineStyle: { width: 4, color },
                          itemStyle: { color, borderWidth: 2, borderColor: "#fff" },
                          areaStyle: {
                              color: {
                                  type: "linear",
                                  x: 0,
                                  y: 0,
                                  x2: 0,
                                  y2: 1,
                                  colorStops: [
                                      { offset: 0, color },
                                      { offset: 1, color },
                                  ],
                              },
                              opacity: 0.1,
                          },
                          emphasis: {
                              itemStyle: { color },
                              lineStyle: { color },
                              areaStyle: { color },
                          },
                      }
                    : {
                          barWidth: "50%",
                          showBackground: true,
                          backgroundStyle: {
                              color: "rgba(180, 180, 180, 0.2)",
                              borderRadius: [4, 4, 0, 0],
                          },
                          itemStyle: {
                              borderRadius: [4, 4, 0, 0],
                              color: {
                                  type: "linear",
                                  x: 0,
                                  y: 0,
                                  x2: 0,
                                  y2: 1,
                                  colorStops: [
                                      { offset: 0, color },
                                      { offset: 1, color },
                                  ],
                              },
                          },
                          emphasis: { itemStyle: { color: currentColor.value } },
                      }),
            },
        ],
    };
};

// 图表配置
const chartOptions = computed(() => {
    if (!statistics.value?.trends) return {};

    return {
        consumedPower: createChartConfig(
            t("ai-agent.backend.dashboard.consumedPower"),
            statistics.value.trends.consumedPower,
            currentColor.value,
        ),
        messages: createChartConfig(
            t("ai-agent.backend.dashboard.messages"),
            statistics.value.trends.messages,
            successColor.value,
        ),
        tokens: createChartConfig(
            t("ai-agent.backend.dashboard.tokens"),
            statistics.value.trends.tokens,
            warningColor.value,
        ),
        activeUsers: createChartConfig(
            t("ai-agent.backend.dashboard.activeUsers"),
            statistics.value.trends.activeUsers,
            currentColor.value,
            "bar",
        ),
    };
});

// 初始化时间范围并获取数据
onMounted(() => {
    const today = new Date();

    // 开始时间：7天前 00:00:00.000Z
    const startDate = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
    startDate.setHours(0, 0, 0, 0);

    // 结束时间：当天 23:59:59.999Z
    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    // 使用完整的ISO格式
    state.startDate = startDate.toISOString();
    state.endDate = endDate.toISOString();

    fetchStatistics();
});

definePageMeta({ layout: "full-screen" });
</script>

<template>
    <div class="flex h-full w-full flex-col">
        <!-- 标题和时间选择器 -->
        <div class="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h1 class="text-foreground text-2xl font-bold">
                    {{ t("ai-agent.backend.dashboard.title") }}
                </h1>
                <p class="text-muted-foreground mt-1">{{ t("ai-agent.backend.dashboard.desc") }}</p>
            </div>
            <BdDateRangePicker
                v-model:start="state.startDate"
                v-model:end="state.endDate"
                :show-time="false"
                :ui="{ root: 'w-auto sm:w-xs' }"
                @change="handleDateChange"
            />
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="flex h-full flex-col items-center justify-center">
            <UIcon name="i-lucide-loader-2" class="text-primary h-6 w-6 animate-spin" />
            <span class="text-muted-foreground ml-2">{{
                t("ai-agent.backend.dashboard.loading")
            }}</span>
        </div>

        <!-- 统计数据展示 -->
        <div v-else-if="statistics" class="m-px flex h-full flex-col space-y-6 overflow-y-auto">
            <BdScrollArea class="table h-full px-4" :shadow="false">
                <div class="p-px pb-4">
                    <!-- 总览卡片 -->
                    <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <UCard>
                            <template #header>
                                <div class="mb-1 flex items-center font-medium">
                                    {{ t("ai-agent.backend.dashboard.conversationStatistics") }}
                                </div>
                                <div class="text-muted-foreground mb-1 flex items-center gap-1">
                                    <UIcon name="i-lucide-info" class="size-3" />
                                    <TimeDisplay
                                        :datetime="new Date().toISOString()"
                                        mode="datetime"
                                        class="text-xs"
                                    />
                                </div>
                            </template>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <div>
                                        <div>
                                            <span class="text-2xl font-bold">
                                                {{
                                                    formatCompactNumber(
                                                        statistics.overview.totalConversations,
                                                    )
                                                }}
                                            </span>
                                            <span class="text-muted-foreground ml-1 text-xs">
                                                {{ t("ai-agent.backend.dashboard.times") }}
                                            </span>
                                        </div>
                                        <div class="text-muted-foreground text-xs">
                                            {{ t("ai-agent.backend.dashboard.totalConversations") }}
                                        </div>
                                    </div>
                                    <USeparator orientation="vertical" class="h-6" />
                                    <div>
                                        <div>
                                            <span class="text-2xl font-bold">
                                                {{
                                                    formatCompactNumber(
                                                        statistics.overview.totalMessages,
                                                    )
                                                }}
                                            </span>
                                            <span class="text-muted-foreground ml-1 text-xs">
                                                {{ t("ai-agent.backend.dashboard.messages") }}
                                            </span>
                                        </div>
                                        <div class="text-muted-foreground text-xs">
                                            {{ t("ai-agent.backend.dashboard.totalMessages") }}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="text-muted-foreground flex flex-col items-center justify-center"
                                >
                                    <UIcon
                                        name="i-lucide-message-circle"
                                        class="text-primary size-7"
                                    />
                                    <span class="text-xs">
                                        {{ t("ai-agent.backend.dashboard.conversationData") }}
                                    </span>
                                </div>
                            </div>
                        </UCard>

                        <UCard>
                            <template #header>
                                <div class="mb-1 flex items-center font-medium">
                                    {{ t("ai-agent.backend.dashboard.tokenConsumption") }}
                                </div>
                                <div class="text-muted-foreground mb-1 flex items-center gap-1">
                                    <UIcon name="i-lucide-info" class="size-3" />
                                    <TimeDisplay
                                        :datetime="new Date().toISOString()"
                                        mode="datetime"
                                        class="text-xs"
                                    />
                                </div>
                            </template>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <div>
                                        <div>
                                            <span class="text-2xl font-bold">
                                                {{
                                                    formatCompactNumber(
                                                        statistics.overview.totalConsumedPower,
                                                    )
                                                }}
                                            </span>
                                            <span class="text-muted-foreground ml-1 text-xs">
                                                {{ t("ai-agent.backend.dashboard.power") }}
                                            </span>
                                        </div>
                                        <div class="text-muted-foreground text-xs">
                                            {{ t("ai-agent.backend.dashboard.totalConsumedPower") }}
                                        </div>
                                    </div>
                                    <USeparator orientation="vertical" class="h-6" />
                                    <div>
                                        <div>
                                            <span class="text-2xl font-bold">
                                                {{
                                                    formatCompactNumber(
                                                        statistics.overview.totalTokens,
                                                    )
                                                }}
                                            </span>
                                            <span class="text-muted-foreground ml-1 text-xs">
                                                {{ t("ai-agent.backend.dashboard.tokens") }}
                                            </span>
                                        </div>
                                        <div class="text-muted-foreground text-xs">
                                            {{
                                                t(
                                                    "ai-agent.backend.dashboard.totalTokenConsumption",
                                                )
                                            }}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="text-muted-foreground flex flex-col items-center justify-center"
                                >
                                    <UIcon name="i-lucide-zap" class="text-primary size-7" />
                                    <span class="text-xs">{{
                                        t("ai-agent.backend.dashboard.consumptionStatistics")
                                    }}</span>
                                </div>
                            </div>
                        </UCard>

                        <UCard>
                            <template #header>
                                <div class="mb-1 flex items-center font-medium">
                                    {{ t("ai-agent.backend.dashboard.annotationManagement") }}
                                </div>
                                <div class="text-muted-foreground mb-1 flex items-center gap-1">
                                    <UIcon name="i-lucide-info" class="size-3" />
                                    <TimeDisplay
                                        :datetime="new Date().toISOString()"
                                        mode="datetime"
                                        class="text-xs"
                                    />
                                </div>
                            </template>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <div>
                                        <div>
                                            <span class="text-2xl font-bold">
                                                {{ statistics.overview.totalAnnotations }}
                                            </span>
                                            <span class="text-muted-foreground ml-1 text-xs">
                                                {{ t("ai-agent.backend.dashboard.annotations") }}
                                            </span>
                                        </div>
                                        <div class="text-muted-foreground text-xs">
                                            {{ t("ai-agent.backend.dashboard.totalAnnotations") }}
                                        </div>
                                    </div>
                                    <USeparator orientation="vertical" class="h-6" />
                                    <div>
                                        <div>
                                            <span class="text-2xl font-bold">
                                                {{ statistics.overview.annotationHitCount }}
                                            </span>
                                            <span class="text-muted-foreground ml-1 text-xs">
                                                {{ t("ai-agent.backend.dashboard.annotations") }}
                                            </span>
                                        </div>
                                        <div class="text-muted-foreground text-xs">
                                            {{ t("ai-agent.backend.dashboard.annotationHits") }}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="text-muted-foreground flex flex-col items-center justify-center"
                                >
                                    <UIcon name="i-lucide-bookmark" class="text-primary size-7" />
                                    <span class="text-xs">
                                        {{ t("ai-agent.backend.dashboard.annotationData") }}
                                    </span>
                                </div>
                            </div>
                        </UCard>
                    </div>

                    <!-- 图表区域 -->
                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <UCard>
                            <template #header>
                                <div class="flex items-center justify-between">
                                    <h3 class="text-lg font-medium">
                                        {{ t("ai-agent.backend.dashboard.consumedPowerTrend") }}
                                    </h3>
                                </div>
                                <div class="text-muted-foreground mb-1 flex items-center gap-1">
                                    <UIcon name="i-lucide-info" class="size-3" />
                                    <TimeDisplay
                                        :datetime="state.startDate as string"
                                        mode="datetime"
                                        class="text-xs"
                                    />
                                    <span>~</span>
                                    <TimeDisplay
                                        :datetime="state.endDate as string"
                                        mode="datetime"
                                        class="text-xs"
                                    />
                                </div>
                            </template>
                            <div class="h-80">
                                <BdEcharts
                                    v-if="statistics?.trends?.consumedPower"
                                    :options="chartOptions.consumedPower"
                                    height="100%"
                                />
                            </div>
                        </UCard>

                        <UCard>
                            <template #header>
                                <div class="flex items-center justify-between">
                                    <h3 class="text-lg font-medium">
                                        {{ t("ai-agent.backend.dashboard.messageTrend") }}
                                    </h3>
                                </div>
                                <div class="text-muted-foreground mb-1 flex items-center gap-1">
                                    <UIcon name="i-lucide-info" class="size-3" />
                                    <TimeDisplay
                                        :datetime="state.startDate as string"
                                        mode="datetime"
                                        class="text-xs"
                                    />
                                    <span>~</span>
                                    <TimeDisplay
                                        :datetime="state.endDate as string"
                                        mode="datetime"
                                        class="text-xs"
                                    />
                                </div>
                            </template>
                            <div class="h-80">
                                <BdEcharts
                                    v-if="statistics?.trends?.messages"
                                    :options="chartOptions.messages"
                                    height="100%"
                                />
                            </div>
                        </UCard>

                        <UCard>
                            <template #header>
                                <div class="flex items-center justify-between">
                                    <h3 class="text-lg font-medium">
                                        {{ t("ai-agent.backend.dashboard.tokenOutputCount") }}
                                    </h3>
                                </div>
                                <div class="text-muted-foreground mb-1 flex items-center gap-1">
                                    <UIcon name="i-lucide-info" class="size-3" />
                                    <TimeDisplay
                                        :datetime="state.startDate as string"
                                        mode="datetime"
                                        class="text-xs"
                                    />
                                    <span>~</span>
                                    <TimeDisplay
                                        :datetime="state.endDate as string"
                                        mode="datetime"
                                        class="text-xs"
                                    />
                                </div>
                            </template>
                            <div class="h-80">
                                <BdEcharts
                                    v-if="statistics?.trends?.tokens"
                                    :options="chartOptions.tokens"
                                    height="100%"
                                />
                            </div>
                        </UCard>

                        <UCard>
                            <template #header>
                                <div class="flex items-center justify-between">
                                    <h3 class="text-lg font-medium">
                                        {{ t("ai-agent.backend.dashboard.activeUsers") }}
                                    </h3>
                                </div>
                                <div class="text-muted-foreground mb-1 flex items-center gap-1">
                                    <UIcon name="i-lucide-info" class="size-3" />
                                    <TimeDisplay
                                        :datetime="state.startDate as string"
                                        mode="datetime"
                                        class="text-xs"
                                    />
                                    <span>~</span>
                                    <TimeDisplay
                                        :datetime="state.endDate as string"
                                        mode="datetime"
                                        class="text-xs"
                                    />
                                </div>
                            </template>
                            <div class="h-80">
                                <BdEcharts
                                    v-if="statistics?.trends?.activeUsers"
                                    :options="chartOptions.activeUsers"
                                    height="100%"
                                />
                            </div>
                        </UCard>
                    </div>
                </div>
            </BdScrollArea>
        </div>

        <!-- 错误状态 -->
        <div v-else class="py-12 text-center">
            <UIcon name="i-lucide-alert-circle" class="text-error mx-auto mb-4 h-12 w-12" />
            <p class="text-muted-foreground">
                {{ t("ai-agent.backend.dashboard.loadStatisticsFailed") }}
            </p>
            <UButton @click="fetchStatistics" class="mt-4" variant="outline">{{
                t("ai-agent.backend.dashboard.reload")
            }}</UButton>
        </div>
    </div>
</template>
