/**
 * Console Layout Components
 * @description Backend console layout components
 */

// Export console layouts
export { default as MixtureLayout } from "./mixture/index.vue";
export { default as PluginLayout } from "./plugins/index.vue";
export { default as SidebarLayout } from "./sidebar/index.vue";

// Export types and utilities for plugins
export type { NavigationItem, PluginMenuItem } from "./plugins/menu";
export { transformMenuToNavigation, transformMenuToRoutes } from "./plugins/menu";

// Export console components
export { default as ButtonFullScreen } from "./components/button-full-screen.vue";
export { default as ButtonGoHome } from "./components/button-go-home.vue";
export { default as ButtonReload } from "./components/button-reload.vue";
export { default as ButtonSearch } from "./components/button-search-input.vue";
export { default as MainPage } from "./components/main-page.vue";
export { default as SearchModal } from "./components/search-modal.vue";
export { default as SiteLogo } from "./components/site-logo.vue";
export { default as UserMenu } from "./components/user-menu.vue";
export { default as MixtureHeader } from "./mixture/header.vue";
export { default as MixtureSidebar } from "./mixture/sidebar.vue";
export { default as Sidebar } from "./sidebar/sidebar.vue";
export { default as SidebarNavbar } from "./sidebar/sidebar-navbar.vue";
export { default as SidebarTrigger } from "./sidebar/sidebar-trigger.vue";
