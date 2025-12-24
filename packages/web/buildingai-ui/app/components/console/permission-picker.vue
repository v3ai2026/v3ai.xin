<script setup lang="ts">
import type { Permission, PermissionGroup } from "@buildingai/service/consoleapi/permission";
import { apiGetPermissionList } from "@buildingai/service/consoleapi/permission";

interface PermissionOptions {
    label: string;
    value: string;
}

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        placeholder: string;
        type?: "system" | "plugin";
    }>(),
    {
        modelValue: "",
        placeholder: "请选择权限编码",
        type: "system",
    },
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const permissionGroups = ref<Record<string, Permission[]>>({});
const permissionOptions = ref<PermissionOptions[]>([]);
const open = ref<boolean>(false);
const permissionCode = ref<string>("");

function transformToOptions(groups: Record<string, Permission[]>): PermissionOptions[] {
    return Object.entries(groups)
        .flatMap(([group, permissions]) =>
            permissions.map((p) => ({
                label: `${group} ${p.name}`,
                value: p.code,
            })),
        )
        .sort((a, b) => a.label.localeCompare(b.label));
}

const { lockFn: loadPermissions, isLock } = useLockFn(async () => {
    if (Object.keys(permissionGroups.value).length > 0) return;
    try {
        permissionCode.value = "";
        const result = (await apiGetPermissionList({
            type: props.type,
            isGrouped: true,
            isDeprecated: false,
        })) as PermissionGroup[];

        // 将分组结果转换为之前的格式
        const groupedPermissions: Record<string, Permission[]> = {};
        result.forEach((group) => {
            groupedPermissions[group.code] = group.permissions;
        });

        permissionGroups.value = groupedPermissions;
        permissionOptions.value = transformToOptions(groupedPermissions);
        permissionCode.value = props.modelValue;
    } catch (error) {
        console.error("获取权限列表失败:", error);
    }
});

onMounted(() => loadPermissions());
</script>

<template>
    <div class="permission-code-picker" @click="open = true">
        <UInputMenu
            v-model="permissionCode"
            v-model:open="open"
            :items="permissionOptions"
            :loading="isLock"
            :placeholder="placeholder"
            value-key="value"
            searchable
            clearable
            icon="i-lucide-shield"
            :ui="{ content: '!w-auto min-w-[224px]' }"
            @update:model-value="(value) => emit('update:modelValue', value)"
        >
            <template #item="{ item }">
                <div class="flex items-center">
                    <UIcon name="i-lucide-shield" class="text-primary mr-2 size-5" />
                    <div class="flex-1 overflow-hidden">
                        <div class="truncate text-sm font-medium">{{ item.label }}</div>
                        <div class="text-muted-foreground truncate text-xs">{{ item.value }}</div>
                    </div>
                </div>
            </template>
        </UInputMenu>
        <div class="text-muted-foreground mt-1 text-xs">
            <code>模块:操作</code>，例如 <code>menu:create</code>
        </div>
    </div>
</template>
