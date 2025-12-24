<script lang="ts" setup>
import { computed } from "vue";

interface SmartGuideLineProps {
    type: "vertical" | "horizontal";
    position: number;
    // 对齐线属性
    alignType?: string;
    isAlignmentLine?: boolean;
    // 间距线属性
    distance?: number;
    isDistanceLine?: boolean;
    spacingType?:
        | "horizontal"
        | "vertical"
        | "canvas"
        | "canvas-left"
        | "canvas-right"
        | "canvas-top"
        | "canvas-bottom";
    isEqualSpacing?: boolean; // 是否为等间距线
    startX?: number;
    endX?: number;
    startY?: number;
    endY?: number;
}

const props = defineProps<{
    lines: SmartGuideLineProps[];
}>();

/**
 * 获取显示标签
 */
function getDisplayLabel(line: SmartGuideLineProps): string {
    if (line.isDistanceLine && line.distance !== undefined) {
        return `${Math.round(line.distance)}px`;
    }
    return ""; // 对齐线不显示标签
}

// 分离不同类型的线
const alignmentLines = computed(() => props.lines.filter((l) => l.isAlignmentLine));
const horizontalDistanceLines = computed(() =>
    props.lines.filter((l) => l.isDistanceLine && l.spacingType === "horizontal"),
);
const verticalDistanceLines = computed(() =>
    props.lines.filter((l) => l.isDistanceLine && l.spacingType === "vertical"),
);
const canvasDistanceLines = computed(() =>
    props.lines.filter((l) => l.isDistanceLine && l.spacingType?.startsWith("canvas")),
);
const equalSpacingLines = computed(() =>
    props.lines.filter((l) => l.isDistanceLine && l.isEqualSpacing),
);
</script>

<template>
    <div class="pointer-events-none absolute top-0 left-0 z-5 h-full w-full">
        <!-- 对齐参考线（红色虚线，不显示标签）-->
        <div
            v-for="(line, index) in alignmentLines"
            :key="`align-${index}`"
            class="absolute z-5"
            :class="
                line.type === 'vertical'
                    ? 'left-[var(--pos)] h-full w-px'
                    : 'top-[var(--pos)] h-px w-full'
            "
            :style="{
                '--pos': line.position + 'px',
                background:
                    line.type === 'vertical'
                        ? 'repeating-linear-gradient(to bottom, #ef4444 0px, #ef4444 2px, transparent 2px, transparent 4px)'
                        : 'repeating-linear-gradient(to right, #ef4444 0px, #ef4444 2px, transparent 2px, transparent 4px)',
            }"
        />

        <!-- 等间距线（绿色实线 + 特殊标识）-->
        <div
            v-for="(line, index) in equalSpacingLines"
            :key="`equal-spacing-${index}`"
            class="absolute bg-green-500"
            :class="line.type === 'vertical' ? 'w-px' : 'h-px'"
            :style="{
                left: line.type === 'vertical' ? line.position + 'px' : (line.startX || 0) + 'px',
                top: line.type === 'horizontal' ? line.position + 'px' : (line.startY || 0) + 'px',
                width:
                    line.type === 'horizontal'
                        ? Math.abs((line.endX || 0) - (line.startX || 0)) + 'px'
                        : '1px',
                height:
                    line.type === 'vertical'
                        ? Math.abs((line.endY || 0) - (line.startY || 0)) + 'px'
                        : '1px',
            }"
        >
            <!-- 等间距标签（带特殊图标）-->
            <div
                class="text-background pointer-events-none absolute flex items-center gap-1 rounded bg-green-500 px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap shadow-sm"
                :style="
                    line.type === 'horizontal'
                        ? 'left: 50%; top: -20px; transform: translateX(-50%)'
                        : 'left: 8px; top: 50%; transform: translateY(-50%)'
                "
            >
                <span class="text-[8px]">⚊</span>
                {{ getDisplayLabel(line) }}
            </div>
        </div>

        <!-- 水平间距连接线（红色实线 + 距离标签）-->
        <div
            v-for="(line, index) in horizontalDistanceLines.filter((l) => !l.isEqualSpacing)"
            :key="`h-distance-${index}`"
            class="absolute h-px bg-red-500"
            :style="{
                left: (line.startX || 0) + 'px',
                top: line.position + 'px',
                width: Math.abs((line.endX || 0) - (line.startX || 0)) + 'px',
            }"
        >
            <!-- 间距标签 -->
            <div
                class="text-background pointer-events-none absolute rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap shadow-sm"
                style="left: 50%; top: -15px; transform: translateX(-50%)"
            >
                {{ getDisplayLabel(line) }}
            </div>
        </div>

        <!-- 垂直间距连接线（红色实线 + 距离标签）-->
        <div
            v-for="(line, index) in verticalDistanceLines.filter((l) => !l.isEqualSpacing)"
            :key="`v-distance-${index}`"
            class="absolute w-px bg-red-500"
            :style="{
                left: line.position + 'px',
                top: (line.startY || 0) + 'px',
                height: Math.abs((line.endY || 0) - (line.startY || 0)) + 'px',
            }"
        >
            <!-- 间距标签 -->
            <div
                class="text-background pointer-events-none absolute rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap shadow-sm"
                style="left: 5px; top: 50%; transform: translateY(-50%)"
            >
                {{ getDisplayLabel(line) }}
            </div>
        </div>

        <!-- 画布边界距离线（橙色实线 + 距离标签）-->
        <div
            v-for="(line, index) in canvasDistanceLines"
            :key="`canvas-distance-${index}`"
            class="absolute bg-orange-500"
            :class="line.type === 'vertical' ? 'w-px' : 'h-px'"
            :style="{
                left: line.type === 'vertical' ? line.position + 'px' : (line.startX || 0) + 'px',
                top: line.type === 'horizontal' ? line.position + 'px' : (line.startY || 0) + 'px',
                width:
                    line.type === 'horizontal'
                        ? Math.abs((line.endX || 0) - (line.startX || 0)) + 'px'
                        : '1px',
                height:
                    line.type === 'vertical'
                        ? Math.abs((line.endY || 0) - (line.startY || 0)) + 'px'
                        : '1px',
            }"
        >
            <!-- 画布距离标签 -->
            <div
                class="text-background pointer-events-none absolute rounded bg-orange-500 px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap shadow-sm"
                :style="
                    line.type === 'horizontal'
                        ? 'left: 50%; top: -15px; transform: translateX(-50%)'
                        : 'left: 5px; top: 50%; transform: translateY(-50%)'
                "
            >
                {{ getDisplayLabel(line) }}
            </div>
        </div>
    </div>
</template>
