/// <reference types="vite/client" />

// Declare Vue SFC modules
declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<object, object, any>;
    export default component;
}

// Declare the image file module
declare module "*.png" {
    const src: string;
    export default src;
}

declare module "*.jpg" {
    const src: string;
    export default src;
}

declare module "*.jpeg" {
    const src: string;
    export default src;
}

declare module "*.gif" {
    const src: string;
    export default src;
}

declare module "*.svg" {
    const src: string;
    export default src;
}

declare module "*.svg?raw" {
    const content: string;
    export default content;
}

declare module "*.webp" {
    const src: string;
    export default src;
}
