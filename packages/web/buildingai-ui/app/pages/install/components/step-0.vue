<script setup lang="ts">
import TrueFocus from "./true-focus.vue";

const emit = defineEmits<{
    (e: "next"): void;
}>();

const { t } = useI18n();

function handleNext() {
    emit("next");
}
</script>

<template>
    <div class="flex w-full flex-col items-center justify-center py-12">
        <div class="mb-12 text-center">
            <div class="mb-6 text-5xl font-bold">
                <TrueFocus
                    :sentence="t('install.welcome.title')"
                    :manual-mode="false"
                    :blur-amount="5"
                    border-color="var(--color-primary)"
                    :animation-duration="1"
                    :pause-between-animations="1"
                />
            </div>
            <p class="text-muted-foreground mx-auto max-w-2xl text-lg">
                {{ t("install.welcome.subtitle") }}
            </p>
        </div>

        <div class="flex items-center justify-center gap-4">
            <UButton
                size="xl"
                variant="outline"
                tag="a"
                href="https://www.buildingai.cc/docs/introduction/start"
                target="_blank"
            >
                {{ t("install.welcome.viewDocs") }}
                <UIcon name="i-lucide-external-link" />
            </UButton>
            <UButton size="xl" @click="handleNext">
                {{ t("install.welcome.startButton") }}
                <UIcon name="i-lucide-arrow-right" />
            </UButton>
        </div>
    </div>
</template>
