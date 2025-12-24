/// <reference types="vite/client" />

// Declare Vue SFC modules
declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<object, object, any>;
    export default component;
}

// Declare @buildingai/ui/bd-modal-use module
declare module "@buildingai/ui/bd-modal-use" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<object, object, any>;
    export default component;
}
