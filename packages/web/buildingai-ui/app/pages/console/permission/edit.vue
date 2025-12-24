<script setup lang="ts">
import type { Permission } from "@buildingai/service/consoleapi/permission";
import { apiGetPermissionByCode } from "@buildingai/service/consoleapi/permission";
import { useI18n } from "vue-i18n";

const props = defineProps<{ code: string | null }>();

const emits = defineEmits<{
    (e: "close"): void;
}>();

const { t } = useI18n();

const permissionData = shallowRef<Permission | null>(null);

const { lockFn: fetchDetail, isLock } = useLockFn(async () => {
    try {
        const data = await apiGetPermissionByCode(props.code as string);
        permissionData.value = data;
    } catch (error) {
        console.error("获取权限详情失败:", error);
        useMessage().error(t("system-perms.permission.getDetailFailed"));
        emits("close");
    }
});

onMounted(() => props.code && fetchDetail());
</script>

<template>
    <BdModal
        :title="t('system-perms.permission.detailTitle')"
        :description="t('system-perms.permission.detailDesc')"
        :ui="{ content: 'max-w-2xl' }"
        @close="emits('close')"
    >
        <div v-if="isLock" class="flex items-center justify-center py-10">
            <UIcon name="i-lucide-loader-2" class="size-8 animate-spin" />
        </div>

        <div v-else-if="permissionData" class="space-y-6 p-2">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <div class="text-muted-foreground text-sm font-medium">
                        {{ t("system-perms.permission.code") }}
                    </div>
                    <div class="mt-1 font-mono text-sm">
                        {{ permissionData.code }}
                    </div>
                </div>
                <div>
                    <div class="text-muted-foreground text-sm font-medium">
                        {{ t("system-perms.permission.name") }}
                    </div>
                    <div class="mt-1 text-sm">
                        {{ permissionData.name }}
                    </div>
                </div>
                <div>
                    <div class="text-muted-foreground text-sm font-medium">
                        {{ t("system-perms.permission.group") }}
                    </div>
                    <div class="mt-1">
                        <UBadge color="primary" variant="subtle">
                            {{ permissionData.group }}
                        </UBadge>
                    </div>
                </div>
                <div>
                    <div class="text-muted-foreground text-sm font-medium">
                        {{ t("system-perms.permission.isDeprecated") }}
                    </div>
                    <div class="mt-1">
                        <UBadge
                            :color="permissionData.isDeprecated ? 'error' : 'success'"
                            variant="subtle"
                        >
                            {{
                                permissionData.isDeprecated
                                    ? t("system-perms.permission.yes")
                                    : t("system-perms.permission.no")
                            }}
                        </UBadge>
                    </div>
                </div>
            </div>

            <div>
                <div class="text-muted-foreground text-sm font-medium">
                    {{ t("system-perms.permission.describe") }}
                </div>
                <div class="mt-1 text-sm">
                    {{ permissionData.description || t("system-perms.permission.noDescription") }}
                </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <div class="text-muted-foreground text-sm font-medium">
                        {{ t("console-common.createAt") }}
                    </div>
                    <div class="mt-1 text-sm">
                        <TimeDisplay
                            v-if="permissionData.createdAt"
                            :datetime="permissionData.createdAt as string"
                            mode="datetime"
                        />
                        <span v-else>-</span>
                    </div>
                </div>
                <div>
                    <div class="text-muted-foreground text-sm font-medium">
                        {{ t("console-common.updateAt") }}
                    </div>
                    <div class="mt-1 text-sm">
                        <TimeDisplay
                            v-if="permissionData.updatedAt"
                            :datetime="permissionData.updatedAt as string"
                            mode="datetime"
                        />
                        <span v-else>-</span>
                    </div>
                </div>
            </div>

            <div class="mt-6 flex justify-end">
                <UButton color="neutral" variant="soft" @click="emits('close')">
                    {{ t("console-common.close") }}
                </UButton>
            </div>
        </div>
    </BdModal>
</template>
