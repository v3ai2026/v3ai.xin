import VueDOMPurifyHTML from "vue-dompurify-html";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueDOMPurifyHTML, {
        namedConfigurations: {
            plaintext: {
                USE_PROFILES: { html: false },
            },
            // Markdown rendering configuration: Allow the style attribute to retain Shiki inline styles
            markdown: {
                ADD_ATTR: ["style"],
            },
        },
    });
});
