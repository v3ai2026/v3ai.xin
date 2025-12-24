<script setup lang="ts">
import { layoutStyles } from "../data/layouts";
import { useLayoutStore } from "../stores/layout";
import type { MenuItem } from "../types";

const layoutStore = useLayoutStore();
const { t } = useI18n();

const selectedLayoutId = ref(layoutStore.currentLayoutId);

const menuItems = ref<MenuItem[]>([...layoutStore.currentMenus] as MenuItem[]);

const layoutOptions = computed(() =>
    layoutStyles.map(({ name, id }) => ({
        label: name,
        value: id,
    })),
);

watchEffect(() => {
    selectedLayoutId.value = layoutStore.currentLayoutId;
    menuItems.value = [...layoutStore.currentMenus] as MenuItem[];
});

function handleLayoutChange(layoutId: string): void {
    layoutStore.setCurrentLayout(layoutId);
}

function addNewMenuItem(): void {
    const newItem: MenuItem = {
        id: `menu_${Date.now()}`,
        title: t("decorate.layout.property.newMenuTitle"),
        link: {
            type: "system",
            name: "首页",
            path: "/",
            query: {},
        },
        icon: "i-heroicons-home",
    };

    layoutStore.updateMenus([...menuItems.value, newItem]);
}

function removeMenuItem(index: number): void {
    const newMenus = menuItems.value.toSpliced(index, 1);
    layoutStore.updateMenus(newMenus);
}

/**
 * 上移菜单项
 * @param index 菜单项索引
 */
function moveItemUp(index: number): void {
    if (index <= 0) return;

    const newMenus = [...menuItems.value];
    const prevItem = newMenus[index - 1];
    const currentItem = newMenus[index];

    if (prevItem && currentItem) {
        newMenus[index - 1] = currentItem;
        newMenus[index] = prevItem;
        layoutStore.updateMenus(newMenus);
    }
}

function moveItemDown(index: number): void {
    if (index >= menuItems.value.length - 1) return;

    const newMenus = [...menuItems.value];
    const currentItem = newMenus[index];
    const nextItem = newMenus[index + 1];

    if (currentItem && nextItem) {
        newMenus[index] = nextItem;
        newMenus[index + 1] = currentItem;
        layoutStore.updateMenus(newMenus);
    }
}
</script>

<template>
    <div class="bg-background flex h-full min-h-0 w-60 shrink-0 flex-col space-y-6">
        <!-- 布局风格选择 -->
        <div class="space-y-3 pr-6">
            <UFormField :label="t('decorate.layout.property.layoutStyle')">
                <USelect
                    v-model="selectedLayoutId"
                    :items="layoutOptions"
                    label-key="label"
                    value-key="value"
                    :placeholder="t('decorate.layout.property.layoutStylePlaceholder')"
                    :ui="{ base: 'w-full' }"
                    @update:model-value="handleLayoutChange"
                />
            </UFormField>
        </div>

        <!-- 菜单项管理 -->
        <div class="flex min-h-0 flex-1 flex-col space-y-3">
            <UFormField
                :label="t('decorate.layout.property.navigationMenu')"
                class="flex items-center justify-between pr-6"
            >
                <UButton
                    icon="i-heroicons-plus"
                    size="xs"
                    variant="outline"
                    @click="addNewMenuItem"
                >
                    {{ t("console-common.add") }}
                </UButton>
            </UFormField>

            <!-- 菜单项列表 -->
            <BdScrollArea class="table h-full pr-6" type="hover" :scroll-hide-delay="0">
                <div
                    v-for="(item, index) in menuItems"
                    :key="item.id"
                    class="bg-muted mb-3 space-y-3 rounded-lg p-4"
                >
                    <!-- 操作栏 -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-accent-foreground text-sm font-medium">
                                {{
                                    t("decorate.layout.property.menuNumber", {
                                        number: index + 1,
                                    })
                                }}
                            </span>
                        </div>
                        <div class="flex items-center gap-1">
                            <UButton
                                variant="ghost"
                                size="xs"
                                icon="i-heroicons-arrow-up"
                                :disabled="index === 0"
                                @click="moveItemUp(index)"
                            />
                            <UButton
                                variant="ghost"
                                size="xs"
                                icon="i-heroicons-arrow-down"
                                :disabled="index === menuItems.length - 1"
                                @click="moveItemDown(index)"
                            />
                            <UButton
                                variant="ghost"
                                size="xs"
                                icon="i-heroicons-trash"
                                color="error"
                                :disabled="menuItems.length <= 1"
                                @click="removeMenuItem(index)"
                            />
                        </div>
                    </div>

                    <!-- 标题编辑 -->
                    <UFormField
                        :label="t('decorate.layout.property.menuTitle')"
                        size="xs"
                        class="flex w-full justify-between"
                        :ui="{ wrapper: 'flex', container: 'w-[120px]' }"
                    >
                        <UInput
                            v-model="item.title"
                            :placeholder="t('decorate.layout.property.menuTitlePlaceholder')"
                            size="md"
                        />
                    </UFormField>

                    <!-- 链接编辑 -->
                    <UFormField
                        :label="t('decorate.layout.property.menuLink')"
                        size="xs"
                        class="flex w-full justify-between"
                        :ui="{ wrapper: 'flex', container: 'w-[120px]' }"
                    >
                        <LinkPicker v-model="item.link" />
                    </UFormField>

                    <!-- 图标选择 -->
                    <UFormField
                        :label="t('decorate.layout.property.menuIcon')"
                        size="xs"
                        class="flex w-full justify-between"
                        :ui="{ wrapper: 'flex', container: 'w-[120px]' }"
                    >
                        <IconPicker v-model="item.icon" />
                    </UFormField>
                </div>
            </BdScrollArea>
        </div>
    </div>
</template>
