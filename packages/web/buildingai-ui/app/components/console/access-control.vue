<script setup lang="ts">
/**
 * 权限控制组件
 * 根据用户权限控制内部内容的显示
 *
 * @example
 * <AccessControl :codes="['system:user:add']">
 *   <Button>添加用户</Button>
 * </AccessControl>
 *
 * @example
 * <AccessControl :codes="['system:user:edit', 'system:user:delete']" require-all>
 *   <Button>高级操作</Button>
 * </AccessControl>
 */

const props = defineProps<{
    /** 权限码数组 */
    codes: string[];
}>();

const permissionStore = usePermissionStore();
const userStore = useUserStore();

/**
 * 计算是否有权限显示内容
 */
const hasPermission = computed(() => {
    return props.codes.every((c) => permissionStore.hasPermission(c));
});
</script>

<template>
    <slot v-if="hasPermission || userStore.userInfo?.isRoot" />
</template>
