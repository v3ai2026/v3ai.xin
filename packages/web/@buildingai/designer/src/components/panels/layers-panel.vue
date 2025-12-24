<script lang="ts" setup>
import { computed, ref } from "vue";
import Draggable from "vuedraggable";

import { useDesignStore } from "../../stores/design";
const design = useDesignStore();

// 是否处于重命名状态
const renamingId = ref<string | null>(null);
const newName = ref("");

/**
 * 按z-index排序的组件列表（从上到下）
 */
const sortedComponents = computed(() => {
    return [...design.components].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
});

/**
 * 拖拽排序的组件列表
 * 用于双向绑定 Draggable 组件
 */
const draggableComponents = computed({
    get: () => sortedComponents.value,
    set: (newOrder) => {
        // 根据新的顺序更新 z-index
        newOrder.forEach((component, index) => {
            const targetComponent = design.components.find((c) => c.id === component.id);
            if (targetComponent) {
                // 从高到低分配 z-index，确保视觉顺序正确
                targetComponent.zIndex = newOrder.length - index - 1;
            }
        });
    },
});

/**
 * 开始重命名
 */
function startRename(component: ComponentConfig) {
    renamingId.value = component.id;
    newName.value = component.title;
}

/**
 * 确认重命名
 */
function confirmRename(componentId: string) {
    if (newName.value.trim()) {
        const targetComponent = design.components.find((c) => c.id === componentId);
        if (targetComponent) {
            targetComponent.title = newName.value.trim();
        }
    }
    cancelRename();
}

/**
 * 取消重命名
 */
function cancelRename() {
    renamingId.value = null;
    newName.value = "";
}

/**
 * 切换组件可见性
 */
function toggleVisibility(component: ComponentConfig) {
    design.updateVisible(component.id, !component.isHidden);
}

/**
 * 选中组件
 */
function selectComponent(component: ComponentConfig) {
    design.setActiveComponent(component.id);
}

/**
 * 删除组件
 */
function deleteComponent(component: ComponentConfig) {
    design.removeComponent(component.id);
}

/**
 * 向上移动图层
 */
function moveLayerUp(component: ComponentConfig) {
    const currentZ = component.zIndex || 0;
    const targetComponent = design.components.find((c) => c.id === component.id);
    if (targetComponent) {
        targetComponent.zIndex = currentZ + 1;
    }
}

/**
 * 向下移动图层
 */
function moveLayerDown(component: ComponentConfig) {
    const currentZ = component.zIndex || 0;
    const targetComponent = design.components.find((c) => c.id === component.id);
    if (targetComponent && currentZ > 0) {
        targetComponent.zIndex = currentZ - 1;
    }
}

/**
 * 移到顶层
 */
function moveToTop(component: ComponentConfig) {
    const maxZ = Math.max(...design.components.map((c) => c.zIndex || 0));
    const targetComponent = design.components.find((c) => c.id === component.id);
    if (targetComponent) {
        targetComponent.zIndex = maxZ + 1;
    }
}

/**
 * 移到底层
 */
function moveToBottom(component: ComponentConfig) {
    const targetComponent = design.components.find((c) => c.id === component.id);
    if (targetComponent) {
        targetComponent.zIndex = 0;
    }
}

/**
 * 复制组件
 */
function duplicateComponent(component: ComponentConfig) {
    design.addComponent({
        type: component.type,
        title: `${component.title} 副本`,
        position: {
            x: component.position.x + 20,
            y: component.position.y + 20,
        },
        size: { ...component.size },
        isHidden: component.isHidden || false,
        props: JSON.parse(JSON.stringify(component.props)),
    });
}
</script>

