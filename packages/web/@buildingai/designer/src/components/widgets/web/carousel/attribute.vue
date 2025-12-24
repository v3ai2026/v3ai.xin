<script lang="ts" setup>
/**
 * 轮播图组件属性编辑器
 * @description 用于编辑轮播图组件的属性，包括图片管理、播放设置、样式配置等
 */
import { useVModel } from "@vueuse/core";
import Draggable from "vuedraggable";

import WidgetsBaseProperty from "../../base/widgets-base-property.vue";
import type { CarouselItem, Props } from "./config";

const props = defineProps<{
    modelValue: Props;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: Props): void;
}>();

const model = useVModel(props, "modelValue", emit);

const { t } = useI18n();

// 轮播方向选项
const directionOptions = [
    { label: t("console-widgets.options.direction.horizontal"), value: "horizontal" },
    { label: t("console-widgets.options.direction.vertical"), value: "vertical" },
];

// 对齐方式选项
const alignOptions = [
    { label: t("console-widgets.options.textAlign.left"), value: "left" },
    { label: t("console-widgets.options.textAlign.center"), value: "center" },
    { label: t("console-widgets.options.textAlign.right"), value: "right" },
];

// 图片填充模式选项
const objectFitOptions = [
    { label: t("console-widgets.options.objectFit.cover"), value: "cover" },
    { label: t("console-widgets.options.objectFit.contain"), value: "contain" },
    { label: t("console-widgets.options.objectFit.fill"), value: "fill" },
];

// 标题位置选项
const positionOptions = [
    { label: t("console-widgets.options.position.bottom"), value: "bottom" },
    { label: t("console-widgets.options.position.start"), value: "start" },
    { label: t("console-widgets.options.position.end"), value: "end" },
];

/**
 * 添加新图片
 */
const addNewItem = () => {
    const newItem: CarouselItem = {
        src: "https://picsum.photos/800/400?random=" + Date.now(),
        alt: t("console-widgets.placeholders.newImageAlt"),
        title: t("console-widgets.placeholders.newImageTitle"),
    };
    model.value.items.push(newItem);
};

/**
 * 删除图片
 */
const removeItem = (index: number) => {
    if (model.value.items.length > 1) {
        model.value.items.splice(index, 1);
    }
};

/**
 * 上移图片
 */
const moveItemUp = (index: number) => {
    if (index > 0) {
        const item = model.value.items.splice(index, 1)[0];
        if (item) {
            model.value.items.splice(index - 1, 0, item);
        }
    }
};

/**
 * 下移图片
 */
const moveItemDown = (index: number) => {
    if (index < model.value.items.length - 1) {
        const item = model.value.items.splice(index, 1)[0];
        if (item) {
            model.value.items.splice(index + 1, 0, item);
        }
    }
};

const addNewImage = () => {
    if (!model.value) return;

    model.value.items.push({
        src: "",
        alt: t("console-widgets.placeholders.newImage"),
        title: t("console-widgets.placeholders.newImageTitle"),
        to: {
            type: "custom",
            name: t("console-widgets.placeholders.customLink"),
            path: "#",
            query: {},
        },
    });
};
</script>

