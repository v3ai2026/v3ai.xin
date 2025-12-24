<script setup lang="ts">
import type {
    SecretConfig,
    SecretTemplateRequest,
} from "@buildingai/service/consoleapi/secret-template";
import { getSecretTemplateListAll } from "@buildingai/service/consoleapi/secret-template";
import type { ModelType } from "@buildingai/service/models/globals";

import type { ButtonProps } from "#ui/types";

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        disabled?: boolean;
        showDescription?: boolean;
        defaultSelected?: boolean;
        console?: boolean;
        supportedModelTypes?: ModelType[];
        buttonUi?: ButtonProps;
        showBillingRule?: boolean;
        openLocalStorage?: boolean;
    }>(),
    {
        showDescription: true,
        defaultSelected: true,
        console: false,
        showBillingRule: false,
        openLocalStorage: false,
    },
);

const emit = defineEmits<{
    "update:modelValue": [value: string];
    change: [value: SecretConfig | null];
}>();

const { t } = useI18n();

const loading = shallowRef(false);
const isOpen = shallowRef(false);
const search = shallowRef("");
const selected = shallowRef<SecretConfig | null>(null);
const scrollAreaRef = useTemplateRef("scrollAreaRef");
const items = shallowRef<SecretTemplateRequest[]>([]);
const expandedItems = shallowRef<Set<string>>(new Set());

// Computed: Filtered items based on search query
const filteredItems = computed(() => {
    const query = search.value.trim().toLowerCase();
    return query
        ? items.value
              .map((item) => ({
                  ...item,
                  secretConfigs: (item.secretConfigs || item.Secrets || []).filter(
                      (key) =>
                          key.name.toLowerCase().includes(query) ||
                          item.name.toLowerCase().includes(query),
                  ),
              }))
              .filter(
                  (item) =>
                      item.name.toLowerCase().includes(query) ||
                      ((item.secretConfigs || item.Secrets)?.length || 0) > 0,
              )
        : items.value;
});

// Computed: Display text for selected model
const selectedDisplayText = computed(() => {
    if (!selected.value) return "";
    const parentPool = items.value.find((item) =>
        (item.secretConfigs || item.Secrets || []).some((key) => key.id === selected.value?.id),
    );
    return parentPool ? `${parentPool.name}/${selected.value.name}` : selected.value.name;
});

// Computed: All key configs for lookup
const allSecretConfigs = computed(() =>
    items.value.flatMap((item) => item.secretConfigs || item.Secrets || []),
);

// Select a key config and emit events
function selectModel(keyConfig: SecretConfig | null) {
    selected.value = keyConfig;
    emit("update:modelValue", keyConfig?.id ?? "");
    emit("change", keyConfig);
    isOpen.value = false;
    search.value = "";
}

// Load data from API
async function loadData() {
    if (loading.value) return;
    loading.value = true;
    try {
        items.value = await getSecretTemplateListAll();

        // Ensure all items are expanded by default
        expandedItems.value = new Set(items.value.map((item) => item.id));

        const findSecretConfig = (id?: string) => allSecretConfigs.value.find((k) => k.id === id);
        if (!props.defaultSelected) {
            selected.value = findSecretConfig(props.modelValue) ?? null;
            return;
        }

        selected.value =
            (props.openLocalStorage
                ? findSecretConfig(localStorage.getItem("modelId") ?? "")
                : null) ??
            findSecretConfig(props.modelValue) ??
            null;

        if (selected.value) selectModel(selected.value);
    } catch (error) {
        console.error("Failed to load key templates:", error);
    } finally {
        loading.value = false;
    }
}

