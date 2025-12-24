<script setup lang="ts">
import { icons } from "@iconify-json/lucide";
import { computed, ref } from "vue";

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        placeholder?: string;
        size?: "md";
    }>(),
    {
        modelValue: "",
        placeholder: "选择图标",
        size: "md",
    },
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const iconList = ref<string[]>(Object.keys(icons.icons || {}));
const searchQuery = ref<string>("");
const pageSize = ref<number>(100);
const currentPage = ref<number>(1);
const isLoadingMore = ref<boolean>(false);

const normalizedQuery = computed(() => searchQuery.value.toLowerCase());

const filteredIcons = computed(() =>
    normalizedQuery.value
        ? iconList.value.filter((icon) => icon.toLowerCase().includes(normalizedQuery.value))
        : iconList.value,
);

const visibleIcons = computed(() =>
    filteredIcons.value.slice(0, pageSize.value * currentPage.value),
);

const hasMoreIcons = computed(() => visibleIcons.value.length < filteredIcons.value.length);

function onSearch() {
    currentPage.value = 1;
}

function selectIcon(name: string) {
    emit("update:modelValue", `i-lucide-${name}`);
}

function clearSelection() {
    emit("update:modelValue", "");
}

async function loadMoreIcons() {
    if (!hasMoreIcons.value || isLoadingMore.value) return;

    isLoadingMore.value = true;
    await new Promise((resolve) => setTimeout(resolve, 300));
    currentPage.value++;
    isLoadingMore.value = false;
}
</script>

<template>
    <div class="lucide-icon-picker">
        <UPopover :content="{ side: 'right', sideOffset: 12 }">
            <div>
                <UInput
                    :model-value="props.modelValue"
                    :placeholder="props.placeholder"
                    readonly
                    class="icon-input"
                    :ui="{
                        base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75',
                        root: 'w-full',
                        trailing: 'pr-1',
                    }"
                    :size="props.size"
                >
                    <template #trailing>
                        <UButton
                            color="neutral"
                            variant="link"
                            :icon="
                                props.modelValue ? `${props.modelValue}` : 'i-i-lucide-chevron-down'
                            "
                            :padded="false"
                            class="text-dimmed flex-none"
                        />
                    </template>
                </UInput>
            </div>

            <template #content>
                <div class="icon-picker-content">
                    <div class="border-b p-2">
                        <UInput
                            v-model="searchQuery"
                            placeholder="搜索图标..."
                            icon="i-heroicons-magnifying-glass-20-solid"
                            class="w-full"
                            @input="onSearch"
                        />
                    </div>

                    <div
                        class="icon-grid-container p-2"
                        style="max-height: 300px; overflow-y: auto"
                    >
                        <div v-if="visibleIcons.length" class="grid grid-cols-5 gap-2">
                            <UTooltip
                                v-for="icon in visibleIcons"
                                :key="icon"
                                :text="icon"
                                :delay-duration="1000"
                            >
                                <div
                                    class="flex w-9 cursor-pointer flex-col items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    @click="selectIcon(icon)"
                                >
                                    <UIcon :name="`i-lucide-${icon}`" class="size-5" />
                                </div>
                            </UTooltip>
                        </div>
                        <div v-else class="text-muted-foreground p-4 text-center">
                            未找到匹配的图标
                        </div>

                        <div v-if="hasMoreIcons && visibleIcons.length" class="mt-2 text-center">
                            <UButton
                                color="primary"
                                variant="soft"
                                size="sm"
                                @click="loadMoreIcons"
                                :loading="isLoadingMore"
                            >
                                加载更多
                            </UButton>
                        </div>
                    </div>

                    <div
                        v-if="props.modelValue"
                        class="flex items-center justify-between border-t p-2"
                    >
                        <div class="flex items-center">
                            <UIcon :name="`i-lucide-${props.modelValue}`" class="mr-2 size-5" />
                            <span class="text-sm">{{ props.modelValue }}</span>
                        </div>
                        <UButton
                            color="primary"
                            variant="ghost"
                            icon="i-heroicons-x-mark-20-solid"
                            size="xs"
                            @click="clearSelection"
                        />
                    </div>
                </div>
            </template>
        </UPopover>
    </div>
</template>
