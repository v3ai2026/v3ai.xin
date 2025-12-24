<script setup lang="ts">
import type { WebsiteCopyright } from "@buildingai/service/common";
import { computed } from "vue";

const props = defineProps<{ copyright?: WebsiteCopyright[] }>();

const copyrightList = computed(() => props.copyright || []);
</script>

<template>
    <footer class="footer-copyright flex items-center justify-center gap-4 py-4">
        <template v-for="item in copyrightList" :key="item.url">
            <a
                class="hover:text-primary-500 flex items-center gap-1 text-xs text-gray-500 transition-colors"
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
            >
                <NuxtImg
                    v-if="item.iconUrl"
                    :src="item.iconUrl"
                    :alt="item.displayName"
                    class="inline-block h-4 w-4 align-middle"
                />
                <span>{{ item.displayName }}</span>
            </a>
        </template>
    </footer>
</template>
