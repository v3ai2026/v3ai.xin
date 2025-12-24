import { Composer } from "vue-i18n";

/**
 * Extend Vue type to add global injection i18n methods
 */
declare module "vue" {
    interface ComponentCustomProperties {
        /**
         * Global translation function
         */
        $t: Composer["t"];
        /**
         * Global language selector
         */
        $locale: Composer["locale"];
    }
}

export {};
