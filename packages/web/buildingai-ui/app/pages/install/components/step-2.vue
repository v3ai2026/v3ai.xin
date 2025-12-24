<script setup lang="ts">
import type { WebsiteInfo } from "@buildingai/service/common";
import { apiUploadInitFile } from "@buildingai/service/common";
import * as yup from "yup";

const props = withDefaults(
    defineProps<{
        modelValue: WebsiteInfo;
        loading?: boolean;
    }>(),
    {
        loading: false,
    },
);

const emit = defineEmits<{
    (e: "update:modelValue", value: WebsiteInfo): void;
    (e: "submit"): void;
    (e: "prev"): void;
}>();

const { t } = useI18n();
const formData = useVModel(props, "modelValue", emit);

const form = useTemplateRef("form");

const schema = yup.object({
    name: yup.string().required(t("install.validation.websiteNameRequired")),
});

async function handleSubmit() {
    const isValid = await form.value?.validate();
    if (isValid) {
        emit("submit");
    }
}

function handlePrev() {
    emit("prev");
}
</script>

<template>
    <div class="w-full py-6">
        <div class="mb-8">
            <h1 class="text-foreground text-2xl font-bold">
                {{ t("install.steps.website.title") }}
            </h1>
            <p class="text-muted-foreground mt-2 text-sm">
                {{ t("install.steps.website.description") }}
            </p>
        </div>
        <UForm ref="form" :state="formData" :schema="schema" @submit="handleSubmit">
            <div class="space-y-5">
                <!-- Website Name -->
                <UFormField
                    :label="t('install.websiteName')"
                    name="name"
                    required
                    :hint="t('install.websiteNameDescription')"
                >
                    <UInput
                        v-model="formData.name"
                        :placeholder="t('install.websiteNamePlaceholder')"
                        size="lg"
                        :ui="{ root: 'w-full', base: 'bg-accent' }"
                        variant="soft"
                    >
                        <template #leading>
                            <UIcon name="i-lucide-globe" />
                        </template>
                    </UInput>
                </UFormField>

                <!-- Website Description -->
                <UFormField
                    :label="t('install.websiteDescription')"
                    name="description"
                    :hint="t('install.websiteDescriptionHint')"
                >
                    <UTextarea
                        v-model="formData.description"
                        :placeholder="t('install.websiteDescriptionPlaceholder')"
                        :rows="3"
                        size="lg"
                        :ui="{ base: 'bg-accent w-full', root: 'w-full' }"
                        variant="soft"
                    />
                </UFormField>

                <!-- Website Logo -->
                <UFormField
                    :label="t('install.websiteLogo')"
                    name="logo"
                    :hint="t('install.websiteLogoDescription')"
                >
                    <BdUploader
                        v-model="formData.logo"
                        class="h-24 w-24"
                        :text="t('install.uploadLogo')"
                        icon="i-lucide-upload"
                        accept=".jpg,.png,.jpeg"
                        :max-count="1"
                        :single="true"
                        :upload-api="apiUploadInitFile"
                    />
                </UFormField>

                <!-- Website Icon -->
                <UFormField
                    :label="t('install.websiteIcon')"
                    name="icon"
                    :hint="t('install.websiteIconDescription')"
                >
                    <BdUploader
                        v-model="formData.icon"
                        class="h-24 w-24"
                        :text="t('install.uploadIcon')"
                        icon="i-lucide-upload"
                        accept=".jpg,.png,.jpeg,.ico"
                        :max-count="1"
                        :single="true"
                        :upload-api="apiUploadInitFile"
                    />
                </UFormField>

                <!-- Action Buttons -->
                <div class="flex justify-between pt-4">
                    <UButton
                        variant="outline"
                        size="lg"
                        leading-icon="i-lucide-arrow-left"
                        @click="handlePrev"
                    >
                        {{ t("install.prevStep") }}
                    </UButton>
                    <UButton
                        type="submit"
                        size="lg"
                        trailing-icon="i-lucide-arrow-right"
                        :loading="loading"
                        :disabled="loading"
                    >
                        {{ t("install.nextStep") }}
                    </UButton>
                </div>
            </div>
        </UForm>
    </div>
</template>