// Scroll to selected key config
async function scrollToSelected() {
    if (!selected.value || !isOpen.value || !scrollAreaRef.value) return;
    await nextTick();
    const selectedElement = document.querySelector(`[data-model-id="${selected.value.id}"]`);
    selectedElement?.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Toggle item expansion
function toggleExpanded(itemId: string) {
    const newSet = new Set(expandedItems.value);
    if (newSet.has(itemId)) {
        newSet.delete(itemId);
    } else {
        newSet.add(itemId);
    }
    expandedItems.value = newSet;
}

// Watch popover state
watch(isOpen, (open) => {
    if (open) scrollToSelected();
});

watch(
    () => props.modelValue,
    (newValue) => {
        if (!loading.value && items.value.length) {
            const config = allSecretConfigs.value.find((k) => k.id === newValue);
            if (config) {
                selected.value = config;
            }
        }
    },
);

// Initialize on mount
onMounted(() => {
    loadData();
});
</script>

<template>
    <UPopover v-model:open="isOpen" :disabled="props.disabled">
        <UButton
            :color="selected ? 'primary' : 'neutral'"
            variant="ghost"
            class="flex w-full items-center justify-between"
            :class="{ 'bg-primary/10': selected?.id }"
            :loading="loading"
            :disabled="props.disabled"
            v-bind="props.buttonUi"
            @click.stop
        >
            <span class="truncate" :class="{ 'text-muted-foreground': !selectedDisplayText }">
                {{ selectedDisplayText || t("common.placeholder.keySelect") }}
            </span>
            <div class="flex items-center gap-2">
                <UIcon
                    v-if="selected && props.console"
                    name="i-lucide-x"
                    class="h-4 w-4"
                    @click.stop="selectModel(null)"
                />
                <UIcon
                    name="i-lucide-chevron-down"
                    class="h-4 w-4"
                    :class="{ 'rotate-180': isOpen }"
                />
            </div>
        </UButton>

        <template #content>
            <div class="border-border bg-background w-[380px] rounded-lg border shadow-lg">
                <!-- Search bar -->
                <div class="p-3">
                    <UFormField :required="false">
                        <UInput
                            v-model="search"
                            :placeholder="t('common.placeholder.searchKey')"
                            size="sm"
                            class="w-full"
                            :ui="{
                                base: 'bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20',
                            }"
                        >
                            <template #leading>
                                <UIcon
                                    name="i-lucide-search"
                                    class="text-muted-foreground h-4 w-4"
                                />
                            </template>
                        </UInput>
                    </UFormField>
                </div>

                <!-- Content area -->
                <div class="grid h-full">
                    <BdScrollArea
                        ref="scrollAreaRef"
                        class="max-h-[400px] min-h-[200px] px-2 pb-2"
                        type="hover"
                        :shadow="false"
                    >
                        <!-- Loading state -->
                        <div
                            v-if="loading"
                            class="text-muted-foreground flex flex-col items-center justify-center py-12"
                        >
                            <UIcon name="i-lucide-loader-2" class="mb-2 h-6 w-6 animate-spin" />
                            <span class="text-sm">{{ t("common.loading") }}</span>
                        </div>

                        <!-- Empty state -->
                        <div
                            v-if="!filteredItems.length"
                            class="text-muted-foreground flex flex-col items-center justify-center py-12"
                        >
                            <UIcon name="i-lucide-database" class="mb-3 h-8 w-8 opacity-50" />
                            <span class="text-sm font-medium">
                                {{ search ? t("common.noSearchResults") : t("common.empty") }}
                            </span>
                            <span class="mt-1 text-xs">
                                {{
                                    search
                                        ? t("common.tryOtherKeywords")
                                        : t("common.noAvailableKeyPool")
                                }}
                            </span>
                        </div>

                        <!-- Tree list -->
                        <div v-else class="py-1">
                            <template v-for="item in filteredItems" :key="item.id">
                                <div
                                    v-if="((item.secretConfigs || item.Secrets)?.length || 0) > 0"
                                    class="mb-1"
                                >
                                    <!-- Parent item (key template) -->
                                    <div
                                        class="group hover:bg-muted/50 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
                                        @click="toggleExpanded(item.id)"
                                    >
                                        <NuxtImg
                                            :src="item.icon"
                                            alt="icon"
                                            class="h-4 w-4 flex-none"
                                        />
                                        <span class="text-foreground flex-1 truncate font-medium">{{
                                            item.name
                                        }}</span>
                                        <div
                                            class="text-muted-foreground flex items-center gap-1 text-xs"
                                        >
                                            <span
                                                >({{
                                                    (item.secretConfigs || item.Secrets)?.length ||
                                                    0
                                                }})</span
                                            >
                                            <UBadge
                                                :color="
                                                    item.isEnabled === 1 ? 'success' : 'neutral'
                                                "
                                                variant="solid"
                                                size="xs"
                                            />
                                        </div>
                                        <UIcon
                                            :name="
                                                expandedItems.has(item.id)
                                                    ? 'i-lucide-chevron-down'
                                                    : 'i-lucide-chevron-right'
                                            "
                                            class="text-muted-foreground h-3 w-3 transition-transform duration-150"
                                        />
                                    </div>

                                    <!-- Child items (key configs) -->
                                    <Transition
                                        enter-active-class="transition-all duration-150 ease-out"
                                        enter-from-class="opacity-0 -translate-y-1"
                                        enter-to-class="opacity-100 translate-y-0"
                                        leave-active-class="transition-all duration-150 ease-in"
                                        leave-from-class="opacity-100 translate-y-0"
                                        leave-to-class="opacity-0 -translate-y-1"
                                    >
                                        <div
                                            v-if="expandedItems.has(item.id)"
                                            class="border-border/30 ml-4 border-l pl-3"
                                        >
                                            <div
                                                v-for="key in item.secretConfigs ||
                                                item.Secrets ||
                                                []"
                                                :key="key.id"
                                                :data-model-id="key.id"
                                                class="group/key hover:bg-muted/30 hover:text-foreground flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
                                                :class="{
                                                    'bg-primary/10 text-primary':
                                                        selected?.id === key.id,
                                                }"
                                                @click="selectModel(key)"
                                            >
                                                <UIcon
                                                    name="i-lucide-file-key-2"
                                                    class="h-4 w-4 flex-none"
                                                    :class="{
                                                        'text-primary': selected?.id === key.id,
                                                        'text-muted-foreground/70':
                                                            selected?.id !== key.id,
                                                    }"
                                                />
                                                <span class="flex-1 truncate font-medium">{{
                                                    key.name
                                                }}</span>
                                                <UBadge
                                                    :color="
                                                        key.status === 1 ? 'success' : 'neutral'
                                                    "
                                                    variant="solid"
                                                    size="xs"
                                                />
                                                <UIcon
                                                    v-if="selected?.id === key.id"
                                                    name="i-lucide-check"
                                                    class="text-primary h-3 w-3"
                                                />
                                            </div>
                                        </div>
                                    </Transition>
                                </div>
                            </template>
                        </div>
                    </BdScrollArea>
                </div>
            </div>
        </template>
    </UPopover>
</template>
