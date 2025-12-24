export const useAccessControl = () => {
    const permissionStore = usePermissionStore();
    const userStore = useUserStore();

    const hasAccessByCodes = (codes: string[]) => {
        return codes.every((c) => permissionStore.hasPermission(c)) || userStore.userInfo?.isRoot;
    };

    return {
        hasAccessByCodes,
    };
};
