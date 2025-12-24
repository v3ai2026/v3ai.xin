<script lang="ts" setup>
import { useDesignStore } from "../../stores/design";
import {
    getCategories,
    getCategoryComponents,
    importComponentConfigs,
} from "../../utils/components-dynamic";

withDefaults(
    defineProps<{
        /** 场景类型，用于加载特定组件 */
        scene?: string;
    }>(),
    {
        scene: "",
    },
);

const { t } = useI18n();
// 初始化组件配置
importComponentConfigs("web");

// 菜单展开状态
const isExpanded = ref<boolean>(true);
// 组件分类列表
const categories = ref(getCategories);
// 页面设计装修管理
const designStore = useDesignStore();

/**
 * 切换菜单展开
 */
function toggleExpand() {
    isExpanded.value = !isExpanded.value;
}

/**
 * 处理拖拽开始
 * @param event 拖拽事件
 * @param item 被拖拽的组件
 */
function handleDragStart(event: DragEvent, item: ComponentMenuItem) {
    // 设置拖拽数据
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.setData("text/plain", item.type);
    }
    // 通知 store 开始拖拽
    designStore.setDraggedComponent(item);
}

/**
 * 处理拖拽结束
 */
function handleDragEnd() {
    // 通知 store 结束拖拽
    designStore.setDraggedComponent(null);
}

// 转换数据格式为 UAccordion 需要的格式
const accordionItems = computed(() =>
    categories.value.map((category) => {
        return {
            label: t(category.title),
            value: category.id,
        };
    }),
);
</script>

<template>
    <div
        class="bg-background border-muted flex h-auto flex-col rounded-md border p-2"
        :class="{
            'absolute top-2 left-4 z-10 cursor-pointer border-none !p-0': !isExpanded,
        }"
    >
        <h3 class="flex items-center justify-between text-xl font-medium">
            <div class="text-primary text-base" v-if="isExpanded">
                {{ $t("console-common.component") }}
            </div>
            <UButton size="md" color="neutral" variant="ghost" @click="toggleExpand">
                <template #trailing>
                    <svg
                        class="icon-icon icon-icon-coz_side_expand"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        color="var(--coz-fg-primary, #060709CC)"
                        :class="{
                            'rotate-180': !isExpanded,
                        }"
                    >
                        <path
                            d="M10 4C9.44771 4 9 4.44772 9 5 9 5.55228 9.44771 6 10 6H22C22.5523 6 23 5.55228 23 5 23 4.44772 22.5523 4 22 4H10zM22 11H10C9.44771 11 9 11.4477 9 12 9 12.5523 9.44771 13 10 13H22C22.5523 13 23 12.5523 23 12 23 11.4477 22.5523 11 22 11zM9 19C9 18.4477 9.44771 18 10 18H22C22.5523 18 23 18.4477 23 19 23 19.5523 22.5523 20 22 20H10C9.44771 20 9 19.5523 9 19zM6.70711 8.70711C7.09763 8.31658 7.09763 7.68342 6.70711 7.29289 6.31658 6.90237 5.68342 6.90237 5.29289 7.29289L1.29289 11.2929C.902369 11.6834.902369 12.3166 1.29289 12.7071L5.29289 16.7071C5.68342 17.0976 6.31658 17.0976 6.70711 16.7071 7.09763 16.3166 7.09763 15.6834 6.70711 15.2929L3.41421 12 6.70711 8.70711z"
                        ></path>
                    </svg>
                </template>
            </UButton>
        </h3>

        <BdScrollArea
            v-show="isExpanded"
            style="height: calc(100vh - 140px)"
            class="inline-table w-[190px] flex-1"
        >
            <UAccordion
                :items="accordionItems"
                :default-value="['basic', 'extension', 'advanced']"
                variant="ghost"
                class="border-0"
                type="multiple"
                :ui="{
                    trailingIcon: 'mr-1',
                    item: 'border-0',
                    header: 'flex px-1',
                    content: 'px-1',
                }"
            >
                <template #body="{ item }">
                    <div class="grid grid-cols-3 gap-2">
                        <div
                            v-for="component in getCategoryComponents(item.value)"
                            :key="component.type"
                            class="flex cursor-grab flex-col items-center gap-2 transition-all duration-200 hover:-translate-y-0.5"
                            draggable="true"
                            @dragstart="handleDragStart($event, component)"
                            @dragend="handleDragEnd"
                        >
                            <div
                                class="bg-muted flex h-12 w-12 items-center justify-center overflow-hidden rounded-md"
                            >
                                <NuxtImg
                                    :src="component.icon"
                                    :alt="$t(component.title)"
                                    class="h-full w-full object-contain"
                                />
                            </div>
                            <span class="text-accent-foreground text-center text-xs leading-tight">
                                {{ $t(component.title) }}
                            </span>
                        </div>
                    </div>
                </template>
            </UAccordion>
        </BdScrollArea>
    </div>
</template>
