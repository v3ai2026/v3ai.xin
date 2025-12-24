import { fileURLToPath } from "node:url";

import { defineBuildingAIConfig } from "@buildingai/nuxt";
import tailwindcss from "@tailwindcss/vite";
import type { PluginOption } from "vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineBuildingAIConfig({
    ssr: process.env.NUXT_BUILD_SSR === "true",

    pages: {
        pattern: ["!console/**/*.*"],
    },

    components: [
        {
            path: "components",
            pathPrefix: false,
            global: false,
            watch: false,
        },
    ],

    app: {
        head: {
            viewport: "width=device-width,initial-scale=1",
            meta: [
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1",
                },
                {
                    name: "apple-mobile-web-app-status-bar-style",
                    content: "black-translucent",
                },
                {
                    name: "theme-color",
                    media: "(prefers-color-scheme: light)",
                    content: "#ffffff",
                },
                {
                    name: "theme-color",
                    media: "(prefers-color-scheme: dark)",
                    content: "#222222",
                },
            ],
        },

        rootAttrs: {
            "data-vaul-drawer-wrapper": "true",
        },
    },

    css: ["assets/styles/globals.css"],

    spaLoadingTemplate: "../public/spa-loading-template.html",

    alias: {
        "@": fileURLToPath(new URL("./app", import.meta.url)),
        "~": fileURLToPath(new URL("./app", import.meta.url)),
    },

    devServer: {
        port: 4091,
    },
    compatibilityDate: "2025-10-28",

    vite: {
        plugins: [tailwindcss() as PluginOption],
        optimizeDeps: {
            include:
                process.env.NUXT_BUILD_ENV === "development"
                    ? ["panzoom", "qrcode.vue", "vue-drag-resize", "libphonenumber-js"]
                    : [],
        },
    },

    // https://nuxt.com/modules/icon
    icon: {
        // use custom collections to add svgs to the icon library
        // <Icon name="bd:xxxx" />
        customCollections: [
            {
                prefix: "bd",
                dir: "app/assets/icons",
            },
            {
                prefix: "system",
                dir: "public",
            },
        ],
    },
});
