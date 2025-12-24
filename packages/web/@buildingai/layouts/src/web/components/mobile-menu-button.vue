<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        /** 是否显示 */
        modelValue: boolean;
        /** 按钮颜色 */
        color?: "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral";
        /** 按钮变体 */
        variant?: "solid" | "outline" | "soft" | "ghost" | "link";
        /** 是否显示用户头像 */
        showUserProfile?: boolean;
        /** 菜单是否已展开 */
        expanded?: boolean;
    }>(),
    {
        color: "neutral",
        variant: "ghost",
        showUserProfile: true,
        expanded: false,
    },
);

const emit = defineEmits<{
    /** 点击菜单按钮事件 */
    click: [];
    "update:modelValue": [value: boolean];
}>();

const isOpen = useVModel(props, "modelValue", emit);
</script>

<template>
    <!-- 移动端右侧操作区域 -->
    <div class="fixed top-3 right-3 flex flex-1 justify-end gap-2 sm:hidden" data-mobile-menu>
        <!-- 用户头像 -->
        <!-- <ConsoleUserProfile v-if="showUserProfile" size="sm" /> -->

        <!-- 移动端菜单按钮 -->
        <UButton
            :color="color"
            :variant="variant"
            icon="i-heroicons-bars-3"
            square
            :ui="{
                trailingIcon: 'md:size-5',
                base: 'transition-transform duration-200',
            }"
            size="md"
            padded
            :aria-expanded="expanded"
            aria-controls="mobile-menu"
            aria-label="打开菜单"
            @click="isOpen = !isOpen"
        />
    </div>
</template>
