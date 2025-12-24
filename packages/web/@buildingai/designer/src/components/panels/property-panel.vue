<script lang="ts" setup>
/**
 * 动态属性编辑器容器
 * @description 自动注册 widgets 目录下的属性组件
 */
import { computed, defineAsyncComponent, ref } from "vue";
import { useRouter } from "vue-router";

import { useDesignStore } from "../../stores/design";
import WidgetsBasePage from "../widgets/base/widgets-base-page.vue";
import LayersPanel from "./layers-panel.vue";

const router = useRouter();
const gridStore = useDesignStore();
const isExpanded = ref(true);

// 按需解析属性编辑器组件，避免全量注册
const attributeModules = import.meta.glob("../../components/widgets/**/attribute.vue", {
    eager: false,
});
function resolveAttributeComponent(type: string) {
    const entry = Object.entries(attributeModules).find(([path]) =>
        path.includes(`/${type}/attribute.vue`),
    );
    if (!entry) return null;
    const loader = entry[1] as any;
    return defineAsyncComponent(loader);
}

// 当前激活的组件
const currentComponent = computed(() => gridStore.activeComponent);
const currentEditor = computed(() =>
    currentComponent.value?.type ? resolveAttributeComponent(currentComponent.value.type) : null,
);

// 组件属性的计算属性
const componentProperties = computed({
    get: () => currentComponent.value?.props ?? {},
    set: (value) => {
        const id = currentComponent.value?.id;
        if (id) gridStore.updateProperties(id, value);
    },
});
</script>

<template>
    <div
        class="bg-background border-muted flex h-auto flex-col rounded-md border"
        :class="{
            'absolute top-2 right-4 z-10 cursor-pointer border-none !p-0': !isExpanded,
        }"
    >
        <h3
            class="flex items-center justify-between p-2 pl-3 text-xl font-medium"
            :class="{ '!py-0 pr-2 !pl-1': !isExpanded }"
        >
            <div class="flex gap-x-4 text-base" :class="{ 'p-2 text-sm': !isExpanded }">
                <span>{{
                    currentComponent
                        ? $t(`${currentComponent.title}`)
                        : gridStore.isCanvasSelected
                          ? $t("console-widgets.pageConfig.pageSettings")
                          : $t("console-common.userInterface")
                }}</span>
            </div>

            <div class="flex items-center">
                <UButton
                    icon="i-heroicons-play-circle-20-solid"
                    size="xs"
                    variant="soft"
                    @click="router.push('/console/decorate/micropage/preview')"
                >
                    {{ $t("console-common.preview") }}
                </UButton>
                <USeparator orientation="vertical" class="mr-1 ml-2 h-4" />
                <UButton
                    size="md"
                    color="neutral"
                    variant="ghost"
                    @click="isExpanded = !isExpanded"
                >
                    <template #trailing>
                        <svg
                            class="icon-icon icon-icon-coz_side_expand"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            color="var(--foreground, #060709CC)"
                            :class="{
                                'rotate-180': isExpanded,
                            }"
                        >
                            <path
                                d="M10 4C9.44771 4 9 4.44772 9 5 9 5.55228 9.44771 6 10 6H22C22.5523 6 23 5.55228 23 5 23 4.44772 22.5523 4 22 4H10zM22 11H10C9.44771 11 9 11.4477 9 12 9 12.5523 9.44771 13 10 13H22C22.5523 13 23 12.5523 23 12 23 11.4477 22.5523 11 22 11zM9 19C9 18.4477 9.44771 18 10 18H22C22.5523 18 23 18.4477 23 19 23 19.5523 22.5523 20 22 20H10C9.44771 20 9 19.5523 9 19zM6.70711 8.70711C7.09763 8.31658 7.09763 7.68342 6.70711 7.29289 6.31658 6.90237 5.68342 6.90237 5.29289 7.29289L1.29289 11.2929C.902369 11.6834.902369 12.3166 1.29289 12.7071L5.29289 16.7071C5.68342 17.0976 6.31658 17.0976 6.70711 16.7071 7.09763 16.3166 7.09763 15.6834 6.70711 15.2929L3.41421 12 6.70711 8.70711z"
                            ></path>
                        </svg>
                    </template>
                </UButton>
            </div>
        </h3>

        <div v-show="isExpanded" class="flex h-full w-[280px] flex-1 flex-col">
            <!-- 组件属性编辑器 -->
            <component :is="currentEditor" v-if="currentEditor" v-model="componentProperties" />
            <!-- 画布选中时显示页面配置 -->
            <WidgetsBasePage v-else-if="gridStore.isCanvasSelected" />
            <!-- 默认显示图层面板 -->
            <div v-else class="h-full px-3" style="height: calc(100vh - 120px)">
                <LayersPanel />
            </div>
        </div>
    </div>
</template>
