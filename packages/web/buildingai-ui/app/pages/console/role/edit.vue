<script setup lang="ts">
import type { RoleCreateRequest, RoleUpdateRequest } from "@buildingai/service/consoleapi/role";
import {
    apiCreateRole,
    apiGetRoleDetail,
    apiUpdateRole,
} from "@buildingai/service/consoleapi/role";
import { object, string } from "yup";

const emits = defineEmits<{
    (e: "close", refresh?: boolean): void;
}>();

const props = defineProps<{ id: string | null }>();

const { t } = useI18n();

const formData = shallowRef<RoleUpdateRequest>({
    id: props.id as string,
    name: "",
    description: "",
});

const roleSchema = object({
    name: string().required(t("system-perms.role.nameInput")),
});

const { lockFn: fetchDetail, isLock: loading } = useLockFn(async () => {
    try {
        const {
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            permissions: _permissions,
            ...data
        } = await apiGetRoleDetail(props.id as string);
        formData.value = data;
    } catch (error) {
        console.error("获取详情失败:", error);
        useMessage().error(t("system-perms.role.getRoleFailed"));
    }
});

const { lockFn: submitForm, isLock } = useLockFn(async () => {
    try {
        if (props.id) {
            await apiUpdateRole({ ...formData.value, id: formData.value.id as string });
        } else {
            await apiCreateRole(formData.value as RoleCreateRequest);
        }
        useMessage().success(t("system-perms.role.success"));
        emits("close", true);
    } catch (error) {
        console.error("提交失败:", error);
        useMessage().error(t("system-perms.role.error"));
    }
});

onMounted(() => props.id && fetchDetail());
</script>

<template>
    <BdModal
        :title="t('system-perms.role.roleInfo')"
        :description="t('system-perms.role.roleInfoDesc')"
        :ui="{ content: 'max-w-md' }"
        @close="emits('close', false)"
    >
        <div v-if="loading" class="flex items-center justify-center py-10">
            <UIcon name="i-lucide-loader-2" class="size-8 animate-spin" />
        </div>

        <UForm :state="formData" :schema="roleSchema" class="space-y-4" @submit="submitForm">
            <UFormField :label="t('system-perms.role.name')" name="name" required>
                <UInput
                    v-model="formData.name"
                    :placeholder="t('system-perms.role.nameInput')"
                    :ui="{ root: 'w-full' }"
                />
            </UFormField>

            <UFormField :label="t('system-perms.role.describe')" name="description">
                <UTextarea
                    v-model="formData.description"
                    :ui="{ root: 'w-full' }"
                    :placeholder="t('system-perms.role.descriptionInput')"
                />
            </UFormField>

            <div class="mt-10 flex justify-end gap-2">
                <UButton color="neutral" variant="soft" size="lg" @click="emits('close', false)">
                    {{ t("console-common.cancel") }}
                </UButton>
                <UButton color="primary" size="lg" type="submit" :loading="isLock">
                    {{ t("console-common.confirm") }}
                </UButton>
            </div>
        </UForm>
    </BdModal>
</template>
