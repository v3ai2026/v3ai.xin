<script lang="ts" setup>
/**
 * 页面区块组件内容展示
 * @description 响应式页面区块组件，支持标题、描述、功能列表、链接等内容展示
 */
import { navigateToWeb } from "@/utils/helper";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = defineProps<Props>();
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="page-section-content"
    >
        <template #default="{ style }">
            <div
                class="relative isolate"
                :style="{
                    backgroundColor: props.style.rootBgColor,
                    paddingTop: `${props.style.paddingTop}px`,
                    paddingRight: `${props.style.paddingRight}px`,
                    paddingBottom: `${props.style.paddingBottom}px`,
                    paddingLeft: `${props.style.paddingLeft}px`,
                    borderTopLeftRadius: `${props.style.borderRadiusTop}px`,
                    borderTopRightRadius: `${props.style.borderRadiusTop}px`,
                    borderBottomLeftRadius: `${props.style.borderRadiusBottom}px`,
                    borderBottomRightRadius: `${props.style.borderRadiusBottom}px`,
                }"
            >
                <UContainer class="max-w-7xl">
                    <div
                        class="flex flex-col"
                        :style="{ gap: `${props.sectionGap}px` }"
                        :class="{
                            'lg:grid lg:grid-cols-2 lg:items-center':
                                props.orientation === 'horizontal',
                            '': props.orientation === 'vertical',
                        }"
                    >
                        <!-- 内容区域 -->
                        <div
                            class="space-y-6"
                            :class="{
                                'lg:order-last': props.reverse,
                                'text-center': props.orientation === 'vertical',
                            }"
                        >
                            <!-- 副标题 -->
                            <div
                                v-if="props.showHeadline && props.headline"
                                class="text-primary mb-3 flex items-center gap-1.5 font-semibold"
                                :class="{
                                    'justify-center': props.orientation === 'vertical',
                                }"
                            >
                                {{ props.headline }}
                            </div>

                            <!-- 图标和标题区域 -->
                            <div
                                v-if="props.showTitle || props.showIcon"
                                class="mb-6 flex items-center"
                                :class="{
                                    'justify-center': props.orientation === 'vertical',
                                }"
                            >
                                <UIcon
                                    v-if="props.showIcon && props.icon"
                                    :name="props.icon"
                                    class="text-primary mr-4 size-10 shrink-0"
                                />
                                <h2
                                    v-if="props.showTitle && props.title"
                                    class="text-highlighted text-3xl font-bold tracking-tight text-pretty sm:text-4xl lg:text-5xl"
                                >
                                    {{ props.title }}
                                </h2>
                            </div>

                            <!-- 描述 -->
                            <p
                                v-if="props.showDescription && props.description"
                                class="text-muted mt-6 text-base sm:text-lg"
                                :class="{
                                    'text-pretty': props.orientation === 'horizontal',
                                    'text-center text-balance': props.orientation === 'vertical',
                                }"
                            >
                                {{ props.description }}
                            </p>

                            <!-- 链接按钮 -->
                            <div
                                v-if="props.showLinks && props.links.length > 0"
                                class="mt-8 flex flex-wrap gap-x-6 gap-y-3"
                                :class="{
                                    'justify-center': props.orientation === 'vertical',
                                    'mt-16':
                                        props.orientation === 'vertical' &&
                                        (props.showFeatures ||
                                            props.showTitle ||
                                            props.showDescription),
                                }"
                            >
                                <UButton
                                    v-for="link in props.links"
                                    :key="link.id"
                                    :color="link.color"
                                    :variant="link.variant"
                                    size="lg"
                                    class="transition-all hover:scale-105"
                                    @click="navigateToWeb(link.to)"
                                >
                                    <UIcon
                                        v-if="link.icon"
                                        :name="link.icon"
                                        class="mr-2 h-4 w-4"
                                    />
                                    {{ link.label }}
                                    <UIcon
                                        v-if="link.trailingIcon"
                                        :name="link.trailingIcon"
                                        class="ml-2 h-4 w-4"
                                    />
                                </UButton>
                            </div>
                        </div>

                        <!-- 图片区域 -->
                        <div
                            v-if="props.showImage && props.imageUrl"
                            class="flex justify-center"
                            :class="{
                                'lg:order-first':
                                    props.reverse && props.orientation === 'horizontal',
                            }"
                        >
                            <NuxtImg
                                :src="props.imageUrl"
                                :alt="props.imageAlt || props.title"
                                class="rounded-lg object-cover transition-transform hover:scale-105"
                                :style="{
                                    width: `${props.imageWidth}px`,
                                    height: props.imageHeight ? `${props.imageHeight}px` : 'auto',
                                    maxWidth: '100%',
                                }"
                            />
                        </div>

                        <!-- 功能列表区域 -->
                        <div
                            v-if="props.showFeatures && props.features.length > 0"
                            class="grid"
                            :style="{ gap: `${props.featuresGap}px` }"
                            :class="{
                                'sm:grid-cols-2 lg:grid-cols-3': props.orientation === 'vertical',
                                'mt-16':
                                    props.orientation === 'vertical' &&
                                    (props.showTitle || props.showDescription),
                            }"
                        >
                            <div
                                v-for="feature in props.features"
                                :key="feature.id"
                                class="group relative overflow-hidden rounded-lg bg-white p-6 transition-all"
                                :class="{
                                    'cursor-pointer': feature.to,
                                    'border-muted hover:border-muted border':
                                        props.showFeatureBorder,
                                    'hover:shadow-md': props.showFeatureBorder,
                                    [`shadow-${props.featureShadow}`]:
                                        !props.showFeatureBorder && props.featureShadow !== 'none',
                                    [`hover:shadow-${props.featureShadowHover}`]:
                                        !props.showFeatureBorder &&
                                        props.featureShadowHover !== 'none',
                                }"
                                @click="feature.to?.path && navigateToWeb(feature.to)"
                            >
                                <div class="flex items-start space-x-4">
                                    <div class="flex-none">
                                        <UIcon
                                            :name="feature.icon"
                                            class="text-primary h-8 w-8 transition-transform group-hover:scale-110"
                                        />
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <h3
                                            class="group-hover:text-primary text-secondary-foreground text-lg font-semibold transition-colors"
                                        >
                                            {{ feature.title }}
                                        </h3>
                                        <p
                                            class="text-accent-foreground mt-2 text-sm leading-relaxed"
                                        >
                                            {{ feature.description }}
                                        </p>
                                    </div>
                                </div>

                                <!-- 悬停效果 -->
                                <div
                                    v-if="feature.to"
                                    class="from-primary to-secondary absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transform bg-linear-to-r transition-transform group-hover:scale-x-100"
                                />
                            </div>
                        </div>
                    </div>
                </UContainer>
            </div>
        </template>
    </WidgetsBaseContent>
</template>

<style scoped>
.page-section-content {
    width: 100%;
    height: 100%;
}

.text-highlighted {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.text-muted {
    color: #6b7280;
}
</style>
