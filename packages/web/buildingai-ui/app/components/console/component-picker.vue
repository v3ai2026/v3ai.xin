<script setup lang="ts">
interface ComponentOptions {
    label: string;
    value: string;
}

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        placeholder: string;
    }>(),
    {
        modelValue: "",
        placeholder: "请选择页面组件",
    },
);

const emit = defineEmits<{
    (e: "update:modelValue", v: string): void;
}>();

const allComponents = shallowRef<ComponentOptions[]>([]);
const filteredComponents = shallowRef<ComponentOptions[]>([]);
const isLoading = shallowRef<boolean>(false);
const open = shallowRef<boolean>(false);
const componentPath = shallowRef<string>("");

// 动态加载路径
const modules = import.meta.glob("@/pages/console/**/*.vue", { eager: false });

// 校验有效路径（必须包含 /console/ 且不含 components）
function isValidConsolePath(path: string): boolean {
    const isValid = path.includes("/console/") && !path.includes("/components/");
    return isValid;
}

// 提取相对路径
function formatPath(path: string): ComponentOptions | null {
    if (!isValidConsolePath(path)) return null;

    // 去除 .vue 后缀
    const cleaned = path.replace(/\.vue$/, "");

    const match = cleaned.match(/\/console\/.+$/);
    if (!match) return null;

    const relativePath = match[0];
    return {
        label: relativePath,
        value: relativePath,
    };
}

async function loadAllComponents() {
    if (allComponents.value.length > 0) return;
    componentPath.value = "";
    isLoading.value = true;

    const components = Object.keys(modules)
        .map(formatPath)
        .filter((c): c is ComponentOptions => !!c)
        .sort((a, b) => a.label.localeCompare(b.label));

    allComponents.value = components;
    filteredComponents.value = components;

    isLoading.value = false;
    await nextTick();
    componentPath.value = props.modelValue;
}

function handleSearch(query: string) {
    const keyword = query.trim().toLowerCase();
    filteredComponents.value = keyword
        ? allComponents.value.filter((c) => c.label.toLowerCase().includes(keyword))
        : [...allComponents.value];
}

function handleValueChange(value: string) {
    emit("update:modelValue", value);
}

onMounted(() => loadAllComponents());
</script>

<template>
    <div class="page-component-picker" @click="open = true">
        <UInputMenu
            v-model="componentPath"
            v-model:open="open"
            :items="filteredComponents"
            :loading="isLoading"
            :placeholder="props.placeholder"
            value-key="value"
            searchable
            clearable
            icon="i-lucide-file-json"
            :ui="{ content: '!w-auto min-w-[224px]' }"
            @update:model-value="(value) => handleValueChange(value)"
            @search="handleSearch"
        />
    </div>
</template>
