<script lang="ts" setup>
import type { WebsiteCopyright } from "@buildingai/service/common";
import type { UpdateWebsiteRequest, WebsiteConfig } from "@buildingai/service/consoleapi/website";
import {
    apiGetWebsiteConfig,
    apiUpdateWebsiteConfig,
} from "@buildingai/service/consoleapi/website";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { object, string } from "yup";

const { t } = useI18n();
const message = useMessage();

const state = shallowReactive<WebsiteCopyright>({
    displayName: "",
    iconUrl: "",
    url: "",
});

const websiteConfig = shallowRef<WebsiteConfig | null>(null);

const schema = object({
    displayName: string().required(t("system.website.copyright.displayName.required")),
    iconUrl: string().required(t("system.website.copyright.icon.required")),
    url: string().required(t("system.website.copyright.url.required")),
});

const { lockFn: getWebsiteConfig, isLock: isLoadingConfig } = useLockFn(async () => {
    try {
        const config = await apiGetWebsiteConfig();
        websiteConfig.value = config;

        useFormData(state, config.copyright);
    } catch (error) {
        console.error("Get website config failed:", error);
        message.error(t("system.website.messages.loadFailed"));
    }
});

const { lockFn: onSubmit, isLock } = useLockFn(async () => {
    try {
        // 构建更新数据，只传递版权部分
        const updateData: UpdateWebsiteRequest = {
            copyright: {
                displayName: state.displayName,
                iconUrl: state.iconUrl,
                url: state.url,
            },
        };

        await apiUpdateWebsiteConfig(updateData);
        message.success(t("system.website.messages.saveSuccess"));

        // 重新获取配置以确保数据同步
        await getWebsiteConfig();
    } catch (error) {
        console.error("Save failed:", error);
        message.error(t("system.website.messages.saveFailed"));
    }
});

const resetForm = () => {
    if (websiteConfig.value) {
        state.displayName = websiteConfig.value.copyright.displayName || "";
        state.iconUrl = websiteConfig.value.copyright.iconUrl || "";
        state.url = websiteConfig.value.copyright.url || "";
        message.info(t("system.website.messages.resetSuccess"));
    } else {
        state.displayName = "";
        state.iconUrl = "";
        state.url = "";
        message.info(t("system.website.messages.resetEmpty"));
    }
};

onMounted(() => getWebsiteConfig());
</script>

<template>
    <div class="copyright-container mt-8">
        <!-- 表单 -->
        <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
            <UFormField
                name="displayName"
                :label="t('system.website.copyright.displayName.label')"
                required
            >
                <UInput
                    v-model="state.displayName"
                    size="lg"
                    :ui="{ root: 'w-full' }"
                    :placeholder="t('system.website.copyright.displayName.placeholder')"
                />
            </UFormField>

            <UFormField name="iconUrl" :label="t('system.website.copyright.icon.label')" required>
                <div class="flex items-start gap-4">
                    <BdUploader
                        v-model="state.iconUrl"
                        class="h-24 w-24"
                        :text="t('system.website.copyright.icon.upload')"
                        icon="i-lucide-upload"
                        accept=".jpg,.png,.jpeg"
                        :maxCount="1"
                        :single="true"
                    />
                </div>
            </UFormField>

            <UFormField name="url" :label="t('system.website.copyright.url.label')" required>
                <UInput
                    v-model="state.url"
                    size="lg"
                    :ui="{ root: 'w-full' }"
                    :placeholder="t('system.website.copyright.url.placeholder')"
                />
            </UFormField>

            <div class="flex space-x-3 pt-4">
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
                                : t("system.website.actions.saveChanges")
                        }}
                    </UButton>
                </AccessControl>
                <UButton
                    type="reset"
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
