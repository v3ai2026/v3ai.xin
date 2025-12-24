import fs from "node:fs";
import { join, resolve } from "node:path";

import { addPlugin, addTemplate, createResolver, defineNuxtModule } from "@nuxt/kit";

function collectConsoleLayouts(rootDir: string): Record<string, string> {
    const layouts: Record<string, string> = {};

    const getLayout = (filePath: string): string => {
        try {
            const content = fs.readFileSync(filePath, "utf-8");
            const match = content.match(
                /definePageMeta\s*\(\s*\{\s*[^}]*layout:\s*["']([^"']+)["'][^}]*\}\s*\)/s,
            );
            return match?.[1] || "console";
        } catch {
            return "console";
        }
    };

    const scan = (dir: string) => {
        if (!fs.existsSync(dir)) return;

        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const fullPath = join(dir, entry.name);

            if (entry.isDirectory() && entry.name !== "components") {
                scan(fullPath);
            } else if (entry.name.endsWith(".vue")) {
                const layout = getLayout(fullPath);
                const relativePath = fullPath.split("/pages/console/")[1]?.replace(".vue", "");
                if (relativePath) layouts[relativePath] = layout;
            }
        }
    };

    scan(resolve(rootDir, "packages/web/buildingai-ui/app/pages/console"));

    return layouts;
}

export default defineNuxtModule({
    meta: { name: "console-layout" },
    setup(_, nuxt) {
        const layouts = collectConsoleLayouts(
            createResolver(import.meta.url).resolve("../../../../"),
        );

        addPlugin({
            src: addTemplate({
                filename: "console-layout.mjs",
                getContents: () => {
                    return `export default defineNuxtPlugin(() => {
    const layouts = ${JSON.stringify(layouts, null, 2)};
    useNuxtApp().provide('getConsoleLayout', (path) => {
        const cleanPath = path?.startsWith('/console/') ? path.substring(9) : path;
        return layouts[cleanPath] || 'console';
    });
});`;
                },
            }).dst,
        });

        nuxt.hook("prepare:types", ({ declarations }) => {
            declarations.push(
                `declare module '#app' { interface NuxtApp { $getConsoleLayout: (path: string) => string; } }`,
            );
        });
    },
});
