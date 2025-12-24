<script lang="ts" setup>
import type { UserInfo } from "@buildingai/service/webapi/user";
import { useI18n } from "vue-i18n";

import type { TableColumn } from "#ui/types";

const emit = defineEmits<{ (e: "close"): void }>();

const props = defineProps<{
    users: UserInfo[];
    roleName: string;
}>();

const TimeDisplay = resolveComponent("TimeDisplay");
const { t } = useI18n();

const columns = computed<TableColumn<UserInfo>[]>(() => [
    {
        accessorKey: "userNo",
        header: t("financial.accountBalance.table.userNo"),
    },
    {
        accessorKey: "username",
        header: t("user.backend.form.username"),
    },
    {
        accessorKey: "roleName",
        header: t("user.backend.form.role"),
    },
    {
        accessorKey: "realName",
        header: t("user.backend.form.realName"),
    },
    {
        accessorKey: "createdAt",
        header: t("console-common.createAt"),
        cell: ({ row }) => {
            const createdAt = row.getValue("createdAt") as string;
            return h(TimeDisplay, {
                datetime: createdAt,
                mode: "datetime",
            });
        },
    },
]);
</script>

<template>
    <BdModal
        :title="t('system-perms.role.usersCountTitle')"
        :ui="{ content: 'max-w-3xl' }"
        @close="emit('close')"
    >
        <UTable :data="props.users" :columns="columns">
            <template #username-cell="{ row }">
                <div class="flex items-center gap-2">
                    <UAvatar :src="row.original.avatar" size="sm" />
                    <div>{{ row.original.username }}</div>
                </div>
            </template>
            <template #roleName-cell>
                {{ props.roleName }}
            </template>
        </UTable>
    </BdModal>
</template>
