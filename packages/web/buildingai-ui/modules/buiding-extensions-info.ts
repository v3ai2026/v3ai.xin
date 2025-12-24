import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { defineNuxtModule } from "@nuxt/kit";

interface ExtensionManifest {
    identifier: string;
    name: string;
    version: string;
    description: string;
    author: {
        avatar: string;
        name: string;
        homepage: string;
    };
}

interface ExtensionInfo {
    manifest: ExtensionManifest;
    isLocal: boolean;
    enabled: boolean;
    installedAt: string;
}

interface ExtensionsJson {
    applications?: Record<string, ExtensionInfo>;
    functionals?: Record<string, ExtensionInfo>;
    [key: string]: Record<string, ExtensionInfo> | ExtensionInfo | undefined;
}

export default defineNuxtModule({
    meta: {
        name: "buildingai-extensions-info",
    },
    setup() {
        const extensionsDir = resolve(process.cwd(), "../../../extensions");
        const extensionsJsonPath = resolve(extensionsDir, "extensions.json");

        // 读取 extensions.json 文件
        if (!existsSync(extensionsJsonPath)) {
            console.log(
                `  \x1b[36mℹ  Extensions Info:\x1b[0m        \x1b[33mWarning:\x1b[0m extensions.json not found`,
            );
            return;
        }

        try {
            const extensionsJsonContent = readFileSync(extensionsJsonPath, "utf-8");
            const extensionsData: ExtensionsJson = JSON.parse(extensionsJsonContent);

            // 收集所有插件信息
            const allExtensions: Record<string, ExtensionInfo> = {};

            // 处理 applications
            if (extensionsData.applications) {
                Object.assign(allExtensions, extensionsData.applications);
            }

            // 处理 functionals
            if (extensionsData.functionals) {
                Object.assign(allExtensions, extensionsData.functionals);
            }

            // 处理其他顶级键（如 buildingai-picmaster）
            for (const key in extensionsData) {
                if (key !== "applications" && key !== "functionals") {
                    const value = extensionsData[key];
                    if (
                        value &&
                        typeof value === "object" &&
                        "manifest" in value &&
                        !Array.isArray(value)
                    ) {
                        // 检查是否是单个 ExtensionInfo（有 manifest 属性）
                        if ("manifest" in value && "enabled" in value && "isLocal" in value) {
                            allExtensions[key] = value as ExtensionInfo;
                        }
                    }
                }
            }

            // 筛选启用的插件
            const enabledExtensions = Object.entries(allExtensions).filter(
                ([, info]) => info.enabled,
            );

            // 输出插件信息
            console.log(
                `  \x1b[36mℹ  Extensions Info:\x1b[0m        Found \x1b[33m${enabledExtensions.length}\x1b[0m enabled extension(s)`,
            );

            for (const [identifier, extensionInfo] of enabledExtensions) {
                const status = extensionInfo.isLocal ? "Local" : "Remote";
                const statusColor = extensionInfo.isLocal ? "\x1b[32m" : "\x1b[33m";
                console.log(
                    `  \x1b[32m✔  Extensions Info:\x1b[0m        ${extensionInfo.manifest.name} (\x1b[1m\x1b[36m${identifier}\x1b[0m) - ${statusColor}${status}\x1b[0m - v${extensionInfo.manifest.version}`,
                );
            }
            console.log(`                  `);
        } catch (error) {
            console.error(
                `  \x1b[31m✖  Extensions Info:\x1b[0m        Failed to parse extensions.json: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    },
});
