<script setup lang="ts">
const { t } = useI18n();

/**
 * Component emits
 */
interface Emits {
    (e: "goHome"): void;
    (e: "goConsole"): void;
}

const emit = defineEmits<Emits>();
</script>

<template>
    <div class="flex h-full flex-col items-center justify-center py-8">
        <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            {{ t("install.completeTitle") }}
        </h2>
        <p class="text-muted-foreground mb-8 text-base">
            {{ t("install.completeDescription") }}
        </p>

        <div class="flex flex-col justify-center gap-3 sm:flex-row">
            <UButton
                size="lg"
                variant="outline"
                leading-icon="i-lucide-home"
                @click="emit('goHome')"
            >
                {{ t("install.goToHome") }}
            </UButton>
            <UButton size="lg" leading-icon="i-lucide-layout-dashboard" @click="emit('goConsole')">
                {{ t("install.goToConsole") }}
            </UButton>
        </div>
    </div>
</template>
