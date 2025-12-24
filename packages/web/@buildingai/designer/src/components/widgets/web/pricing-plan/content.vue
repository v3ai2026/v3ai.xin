<script lang="ts" setup>
/**
 * 价格计划组件
 * @description 用于展示价格方案的营销组件，包含标题、描述、价格、功能列表和行动按钮
 */
import { computed, type CSSProperties } from "vue";

import { navigateToWeb } from "@/utils/helper";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = defineProps<Props>();

/**
 * 价格计划容器样式计算
 */
const pricingPlanStyle = computed<CSSProperties>(() => ({
    borderRadius: `${props.borderRadius}px`,
    border: props.borderWidth > 0 ? `${props.borderWidth}px solid ${props.borderColor}` : "none",
    backgroundColor: props.style.bgColor,
    overflow: "hidden",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    transition: "all 0.2s ease",
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
    gap: "20px",
}));

/**
 * 格式化价格显示
 */
const formattedCurrentPrice = computed(() => {
    return `${props.currencySymbol}${props.currentPrice}`;
});

/**
 * 格式化原价显示
 */
const formattedOriginalPrice = computed(() => {
    return props.originalPrice > 0 ? `${props.currencySymbol}${props.originalPrice}` : "";
});

/**
 * 是否显示原价
 */
const showOriginalPrice = computed(() => {
    return props.originalPrice > 0 && props.originalPrice !== props.currentPrice;
});
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="pricing-plan-content"
    >
        <template #default="{ style }">
            <div :style="pricingPlanStyle" class="pricing-plan-wrapper">
                <!-- 热门标签 -->
                <div v-if="props.showPopularBadge" class="absolute top-4 right-4 z-10">
                    <UBadge
                        :color="props.badgeColor"
                        :variant="props.badgeVariant === 'ghost' ? 'subtle' : props.badgeVariant"
                        size="sm"
                        class="text-xs font-medium"
                    >
                        {{ props.popularBadgeText }}
                    </UBadge>
                </div>

                <!-- 内容区域 -->
                <div :style="contentAreaStyle" class="pricing-plan-body">
                    <!-- 计划标题 -->
                    <div class="pricing-plan-header">
                        <h3
                            class="text-secondary-foreground dark:text-background text-2xl font-bold"
                        >
                            {{ props.planName }}
                        </h3>
                        <p
                            v-if="props.planDescription"
                            class="text-accent-foreground dark:text-muted-foreground mt-2 text-sm"
                        >
                            {{ props.planDescription }}
                        </p>
                    </div>

                    <!-- 价格区域 -->
                    <div class="pricing-plan-price">
                        <div class="flex items-baseline gap-2">
                            <span
                                v-if="showOriginalPrice"
                                class="text-muted-foreground text-lg line-through"
                            >
                                {{ formattedOriginalPrice }}
                            </span>
                            <span
                                class="text-secondary-foreground dark:text-background text-4xl font-bold"
                            >
                                {{ formattedCurrentPrice }}
                            </span>
                            <span class="text-accent-foreground dark:text-muted-foreground text-sm">
                                {{ props.pricePeriod }}
                            </span>
                        </div>
                    </div>

                    <!-- 功能列表 -->
                    <div
                        v-if="props.features && props.features.length > 0"
                        class="pricing-plan-features flex-1"
                    >
                        <ul class="space-y-3">
                            <li
                                v-for="(feature, index) in props.features"
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
                    <div class="pricing-plan-actions mt-auto">
                        <UButton
                            :color="props.buttonColor"
                            :variant="props.buttonVariant"
                            size="lg"
                            class="w-full font-medium"
                            @click="navigateToWeb(props.to)"
                        >
                            {{ props.buttonText }}
                        </UButton>
                    </div>
                </div>
            </div>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.pricing-plan-content {
    height: 100%;

    .pricing-plan-wrapper {
        transition: all 0.2s ease;

        &:hover {
            transform: translateY(-4px);
        }
    }

    .pricing-plan-header h3 {
        margin: 0;
        line-height: 1.2;
    }

    .pricing-plan-header p {
        margin: 0;
        line-height: 1.4;
    }

    .pricing-plan-price {
        .line-through {
            text-decoration: line-through;
        }
    }

    .pricing-plan-features {
        min-height: 0; // 允许flex子元素收缩

        ul {
            margin: 0;
            padding: 0;
            list-style: none;
        }

        li {
            margin: 0;
        }
    }
}
</style>
