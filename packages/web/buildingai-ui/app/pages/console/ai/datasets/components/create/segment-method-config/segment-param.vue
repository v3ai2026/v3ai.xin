<script lang="ts" setup>
import type { IndexingConfig } from "@buildingai/service/consoleapi/ai-datasets";

const props = defineProps<{
    modelValue: IndexingConfig;
    isPreviewing?: boolean;
    onPreviewSegments?: () => void;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: IndexingConfig];
}>();

const indexingConfig = useVModel(props, "modelValue", emit);
</script>

<template>
    <div>
        <!-- 通用分段参数 -->
        <div v-if="indexingConfig.documentMode === 'normal'" class="space-y-4">
            <div class="grid grid-cols-3 gap-6">
                <UFormField :label="$t('ai-datasets.backend.create.segment.segmentIdentifier')">
                    <UInput
                        v-model="indexingConfig.segmentation!.segmentIdentifier"
                        placeholder="\n\n"
                    />
                    <template #help>
                        <p class="text-muted-foreground text-xs">
                            {{ $t("ai-datasets.backend.create.segment.segmentIdentifierDesc") }}
                        </p>
                    </template>
                </UFormField>
                <UFormField :label="$t('ai-datasets.backend.create.segment.maxSegmentLength')">
                    <UInput
                        v-model.number="indexingConfig.segmentation!.maxSegmentLength"
                        type="number"
                        :min="50"
                        :max="4000"
                        placeholder="1024"
                    />
                </UFormField>
                <UFormField :label="$t('ai-datasets.backend.create.segment.segmentOverlap')">
                    <UInput
                        v-model.number="indexingConfig.segmentation!.segmentOverlap"
                        type="number"
                        :min="0"
                        :max="500"
                        placeholder="50"
                    />
                </UFormField>
            </div>
            <div class="mt-4">
                <h5 class="text-foreground mb-2 text-sm font-medium">
                    {{ $t("ai-datasets.backend.create.segment.preprocessingRules") }}
                </h5>
                <div class="space-y-2">
                    <UCheckbox
                        v-model="indexingConfig.preprocessingRules!.replaceConsecutiveWhitespace!"
                        size="sm"
                        :label="
                            $t('ai-datasets.backend.create.segment.replaceConsecutiveWhitespace')
                        "
                    />
                    <UCheckbox
                        v-model="indexingConfig.preprocessingRules!.removeUrlsAndEmails!"
                        size="sm"
                        :label="$t('ai-datasets.backend.create.segment.removeUrlsAndEmails')"
                    />
                </div>
            </div>
            <div class="mt-4 flex gap-2">
                <UButton
                    leading-icon="i-lucide-scan-search"
                    :loading="isPreviewing"
                    @click.stop="onPreviewSegments"
                >
                    {{ $t("ai-datasets.backend.create.segment.preview") }}
                </UButton>
            </div>
        </div>

        <!-- 父子分段参数 -->
        <div v-if="indexingConfig.documentMode === 'hierarchical'" class="space-y-4">
            <!-- 父块用作上下文 -->
            <div class="space-y-3">
                <div class="mb-3 flex items-center gap-2">
                    <UIcon name="i-heroicons-document-text" class="text-primary h-4 w-4" />
                    <span class="text-xs font-medium">
                        {{ $t("ai-datasets.backend.create.segment.parentContext") }}
                    </span>
                </div>

                <!-- 段落模式 -->
                <div
                    class="cursor-pointer rounded-lg border p-3 transition-all"
                    :class="
                        indexingConfig.parentContextMode === 'paragraph'
                            ? 'border-primary'
                            : 'border-default'
                    "
                    @click.stop="indexingConfig.parentContextMode = 'paragraph'"
                >
                    <div class="mb-2 flex items-center gap-2">
                        <UIcon name="i-heroicons-document-text" class="text-primary h-4 w-4" />
                        <span class="text-xs font-medium">
                            {{ $t("ai-datasets.backend.create.segment.paragraph") }}
                        </span>
                    </div>
                    <p class="text-muted-foreground mb-3 text-xs">
                        {{ $t("ai-datasets.backend.create.segment.parentContextDesc") }}
                    </p>
                    <div
                        v-if="indexingConfig.parentContextMode === 'paragraph'"
                        class="grid grid-cols-2 gap-8"
                    >
                        <UFormField
                            :label="$t('ai-datasets.backend.create.segment.segmentIdentifier')"
                        >
                            <UInput
                                v-model="indexingConfig.segmentation!.segmentIdentifier"
                                placeholder="\n\n"
                                size="sm"
                            />
                        </UFormField>
                        <UFormField
                            :label="$t('ai-datasets.backend.create.segment.maxSegmentLength')"
                        >
                            <UInput
                                v-model.number="indexingConfig.segmentation!.maxSegmentLength"
                                type="number"
                                :min="200"
                                :max="8000"
                                placeholder="1024"
                                size="sm"
                            />
                        </UFormField>
                    </div>
                </div>

                <!-- 全文模式 -->
                <div
                    class="cursor-pointer rounded-lg border p-3 transition-all"
                    :class="
                        indexingConfig.parentContextMode === 'fullText'
                            ? 'border-primary'
                            : 'border-default'
                    "
                    @click.stop="indexingConfig.parentContextMode = 'fullText'"
                >
                    <div class="mb-2 flex items-center gap-2">
                        <UIcon name="i-heroicons-document" class="text-primary h-4 w-4" />
                        <span class="text-xs font-medium">
                            {{ $t("ai-datasets.backend.create.segment.fullText") }}
                        </span>
                    </div>
                    <p class="text-muted-foreground text-xs">
                        {{ $t("ai-datasets.backend.create.segment.fullTextDesc") }}
                    </p>
                </div>
            </div>

            <!-- 子块用于检索 -->
            <div class="pt-4">
                <div class="mb-3 flex items-center gap-2">
                    <UIcon name="i-heroicons-squares-2x2" class="size-5" />
                    <span class="text-xs font-medium">
                        {{ $t("ai-datasets.backend.create.segment.subSegmentation") }}
                    </span>
                </div>

                <div class="grid grid-cols-2 gap-8">
                    <UFormField :label="$t('ai-datasets.backend.create.segment.segmentIdentifier')">
                        <UInput
                            v-model="indexingConfig.subSegmentation!.segmentIdentifier"
                            placeholder="\n"
                            size="sm"
                        />
                    </UFormField>

                    <UFormField :label="$t('ai-datasets.backend.create.segment.maxSegmentLength')">
                        <UInput
                            v-model.number="indexingConfig.subSegmentation!.maxSegmentLength"
                            type="number"
                            :min="50"
                            :max="4000"
                            placeholder="512"
                            size="sm"
                        />
                    </UFormField>
                </div>
            </div>

            <!-- 文本预处理规则 -->
            <div>
                <h5 class="text-foreground mb-2 text-sm font-medium">
                    {{ $t("ai-datasets.backend.create.segment.preprocessingRules") }}
                </h5>
                <div class="space-y-2">
                    <UCheckbox
                        v-model="indexingConfig.preprocessingRules!.replaceConsecutiveWhitespace"
                        size="sm"
                        :label="
                            $t('ai-datasets.backend.create.segment.replaceConsecutiveWhitespace')
                        "
                    />
                    <UCheckbox
                        v-model="indexingConfig.preprocessingRules!.removeUrlsAndEmails"
                        size="sm"
                        :label="$t('ai-datasets.backend.create.segment.removeUrlsAndEmails')"
                    />
                </div>
            </div>

            <div class="flex gap-2">
                <UButton
                    leading-icon="i-lucide-scan-search"
                    :loading="isPreviewing"
                    @click.stop="onPreviewSegments"
                >
                    {{ $t("ai-datasets.backend.create.segment.preview") }}
                </UButton>
            </div>
        </div>
    </div>
</template>
