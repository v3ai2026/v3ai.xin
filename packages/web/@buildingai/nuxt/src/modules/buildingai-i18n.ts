import { languageOptions } from "@buildingai/i18n-config";
import { defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
    async setup(options, nuxt) {
        // 判断是否是插件项目：检查 rootDir 是否包含 /extensions/
        const rootDir = nuxt.options.rootDir;
        const isPlugin = rootDir.includes("extensions");

        const langDir = isPlugin ? "./src/web/i18n" : "./app/i18n";

        nuxt.hook("i18n:registerModule", (register) => {
            register({
                langDir: langDir,
                locales: languageOptions.map((locale) => ({
                    code: locale.code,
                    file: "index.ts",
                })),
            });
        });
    },
});
