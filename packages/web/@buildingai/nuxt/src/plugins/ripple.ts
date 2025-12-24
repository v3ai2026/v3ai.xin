import Ripple from "../directives/ripple";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("ripple", Ripple);
});