<template>
    <WidgetsBaseProperty>
        <template #content>
            <UAccordion
                :items="[
                    {
                        label: t('console-widgets.carousel.imageManagement'),
                        value: 'images',
                        slot: 'images',
                    },
                    {
                        label: t('console-widgets.carousel.playbackSettings'),
                        value: 'playback',
                        slot: 'playback',
                    },
                    {
                        label: t('console-widgets.sections.display'),
                        value: 'display',
                        slot: 'display',
                    },
                ]"
                :default-value="['images', 'playback', 'display']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #images>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 图片列表 -->
                        <div class="space-y-3">
                            <Draggable
                                class="draggable"
                                v-model="model.items"
                                animation="300"
                                handle=".drag-move"
                                itemKey="id"
                            >
                                <template v-slot:item="{ element: item, index }">
                                    <div class="bg-muted mb-3 space-y-3 rounded-lg p-3">
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center gap-2">
                                                <UButton
                                                    color="neutral"
                                                    variant="soft"
                                                    size="xs"
                                                    icon="i-lucide-hand"
                                                    class="drag-move"
                                                />
                                                <span
                                                    class="text-muted-foreground text-sm font-medium"
                                                >
                                                    {{ t("console-widgets.carousel.imageItem") }}
                                                    {{ index + 1 }}
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
                                                    :disabled="index === model.items.length - 1"
                                                    @click="moveItemDown(index)"
                                                />
                                                <UButton
                                                    variant="ghost"
                                                    size="xs"
                                                    icon="i-heroicons-trash"
                                                    color="error"
                                                    :disabled="model.items.length <= 1"
                                                    @click="removeItem(index)"
                                                />
                                            </div>
                                        </div>

                                        <!-- 图片上传 -->
                                        <UFormField
                                            size="xs"
                                            :label="t('console-widgets.labels.image')"
                                            class="flex w-full justify-between"
                                            :ui="{
                                                wrapper: 'flex',
                                                label: 'text-muted',
                                                container: 'width160 flex justify-end',
                                            }"
                                        >
                                            <BdUploader
                                                v-model="item.src"
                                                class="width160 h-20"
                                                icon="i-lucide-upload"
                                                accept=".jpg,.png,.jpeg,.webp"
                                                text=" "
                                                :maxCount="1"
                                                :single="true"
                                            />
                                        </UFormField>

                                        <!-- 链接设置 -->
                                        <UFormField
                                            size="xs"
                                            :label="t('console-widgets.options.variants.link')"
                                            class="flex w-full justify-between"
                                            :ui="{
                                                wrapper: 'flex',
                                                label: 'text-muted',
                                                container: 'width160',
                                            }"
                                        >
                                            <LinkPicker v-model="item.to" size="md" />
                                        </UFormField>
                                    </div>
                                </template>
                            </Draggable>
                        </div>

                        <!-- 添加图片按钮 -->
                        <UButton
                            variant="outline"
                            size="md"
                            icon="i-heroicons-plus"
                            block
                            @click="addNewImage"
                        >
                            {{ t("console-widgets.carousel.addImage") }}
                        </UButton>
                    </div>
                </template>

                <template #playback>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.carouselDirection')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelectMenu
                                v-model="model.orientation"
                                :items="directionOptions"
                                value-key="value"
                                label-key="label"
                                size="md"
                                :ui="{ base: 'w-full' }"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.show')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.arrows" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.showDots')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.dots" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.video.loop')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.loop" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.freeDrag')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.dragFree" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.video.autoplay')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.autoplay" size="md" />
                        </UFormField>

                        <UFormField
                            v-if="model.autoplay"
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                            :label="t('console-widgets.labels.duration')"
                        >
                            <BdSlider
                                v-model="model.autoplayDelay"
                                :min="1000"
                                :max="10000"
                                :step="500"
                                size="md"
                            />
                        </UFormField>
                        <div v-if="model.autoplay" class="text-accent-foreground text-xs">
                            <span class="text-muted-foreground font-mono text-xs">
                                {{ t("console-widgets.labels.autoplayDelay") }}:
                                {{ model.autoplayDelay }}ms
                            </span>
                        </div>

                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160 ',
                            }"
                            :label="t('console-widgets.carousel.scrollNumber')"
                        >
                            <BdSlider v-model="model.slidesToScroll" :min="1" :max="5" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.textAlign')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelectMenu
                                v-model="model.align"
                                :items="alignOptions"
                                value-key="value"
                                label-key="label"
                                size="md"
                                :ui="{ base: 'w-full' }"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #display>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                            :label="t('console-widgets.common.height')"
                        >
                            <BdSlider
                                v-model="model.carouselHeight"
                                :min="200"
                                :max="800"
                                :step="10"
                                size="md"
                            />
                        </UFormField>
                        <div class="text-accent-foreground text-xs">
                            <span class="text-muted-foreground font-mono text-xs">
                                {{ t("console-widgets.labels.carouselHeight") }}:
                                {{ model.carouselHeight }}px
                            </span>
                        </div>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.carousel.fillMode')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelectMenu
                                v-model="model.objectFit"
                                :items="objectFitOptions"
                                value-key="value"
                                label-key="label"
                                size="md"
                                :ui="{ base: 'w-full' }"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                            :label="t('console-widgets.common.radius')"
                        >
                            <BdSlider v-model="model.imageRadius" :min="0" :max="30" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pricingPlans.showTitle')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showTitle" size="md" />
                        </UFormField>

                        <UFormField
                            v-if="model.showTitle"
                            size="xs"
                            label="标题位置"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelectMenu
                                v-model="model.titlePosition"
                                :items="positionOptions"
                                value-key="value"
                                label-key="label"
                                size="md"
                                :ui="{ base: 'w-full' }"
                            />
                        </UFormField>
                    </div>
                </template>
            </UAccordion>
        </template>

        <template #style>
            <UAccordion
                :items="[
                    {
                        label: t('console-widgets.sections.background'),
                        value: 'styling',
                        slot: 'styling',
                    },
                    {
                        label: t('console-widgets.sections.padding'),
                        value: 'padding',
                        slot: 'padding',
                    },
                    {
                        label: t('console-widgets.sections.radius'),
                        value: 'radius',
                        slot: 'radius',
                    },
                ]"
                :default-value="['styling', 'padding', 'radius']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #styling>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.rootBgColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.style.rootBgColor"
                                size="md"
                                :placeholder="t('console-widgets.common.bgColor')"
                                alpha
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            label="容器背景"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.style.bgColor"
                                size="md"
                                :placeholder="t('console-widgets.common.bgColor')"
                                alpha
                            />
                        </UFormField>
                    </div>
                </template>
                <template #padding>
                    <div class="space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                            :label="t('console-widgets.common.paddingTop')"
                        >
                            <BdSlider
                                v-model="model.style.paddingTop"
                                :min="0"
                                :max="50"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                            :label="t('console-widgets.common.paddingRight')"
                        >
                            <BdSlider
                                v-model="model.style.paddingRight"
                                :min="0"
                                :max="50"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                            :label="t('console-widgets.common.paddingBottom')"
                        >
                            <BdSlider
                                v-model="model.style.paddingBottom"
                                :min="0"
                                :max="50"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                            :label="t('console-widgets.common.paddingLeft')"
                        >
                            <BdSlider
                                v-model="model.style.paddingLeft"
                                :min="0"
                                :max="50"
                                size="md"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #radius>
                    <div class="space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                            :label="t('console-widgets.common.radius')"
                        >
                            <BdSlider
                                v-model="model.style.borderRadiusTop"
                                :min="0"
                                :max="50"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                            :label="t('console-widgets.common.radius')"
                        >
                            <BdSlider
                                v-model="model.style.borderRadiusBottom"
                                :min="0"
                                :max="50"
                                size="md"
                            />
                        </UFormField>
                    </div>
                </template>
            </UAccordion>
        </template>
    </WidgetsBaseProperty>
</template>
