<script lang="ts" setup>
/**
 * 页面配置编辑器
 * @description 用于编辑页面的基础配置，包括背景设置、页面尺寸等
 */
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { useDesignStore } from "../../../stores/design";

const { t } = useI18n();
const designStore = useDesignStore();

// 背景类型选项
const backgroundTypeOptions = computed(() => [
    { label: t("console-widgets.pageConfig.solidBackground"), value: "solid" as const },
    { label: t("console-widgets.pageConfig.imageBackground"), value: "image" as const },
]);
</script>

<template>
    <div class="h-full w-full overflow-auto">
        <UAccordion
            :items="[
                {
                    label: t('console-widgets.pageConfig.containerStyle'),
                    value: 'background',
                    slot: 'background',
                },
                { label: t('console-widgets.pageConfig.pageSize'), value: 'size', slot: 'size' },
                {
                    label: t('console-widgets.pageConfig.helperSettings'),
                    value: 'helper',
                    slot: 'helper',
                },
            ]"
            :default-value="['background', 'size', 'helper']"
            :unmountOnHide="false"
            type="multiple"
        >
            <template #background>
                <div class="w-full space-y-3 px-1 pt-2 pb-4">
                    <!-- 背景类型选择 -->
                    <UFormField
                        size="xs"
                        :label="t('console-widgets.pageConfig.backgroundType')"
                        class="flex w-full justify-between"
                        :ui="{
                            wrapper: 'flex',
                            label: 'text-muted',
                            container: 'width160',
                        }"
                    >
                        <USelectMenu
                            v-model="designStore.configs.backgroundType"
                            :items="backgroundTypeOptions"
                            value-key="value"
                            label-key="label"
                            :ui="{ base: 'w-full' }"
                            size="md"
                        />
                    </UFormField>

                    <!-- 纯色背景配置 -->
                    <template v-if="designStore.configs.backgroundType === 'solid'">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pageConfig.backgroundColor')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <BdColorPicker
                                v-model="designStore.configs.backgroundColor"
                                size="md"
                                :placeholder="t('console-widgets.pageConfig.selectBackgroundColor')"
                                alpha
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pageConfig.darkModeBackground')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <BdColorPicker
                                v-model="designStore.configs.backgroundDarkColor"
                                size="md"
                                :placeholder="
                                    t('console-widgets.pageConfig.selectDarkModeBackground')
                                "
                                alpha
                            />
                        </UFormField>
                    </template>

                    <!-- 图片背景配置 -->
                    <template v-if="designStore.configs.backgroundType === 'image'">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pageConfig.backgroundImage')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160 flex justify-end',
                            }"
                        >
                            <BdUploader
                                v-model="designStore.configs.backgroundImage"
                                class="size-20"
                                icon="i-lucide-upload"
                                accept=".jpg,.png,.jpeg"
                                :text="t('console-widgets.pageConfig.backgroundImageText')"
                                :maxCount="1"
                                :single="true"
                            />
                        </UFormField>
                    </template>
                </div>
            </template>

            <template #size>
                <div class="w-full space-y-3 px-1 pt-2 pb-4">
                    <UFormField
                        size="xs"
                        :label="t('console-widgets.pageConfig.pageHeight')"
                        class="flex w-full justify-between"
                        :ui="{
                            wrapper: 'flex',
                            label: 'text-muted',
                            container: 'width160',
                        }"
                    >
                        <UInput
                            v-model="designStore.configs.pageHeight"
                            type="number"
                            :placeholder="t('console-widgets.pageConfig.enterPageHeight')"
                            size="md"
                            :min="500"
                            :max="100000"
                            :step="50"
                            :ui="{ root: 'w-full' }"
                        />
                    </UFormField>

                    <div class="text-muted-foreground text-xs dark:text-gray-400">
                        {{ t("console-widgets.pageConfig.heightRange") }}
                    </div>
                </div>
            </template>

            <template #helper>
                <div class="w-full space-y-3 px-1 pt-2 pb-4">
                    <UFormField
                        size="xs"
                        :label="t('console-widgets.pageConfig.showSafeArea')"
                        class="flex w-full justify-between"
                        :ui="{ wrapper: 'flex', label: 'text-muted' }"
                    >
                        <USwitch v-model="designStore.showSafeArea" size="md" />
                    </UFormField>

                    <div class="text-muted-foreground text-xs dark:text-gray-400">
                        {{ t("console-widgets.pageConfig.safeAreaTip") }}
                    </div>
                </div>
            </template>
        </UAccordion>
    </div>
</template>