<template>
    <div class="bg-background h-full">
        <!-- 图层列表 -->
        <div class="h-full flex-1 overflow-y-auto pt-3">
            <Draggable
                v-model="draggableComponents"
                animation="200"
                handle=".drag-handle"
                itemKey="id"
                class="space-y-1"
                ghostClass="layer-ghost"
                chosenClass="layer-chosen"
            >
                <template #item="{ element: component, index }">
                    <div class="group relative mb-4">
                        <div
                            class="hover:bg-secondary bg-muted flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200"
                            :class="[
                                component.id === design.activeComponent?.id
                                    ? 'dark:bg-primary-500 bg-primary-50 text-background'
                                    : '',
                                component.isHidden === true ? 'opacity-60' : '',
                            ]"
                            @click="selectComponent(component)"
                        >
                            <!-- 左侧控制区 -->
                            <div class="flex items-center">
                                <!-- 拖拽手柄 -->
                                <UButton
                                    icon="i-lucide-grip-vertical"
                                    color="neutral"
                                    variant="ghost"
                                    size="md"
                                    class="drag-handle cursor-grab"
                                />

                                <!-- 可见性切换 -->
                                <UButton
                                    :icon="
                                        component.isHidden
                                            ? 'i-heroicons-eye-slash'
                                            : 'i-heroicons-eye'
                                    "
                                    color="neutral"
                                    variant="ghost"
                                    size="md"
                                    class="rag-handle"
                                    @click.stop="toggleVisibility(component)"
                                />
                            </div>

                            <!-- 组件信息区域 -->
                            <div class="flex min-w-0 flex-1 items-center gap-3">
                                <div class="min-w-0 flex-1">
                                    <!-- 组件名称 -->
                                    <div @dblclick="startRename(component)">
                                        <input
                                            v-if="renamingId === component.id"
                                            v-model="newName"
                                            class="border-primary-300 focus:ring-primary-500 bg-background w-full rounded border px-2 py-1 text-sm font-medium focus:border-transparent focus:ring-2 focus:outline-none"
                                            @blur="confirmRename(component.id)"
                                            @keydown.enter="confirmRename(component.id)"
                                            @keydown.esc="cancelRename"
                                            @click.stop
                                        />
                                        <div v-else class="flex items-center gap-2">
                                            <span
                                                class="text-secondary-foreground truncate text-sm font-medium"
                                            >
                                                {{ $t(component.title) }}
                                            </span>
                                            <UBadge
                                                :label="`Z${component.zIndex || 0}`"
                                                color="neutral"
                                                variant="soft"
                                                size="xs"
                                            />
                                        </div>
                                    </div>

                                    <!-- 组件信息 -->
                                    <div
                                        class="text-accent-foreground mt-1 flex items-center gap-2 text-xs"
                                    >
                                        {{ component.type }}
                                    </div>
                                </div>
                            </div>

                            <!-- 右侧操作按钮 -->
                            <div
                                class="flex items-center opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                <UDropdownMenu
                                    :items="[
                                        [
                                            {
                                                label: '向上移动',
                                                icon: 'i-heroicons-arrow-up',
                                                onSelect: () => moveLayerUp(component),
                                            },
                                            {
                                                label: '向下移动',
                                                icon: 'i-heroicons-arrow-down',
                                                onSelect: () => moveLayerDown(component),
                                            },
                                        ],
                                        [
                                            {
                                                label: '移到顶层',
                                                icon: 'i-heroicons-arrow-up-on-square',
                                                onSelect: () => moveToTop(component),
                                            },
                                            {
                                                label: '移到底层',
                                                icon: 'i-heroicons-arrow-down-on-square',
                                                onSelect: () => moveToBottom(component),
                                            },
                                        ],
                                        [
                                            {
                                                label: '复制图层',
                                                icon: 'i-heroicons-document-duplicate',
                                                onSelect: () => duplicateComponent(component),
                                            },
                                            {
                                                label: '删除图层',
                                                icon: 'i-heroicons-trash',
                                                onSelect: () => deleteComponent(component),
                                            },
                                        ],
                                    ]"
                                    :popper="{ placement: 'bottom-end' }"
                                >
                                    <UButton
                                        variant="ghost"
                                        size="sm"
                                        icon="i-lucide-ellipsis-vertical"
                                        color="neutral"
                                        @click.stop
                                    />
                                </UDropdownMenu>
                            </div>
                        </div>
                    </div>
                </template>
            </Draggable>
        </div>
    </div>
</template>
