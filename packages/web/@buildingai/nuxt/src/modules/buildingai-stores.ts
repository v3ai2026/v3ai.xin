import { addImports, defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
    meta: {
        name: "buildingai-stores",
        configKey: "buildingaiStores",
    },
    setup() {
        addImports([
            {
                name: "useAppStore",
                from: "@buildingai/stores/app",
            },
            {
                name: "usePermissionStore",
                from: "@buildingai/stores/permission",
            },
            {
                name: "useUserStore",
                from: "@buildingai/stores/user",
            },
            {
                name: "useControlsStore",
                from: "@buildingai/stores/controls",
            },
        ]);
    },
});
