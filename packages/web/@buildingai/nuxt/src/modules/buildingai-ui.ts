import { resolve } from "node:path";

import { addComponentsDir, defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
    meta: {
        name: "buildingai-ui",
        configKey: "buildingaiUi",
    },
    setup(options, nuxt) {
        const componentsPath = resolve(
            nuxt.options.rootDir,
            "node_modules/@buildingai/ui/src/components",
        );

        addComponentsDir({
            path: componentsPath,
            global: false,
            watch: false,
            extensions: ["vue"],
            transpile: false,
        });
    },
});
