<script lang="ts" setup>
import type { WebsiteStatistics } from "@buildingai/service/common";
import type { UpdateWebsiteRequest, WebsiteConfig } from "@buildingai/service/consoleapi/website";
import {
    apiGetWebsiteConfig,
    apiUpdateWebsiteConfig,
} from "@buildingai/service/consoleapi/website";
import { useI18n } from "vue-i18n";
import { object, string } from "yup";

const { t } = useI18n();
const message = useMessage();

const state = shallowReactive<WebsiteStatistics>({
    appid: "",
});

const websiteConfig = shallowRef<WebsiteConfig | null>(null);

const schema = object({
    appid: string()
        .required(t("system.website.statistics.appid.required"))
        .min(5, t("system.website.statistics.appid.minLength"))
        .max(50, t("system.website.statistics.appid.maxLength")),
});

const { lockFn: getWebsiteConfig, isLock: isLoadingConfig } = useLockFn(async () => {
    try {
        const config = await apiGetWebsiteConfig();
        websiteConfig.value = config;

        useFormData(state, config.statistics);
    } catch (error) {
        console.error("Get website config failed:", error);
        message.error(t("system.website.messages.loadFailed"));
    }
});

const { lockFn: onSubmit, isLock } = useLockFn(async () => {
    try {
        const updateData: UpdateWebsiteRequest = {
            statistics: {
                appid: state.appid,
            },
        };

        await apiUpdateWebsiteConfig(updateData);
        message.success(t("system.website.messages.saveSuccess"));

        await getWebsiteConfig();
    } catch (error) {
        console.error("Save failed:", error);
        message.error(t("system.website.messages.saveFailed"));
    }
});

const resetForm = () => {
    if (websiteConfig.value) {
        useFormData(state, websiteConfig.value.statistics);
        message.info(t("system.website.messages.resetSuccess"));
    } else {
        state.appid = "";
        message.info(t("system.website.messages.resetEmpty"));
    }
};

onMounted(() => getWebsiteConfig());
</script>

<template>
    <div class="statistics-container mt-8">
        <!-- 表单 -->
        <UForm
            :schema="schema"
            :state="state"
            class="mx-auto lg:max-w-2xl xl:max-w-4xl"
            @submit="onSubmit"
        >
            <div class="mb-6">
                <UFormField
                    name="appid"
                    :label="t('system.website.statistics.appid.label')"
                    required
                >
                    <template #description>
                        {{ t("system.website.statistics.clarity.linkLabel") }}:
                        <a
                            href="https://clarity.microsoft.com"
                            class="text-primary"
                            target="_blank"
                        >
                            Microsoft Clarity
                            <Icon name="i-lucide-external-link"></Icon>
                        </a>
                    </template>
                    <UInput
                        v-model="state.appid"
                        size="xl"
                        :ui="{ root: 'w-full' }"
                        :placeholder="t('system.website.statistics.appid.placeholder')"
                    />
                </UFormField>
            </div>

            <!-- <div class="mb-6 rounded-lg bg-gray-50 p-4">
                <div class="flex items-start">
                    <UIcon
                        name="i-heroicons-information-circle"
                        class="text-primary-500 mt-0.5 mr-2"
                    />
                    <div>
                        <p class="text-sm text-gray-700">
                            {{ t("system.website.statistics.info.title") }}
                        </p>
                        <p class="text-muted-foreground mt-1 text-xs">
                            {{ t("system.website.statistics.info.description") }}
                        </p>
                    </div>
                </div>
            </div> -->

            <div class="flex space-x-3">
                <AccessControl :codes="['system-website:setConfig']">
                    <UButton
                        type="submit"
                        color="primary"
                        :loading="isLock"
                        :disabled="isLock || isLoadingConfig"
                    >
                        {{
                            isLock
                                ? t("system.website.actions.saving")
                                : t("system.website.actions.saveConfig")
                        }}
                    </UButton>
                </AccessControl>
                <UButton
                    type="button"
                    color="neutral"
                    variant="outline"
                    :disabled="isLock || isLoadingConfig"
                    @click="resetForm"
                >
                    {{ t("system.website.actions.reset") }}
                </UButton>
            </div>
        </UForm>
    </div>
</template>
