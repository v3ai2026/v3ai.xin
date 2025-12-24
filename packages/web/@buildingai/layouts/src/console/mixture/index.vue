<script setup lang="ts">
const MainPage = defineAsyncComponent(() => import("../components/main-page.vue"));
const MixtureHeader = defineAsyncComponent(() => import("./header.vue"));
const MixtureSidebar = defineAsyncComponent(() => import("./sidebar.vue"));

const collapsed = ref<boolean>(false);

const toggleSidebar = () => {
    collapsed.value = !collapsed.value;
};
</script>

<template>
    <div class="flex h-screen w-full flex-col overflow-hidden">
        <div class="w-full flex-none">
            <MixtureHeader :collapsed="collapsed" @toggle="toggleSidebar" />
        </div>

        <div class="flex w-full flex-1 overflow-hidden">
            <div class="flex-none">
                <MixtureSidebar :collapsed="collapsed" />
            </div>

            <div class="flex min-h-0 w-full flex-1 flex-col items-center">
                <MainPage layout="mixture" />
            </div>
        </div>
    </div>
</template>
