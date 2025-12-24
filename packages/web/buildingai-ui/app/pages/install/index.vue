<script setup lang="ts">
import type { LanguageCode } from "@buildingai/i18n-config";
import { languageOptions } from "@buildingai/i18n-config";

import LogoFull from "../../../public/logo-full.svg";
import Step0 from "./components/step-0.vue";
import Step1 from "./components/step-1.vue";
import Step2 from "./components/step-2.vue";
import Step3 from "./components/step-3.vue";
import { useInstall } from "./use-install";

const { locale, setLocale } = useI18n();
const appStore = useAppStore();

const {
    adminForm,
    websiteForm,
    isSubmittingAdmin,
    isSubmittingWebsite,
    submitAdminInfo,
    submitWebsiteConfig,
    goToHome,
    goToConsole,
} = useInstall();

const currentStep = shallowRef(0);

function handleWelcomeNext() {
    currentStep.value = 1;
}

async function handleAdminSubmit() {
    const success = await submitAdminInfo();
    if (success) {
        currentStep.value = 2;
    }
}

async function handleWebsiteSubmit() {
    const success = await submitWebsiteConfig();
    if (success) {
        currentStep.value = 3;
    }
}

function handlePrevStep() {
    currentStep.value = 1;
}

function handleLanguage() {
    const code = locale.value as LanguageCode;
    setLocale(code);
}

definePageMeta({ layout: "full-screen", auth: false });
</script>

<template>
    <div class="bg-accent install-container flex h-full min-h-screen w-full p-4">
        <div
            class="bg-background install-container-box flex h-full w-full flex-col overflow-y-auto rounded-2xl p-4"
        >
            <div class="bg-background sticky top-0 flex items-center justify-between p-4">
                <div class="flex items-center gap-3">
                    <LogoFull class="text-foreground h-8" filled :fontControlled="false" />
                    <UBadge
                        v-if="appStore.siteConfig?.webinfo?.version"
                        color="primary"
                        variant="subtle"
                        size="sm"
                    >
                        v{{ appStore.siteConfig.webinfo?.version }}
                    </UBadge>
                </div>

                <div class="flex items-center">
                    <USelect
                        v-model="locale"
                        :items="languageOptions"
                        label-key="name"
                        value-key="code"
                        size="lg"
                        icon="i-lucide-globe"
                        variant="outline"
                        @change="handleLanguage"
                    >
                    </USelect>
                </div>
            </div>

            <div
                v-if="currentStep === 0"
                class="mx-auto flex max-w-4xl flex-1 flex-col justify-center px-4"
            >
                <Step0 @next="handleWelcomeNext" />
            </div>

            <div v-else class="mx-auto flex w-md max-w-4xl flex-1 flex-col px-4">
                <Step1
                    v-if="currentStep === 1"
                    v-model="adminForm"
                    :loading="isSubmittingAdmin"
                    @submit="handleAdminSubmit"
                />

                <Step2
                    v-if="currentStep === 2"
                    v-model="websiteForm"
                    :loading="isSubmittingWebsite"
                    @submit="handleWebsiteSubmit"
                    @prev="handlePrevStep"
                />

                <Step3 v-if="currentStep === 3" @go-home="goToHome" @go-console="goToConsole" />
            </div>

            <!-- Bottom Footer -->
            <div class="text-muted-foreground mt-auto text-left text-sm">
                <p>© {{ new Date().getFullYear() }} Building AI. All rights reserved.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.install-container-box {
    scrollbar-width: none;
}
.install-container-box::-webkit-scrollbar {
    display: none;
}
</style>
