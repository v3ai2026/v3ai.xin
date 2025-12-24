import { resolve } from "node:path";

import { addComponentsDir, defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
    meta: {
        name: "buildingai-components",
        configKey: "buildingaiComponents",
    },
    async setup(options, nuxt) {
        const rootDir = nuxt.options.rootDir;

        const isPlugin = rootDir.includes("/extensions/");

        if (isPlugin) {
            const mainAppComponentsDir = resolve(
                rootDir,
                "../../packages/web/buildingai-ui/app/components",
            );

            addComponentsDir({
                path: mainAppComponentsDir,
                pathPrefix: false,
                extensions: ["vue"],
                global: false,
                watch: false,
                // Ignore components that depend on main app utils
                ignore: [
                    "**/chats/chats-chats.vue",
                    "**/reference/reference-knowledge.vue",
                    "**/reference/reference-mcp-tool-call.vue",
                    "**/reference/reference-reasoning.vue",
                ],
            });
        }
    },
});
