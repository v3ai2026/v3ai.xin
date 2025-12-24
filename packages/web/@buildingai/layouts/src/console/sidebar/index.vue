<script setup lang="ts">
const MainPage = defineAsyncComponent(() => import("../components/main-page.vue"));
const Sidebar = defineAsyncComponent(() => import("./sidebar.vue"));
const SidebarNavbar = defineAsyncComponent(() => import("./sidebar-navbar.vue"));

const collapsed = shallowRef<boolean>(false);
const mobileMenu = shallowRef<boolean>(false);

const toggleSidebar = () => {
    collapsed.value = !collapsed.value;
};

const openMobileMenu = () => {
    mobileMenu.value = true;
};
</script>

<template>
    <div class="bg-sidebar flex h-screen w-full overflow-hidden">
        <div class="app-sidebar">
            <Sidebar :collapsed="collapsed" v-model:mobile-menu="mobileMenu" />
        </div>
        <div
            class="bg-background m-0 flex min-w-0 flex-1 flex-col items-center shadow-lg md:m-2 md:ml-0 md:rounded-xl"
        >
            <SidebarNavbar
                :collapsed="collapsed"
                :mobile-menu="mobileMenu"
                @toggle="toggleSidebar"
                @open-mobile-menu="openMobileMenu"
            />
            <MainPage layout="sidebar" />
        </div>
    </div>
</template>
