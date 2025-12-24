<script lang="ts" setup>
/**
 * 价格计划列表组件
 * @description 用于展示多个价格方案的营销组件，支持动态添加和删除计划
 */
import { computed, type CSSProperties } from "vue";

import { navigateToWeb } from "@/utils/helper";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { PricingPlanItem, Props } from "./config";

const props = defineProps<Props>();

/**
 * 容器样式计算
 */
const containerStyle = computed<CSSProperties>(() => ({
    borderRadius: `${props.borderRadius}px`,
    border: props.borderWidth > 0 ? `${props.borderWidth}px solid ${props.borderColor}` : "none",
    backgroundColor: props.style.bgColor,
    overflow: "hidden",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    ...(props.shadow !== "none" && {
        boxShadow: {
            sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        }[props.shadow],
    }),
}));

/**
 * 内容区域样式
 */
const contentAreaStyle = computed<CSSProperties>(() => ({
    padding: `${props.style.paddingTop}px ${props.style.paddingRight}px ${props.style.paddingBottom}px ${props.style.paddingLeft}px`,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "32px",
}));

/**
 * 网格容器样式
 */
const gridStyle = computed<CSSProperties>(() => ({
    display: "grid",
    gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
    gap: `${props.gap}px`,
    flex: 1,
}));

/**
 * 单个价格卡片样式
 */
const cardStyle = computed(
    () =>
        (plan: PricingPlanItem): CSSProperties => ({
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            overflow: "hidden",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        }),
);

/**
 * 格式化价格显示
 */
const formatPrice = (plan: PricingPlanItem) => {
    return `${plan.currencySymbol}${plan.currentPrice}`;
};

/**
 * 格式化原价显示
 */
const formatOriginalPrice = (plan: PricingPlanItem) => {
    return plan.originalPrice > 0 ? `${plan.currencySymbol}${plan.originalPrice}` : "";
};

/**
 * 是否显示原价
 */
const shouldShowOriginalPrice = (plan: PricingPlanItem) => {
    return plan.originalPrice > 0 && plan.originalPrice !== plan.currentPrice;
};
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="pricing-plans-content"
    >
        <template #default="{ style }">
            <div :style="containerStyle" class="pricing-plans-wrapper">
                <div :style="contentAreaStyle" class="pricing-plans-body">
                    <!-- 标题和描述 -->
                    <div
                        v-if="props.showTitle || props.showDescription"
                        class="pricing-plans-header text-center"
                    >
                        <h2
                            v-if="props.showTitle && props.title"
                            class="text-secondary-foreground dark:text-background mb-4 text-3xl font-bold"
                        >
                            {{ props.title }}
                        </h2>
                        <p
                            v-if="props.showDescription && props.description"
                            class="text-accent-foreground dark:text-muted-foreground mx-auto max-w-2xl text-lg"
                        >
                            {{ props.description }}
                        </p>
                    </div>

                    <!-- 价格计划网格 -->
                    <div :style="gridStyle" class="pricing-plans-grid">
                        <div
                            v-for="plan in props.plans"
                            :key="plan.id"
                            :style="cardStyle(plan)"
                            class="pricing-plan-card"
                        >
                            <!-- 热门标签 -->
                            <div v-if="plan.showPopularBadge" class="absolute top-4 right-4 z-10">
                                <UBadge
                                    :color="plan.badgeColor"
                                    :variant="
                                        plan.badgeVariant === 'ghost' ? 'subtle' : plan.badgeVariant
                                    "
                                    size="sm"
                                    class="text-xs font-medium"
                                >
                                    {{ plan.popularBadgeText }}
                                </UBadge>
                            </div>

                            <!-- 卡片内容 -->
                            <div class="flex h-full flex-col gap-5 p-6">
                                <!-- 计划标题 -->
                                <div class="plan-header">
                                    <h3
                                        class="text-secondary-foreground dark:text-background text-2xl font-bold"
                                    >
                                        {{ plan.planName }}
                                    </h3>
                                    <p
                                        v-if="plan.planDescription"
                                        class="text-accent-foreground dark:text-muted-foreground mt-2 text-sm"
                                    >
                                        {{ plan.planDescription }}
                                    </p>
                                </div>

                                <!-- 价格区域 -->
                                <div class="plan-price">
                                    <div class="flex items-baseline gap-2">
                                        <span
                                            v-if="shouldShowOriginalPrice(plan)"
                                            class="text-muted-foreground text-lg line-through"
                                        >
                                            {{ formatOriginalPrice(plan) }}
                                        </span>
                                        <span
                                            class="text-secondary-foreground dark:text-background text-4xl font-bold"
                                        >
                                            {{ formatPrice(plan) }}
                                        </span>
                                        <span
                                            class="text-accent-foreground dark:text-muted-foreground text-sm"
                                        >
                                            {{ plan.pricePeriod }}
                                        </span>
                                    </div>
                                </div>

                                <!-- 功能列表 -->
                                <div
                                    v-if="plan.features && plan.features.length > 0"
                                    class="plan-features flex-1"
                                >
                                    <ul class="space-y-3">
                                        <li
                                            v-for="(feature, index) in plan.features"
                                            :key="index"
                                            class="flex items-center gap-3"
                                        >
                                            <UIcon
                                                name="i-heroicons-check-circle-solid"
                                                class="h-5 w-5 flex-none text-green-500"
                                            />
                                            <span class="text-sm text-gray-700 dark:text-gray-300">
                                                {{ feature }}
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <!-- 操作按钮 -->
                                <div class="plan-actions mt-auto">
                                    <UButton
                                        :color="plan.buttonColor"
                                        :variant="plan.buttonVariant"
                                        size="lg"
                                        @click="navigateToWeb(plan.to)"
                                        class="w-full font-medium"
                                    >
                                        {{ plan.buttonText }}
                                    </UButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.pricing-plans-content {
    height: 100%;

    .pricing-plans-wrapper {
        height: 100%;
    }

    .pricing-plan-card {
        transition: all 0.2s ease;

        &:hover {
            transform: translateY(-4px);
            box-shadow:
                0 10px 15px -3px rgb(0 0 0 / 0.1),
                0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
    }

    .plan-header h3 {
        margin: 0;
        line-height: 1.2;
    }

    .plan-header p {
        margin: 0;
        line-height: 1.4;
    }

    .plan-price {
        .line-through {
            text-decoration: line-through;
        }
    }

    .plan-features {
        min-height: 0;

        ul {
            margin: 0;
            padding: 0;
            list-style: none;
        }

        li {
            margin: 0;
        }
    }

    .pricing-plans-header h2 {
        margin: 0;
        line-height: 1.2;
    }

    .pricing-plans-header p {
        margin: 0;
        line-height: 1.5;
    }
}
</style>
