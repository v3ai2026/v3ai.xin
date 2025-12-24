<script setup lang="ts">
import type { McpServerCreateParams, McpServerInfo } from "@buildingai/service/webapi/mcp-server";
import {
    apiCreateMcpServer,
    apiGetMcpServerDetail,
    apiJsonImportMcpServers,
    apiUpdateMcpServer,
} from "@buildingai/service/webapi/mcp-server";
import { object, string } from "yup";

const toast = useMessage();
const route = useRoute();

const props = defineProps<{
    id?: string | null;
    isView?: boolean;
    isJsonImport?: boolean;
    isSystemMcp?: boolean;
}>();
const emits = defineEmits<{
    (e: "close", refresh?: boolean): void;
    (e: "updateIds", value: string[]): void;
}>();

const mcpServerId = computed(() => props.id || (route.query.id as string) || null);
const { t } = useI18n();

const state = reactive({
    formData: {
        name: "",
        providerName: "",
        providerUrl: "",
        description: "",
        icon: "",
        url: "",
        communicationType: undefined,
        customHeaders: "",
    } as McpServerCreateParams,
    isSystem: false,
    jsonFormData: {
        jsonImport: "",
    },
});

const providerSchema = object({
    name: string().required(t("ai-mcp.backend.form.name")),
    url: string()
        .required(t("ai-mcp.backend.form.baseUrlPlaceholder"))
        .test("is-valid-url", t("ai-mcp.backend.form.baseUrlPlaceholder"), (value) => {
            if (!value) return false;
            if (
                /^(https?:\/\/)?[\w\d-]+(\.[\w\d-]+)+([\w\d\-.,@?^=%&:/~+#]*[\w\d=#])?$/.test(value)
            ) {
                return true;
            }
            try {
                new URL(value);
                return true;
            } catch (_e) {
                return false;
            }
        }),
    communicationType: string().required(t("ai-mcp.backend.form.communicationType")),
});

/**
 * JSON导入表单验证规则
 * 验证JSON格式及必填字段(url和type)
 */
const jsonImportSchema = object({
    jsonImport: string()
        .required(t("ai-mcp.backend.validation.jsonRequired"))
        .test("is-valid-json", t("ai-mcp.backend.validation.jsonFormatError"), (value) => {
            if (!value) return false;
            try {
                JSON.parse(value);
                return true;
            } catch (_e) {
                return false;
            }
        })
        .test("validate-required-fields", (value, context) => {
            if (!value) return true;

            try {
                const parsed = JSON.parse(value);

                if (!parsed.mcpServers || typeof parsed.mcpServers !== "object") {
                    return context.createError({
                        message: t("ai-mcp.backend.validation.missingMcpServers"),
                    });
                }

                const servers = parsed.mcpServers;
                const serverNames = Object.keys(servers);

                if (serverNames.length === 0) {
                    return context.createError({
                        message: t("ai-mcp.backend.validation.emptyMcpServers"),
                    });
                }

                // 检查每个服务器配置的必填字段
                for (const [serverName, config] of Object.entries(servers)) {
                    if (!config || typeof config !== "object") {
                        return context.createError({
                            message: `"${serverName}" ${t("ai-mcp.backend.validation.invalidConfig")}`,
                        });
                    }

                    const serverConfig = config as Record<string, unknown>;

                    // 检查 url 字段
                    if (!serverConfig.url) {
                        return context.createError({
                            message: `"${serverName}" ${t("ai-mcp.backend.validation.missingUrl")}`,
                        });
                    }

                    if (typeof serverConfig.url !== "string") {
                        return context.createError({
                            message: `"${serverName}" ${t("ai-mcp.backend.validation.invalidUrlType")}`,
                        });
                    }

                    // 检查 type 字段
                    if (!serverConfig.type) {
                        return context.createError({
                            message: `"${serverName}" ${t("ai-mcp.backend.validation.missingType")}`,
                        });
                    }

                    if (typeof serverConfig.type !== "string") {
                        return context.createError({
                            message: `"${serverName}" ${t("ai-mcp.backend.validation.invalidTypeValue")}`,
                        });
                    }

                    // 验证 type 字段的值是否合法
                    const validTypes = ["sse", "streamable-http"];
                    if (!validTypes.includes(serverConfig.type)) {
                        return context.createError({
                            message: `"${serverName}" ${t("ai-mcp.backend.validation.invalidTypeEnum")}`,
                        });
                    }

                    // headers 是可选的,如果存在则验证其格式
                    if (serverConfig.headers !== undefined) {
                        if (
                            typeof serverConfig.headers !== "object" ||
                            serverConfig.headers === null
                        ) {
                            return context.createError({
                                message: `"${serverName}" ${t("ai-mcp.backend.validation.invalidHeaders")}`,
                            });
                        }
                    }
                }

                return true;
            } catch (_e) {
                return context.createError({
                    message: t("console-ai-mcp-server.validation.jsonFormatError"),
                });
            }
        }),
});

const { lockFn: fetchDetail, isLock: detailLoading } = useLockFn(async () => {
    try {
        const data: McpServerInfo = await apiGetMcpServerDetail(mcpServerId.value as string);

        // 使用 Object.assign 批量赋值表单数据
        Object.assign(state.formData, {
            name: data.name || "",
            providerName: data.providerName || "",
            providerUrl: data.url || "",
            description: data.description || "",
            icon: data.icon || "",
            url: data.url || "",
            communicationType: data.communicationType,
        });

        // 特殊处理 customHeaders：如果是对象则转换为字符串
        const customHeadersValue = data.customHeaders;
        if (customHeadersValue !== undefined) {
            if (
                typeof customHeadersValue === "object" &&
                customHeadersValue !== null &&
                !Array.isArray(customHeadersValue)
            ) {
                // 将对象转换为 "key1=value1,key2=value2" 格式的字符串
                const headersStr = Object.entries(customHeadersValue as Record<string, string>)
                    .map(([k, v]) => `${k}=${v}`)
                    .join(",");
                state.formData.customHeaders = headersStr;
            } else if (typeof customHeadersValue === "string") {
                state.formData.customHeaders = customHeadersValue;
            } else {
                state.formData.customHeaders = "";
            }
        }
    } catch (error) {
        console.error("获取供应商详情失败:", error);
    }
});

/**
 * 解析自定义请求头字符串为键值对对象
 * @param headersStr - 格式为 "key1=value1,key2=value2" 或换行分隔的字符串
 * @returns 解析后的键值对对象
 */
const parseCustomHeaders = (headersStr?: string | null): Record<string, string> => {
    if (!headersStr?.trim()) return {};

    const headers: Record<string, string> = {};
    // 支持换行或逗号分隔
    const pairs = headersStr.split(/[,\n]/).filter((pair) => pair.trim());

    pairs.forEach((pair) => {
        const [key, ...valueParts] = pair.split("=");
        if (key?.trim() && valueParts.length > 0) {
            const value = valueParts.join("="); // 处理值中包含等号的情况
            headers[key.trim()] = value.trim();
        }
    });

    return headers;
};

const { lockFn: submitForm, isLock } = useLockFn(async () => {
    const { customHeaders, ...obj } = state.formData;
    const parsedHeaders = parseCustomHeaders(customHeaders as string);
    const newFormData: Omit<McpServerCreateParams, "args"> & {
        args?: Record<string, unknown>;
        customHeaders?: Record<string, string>;
    } = {
        ...obj,
        customHeaders: parsedHeaders,
    };

    try {
        const res = mcpServerId.value
            ? await apiUpdateMcpServer(mcpServerId.value, newFormData)
            : await apiCreateMcpServer(newFormData);

        toast.success(
            mcpServerId.value
                ? t("ai-mcp.backend.updateSuccess")
                : t("ai-mcp.backend.createSuccess"),
        );
        emits("close", true);
        emits("updateIds", [res.id]);
    } catch (error) {
        console.error("提交失败:", error);
    }
});

const { lockFn: jsonSubmitForm, isLock: _jsonIsLock } = useLockFn(async () => {
    try {
        const res = await apiJsonImportMcpServers(state.jsonFormData.jsonImport || "");
        const message = [
            `${t("ai-mcp.backend.jsonImportTotal")} ${res.total} ${t("ai-mcp.backend.jsonImportUnit")}`,
            `${t("console-common.create")} ${res.created} ${t("ai-mcp.backend.jsonImportUnit")}`,
            `${t("console-common.update")} ${res.updated} ${t("ai-mcp.backend.jsonImportUnit")}`,
        ].join("，");

        toast.success(message);
        emits("close", true);
        emits(
            "updateIds",
            res.results.map((item) => item.id),
        );
    } catch (error) {
        console.error("JSON导入失败:", error);
    }
});

const correctJson = `{
    "mcpServers": {
        "Your MCP Server Name": {
            "url": "xxxxx",
            // type: sse or streamable-http
            "type": "sse or streamable-http",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer Your Token"
                ...
            },
            ...
        }
    }
}`;

onMounted(async () => mcpServerId.value && (await fetchDetail()));
</script>

<template>
    <BdModal
        :title="
            isView && mcpServerId
                ? t('ai-mcp.backend.detailTitle')
                : mcpServerId
                  ? t('ai-mcp.backend.editTitle')
                  : t('ai-mcp.backend.addTitle')
        "
        :description="
            isView && mcpServerId
                ? t('ai-mcp.backend.detailTitle')
                : mcpServerId
                  ? t('ai-mcp.backend.editTitle')
                  : t('ai-mcp.backend.addTitle')
        "
        :ui="{
            content: 'max-w-2xl overflow-y-auto h-fit',
        }"
        @close="emits('close')"
    >
        <div v-if="detailLoading" class="flex items-center justify-center" style="height: 400px">
            <UIcon name="i-lucide-loader-2" class="size-8 animate-spin" />
        </div>

        <UForm
            v-else-if="!isJsonImport"
            :state="state.formData"
            :schema="providerSchema"
            :disabled="isView"
            @submit="submitForm"
        >
            <div class="pb-2">
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <UFormField :label="t('ai-mcp.backend.form.icon')" name="iconUrl">
                        <BdUploader
                            v-model="state.formData.icon"
                            class="h-24 w-24"
                            text="上传图标"
                            icon="i-lucide-upload"
                            accept=".jpg,.png,.svg,.ico"
                            :maxCount="1"
                            :single="true"
                            :multiple="false"
                            :disabled="state.isSystem"
                        />
                    </UFormField>

                    <div class="space-y-4">
                        <UFormField :label="t('ai-mcp.backend.form.name')" name="name" required>
                            <UInput
                                v-model="state.formData.name"
                                :disabled="state.isSystem"
                                :placeholder="t('ai-mcp.backend.form.name')"
                                :ui="{ root: 'w-full' }"
                            />
                        </UFormField>

                        <UFormField
                            :label="t('ai-mcp.backend.form.type')"
                            name="communicationType"
                            required
                        >
                            <USelect
                                v-model="state.formData.communicationType"
                                :placeholder="t('ai-mcp.backend.form.type')"
                                :ui="{ base: 'w-full' }"
                                :items="[
                                    { label: 'sse', value: 'sse' },
                                    { label: 'streamable-http', value: 'streamable-http' },
                                ]"
                            />
                        </UFormField>
                    </div>
                </div>
            </div>

            <div class="pb-2">
                <UFormField :label="t('ai-mcp.backend.form.baseUrl')" name="url" required>
                    <UTextarea
                        v-model="state.formData.url"
                        :rows="1"
                        autoresize
                        :disabled="state.isSystem"
                        :placeholder="t('ai-mcp.backend.form.url')"
                        :ui="{ root: 'w-full' }"
                    />
                </UFormField>
            </div>

            <div class="pb-2">
                <UFormField :label="t('ai-mcp.backend.form.description')" name="description">
                    <UTextarea
                        v-model="state.formData.description"
                        :disabled="state.isSystem"
                        :placeholder="t('ai-mcp.backend.form.descriptionPlaceholder')"
                        :rows="3"
                        :ui="{ root: 'w-full' }"
                    />
                </UFormField>
            </div>
            <UAccordion
                :items="[{}]"
                :ui="{
                    header: 'px-0 ',
                    label: 'text-lg font-semibold',
                    content: 'px-0',
                    body: 'flex flex-col gap-2',
                }"
            >
                <div class="flex items-center gap-2 text-base">
                    <Icon name="i-lucide-settings-2" />
                    {{ t("ai-mcp.backend.form.advancedArgs") }}
                </div>
                <template #body>
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <UFormField
                            :label="t('ai-mcp.backend.form.providerName')"
                            name="providerName"
                        >
                            <UInput
                                v-model="state.formData.providerName"
                                :disabled="state.isSystem"
                                :placeholder="t('ai-mcp.backend.form.providerName')"
                                :ui="{ root: 'w-full' }"
                            />
                        </UFormField>

                        <UFormField
                            :label="t('ai-mcp.backend.form.providerUrl')"
                            name="providerUrl"
                            class="col-span-2"
                        >
                            <UInput
                                v-model="state.formData.providerUrl"
                                :disabled="state.isSystem"
                                :placeholder="t('ai-mcp.backend.form.providerUrl')"
                                :ui="{ root: 'w-full' }"
                            />
                        </UFormField>

                        <!-- 请求头 -->
                        <UFormField
                            :label="t('ai-mcp.backend.form.headers')"
                            name="headers"
                            class="col-span-2"
                        >
                            <UTextarea
                                v-model="state.formData.customHeaders as string"
                                :placeholder="t('ai-mcp.backend.form.customHeadersPlaceholder')"
                                :ui="{ root: 'w-full' }"
                            />
                        </UFormField>
                    </div>
                </template>
            </UAccordion>

            <div class="bottom-0 z-10 flex justify-end gap-2 py-4" v-show="!isView">
                <UButton color="neutral" variant="soft" size="lg" @click="emits('close')">
                    {{ t("console-common.cancel") }}
                </UButton>
                <UButton color="primary" size="lg" type="submit" :loading="isLock">
                    {{ mcpServerId ? t("console-common.update") : t("console-common.create") }}
                </UButton>
            </div>
        </UForm>
        <UForm
            v-else
            :state="state.jsonFormData"
            :schema="jsonImportSchema"
            :disabled="isView"
            @submit="jsonSubmitForm"
        >
            <div class="pb-2">
                <UFormField :label="t('ai-mcp.backend.form.jsonImport')" name="jsonImport" required>
                    <UTextarea
                        v-model="state.jsonFormData.jsonImport"
                        :placeholder="t('ai-mcp.backend.form.jsonImportPlaceholder')"
                        :rows="13"
                        :ui="{ root: 'w-full' }"
                    />
                    <template #hint>
                        <UPopover mode="click" :open-delay="0" :close-delay="0">
                            <UButton variant="link" class="text-primary cursor-pointer text-xs">
                                {{ t("ai-mcp.backend.jsonImportExample") }}
                            </UButton>
                            <template #content>
                                <div class="flex flex-col gap-4 p-4">
                                    <div class="flex flex-col">
                                        <div class="flex flex-col items-start gap-2">
                                            <div
                                                class="flex items-start gap-1 rounded-lg bg-blue-50 p-2 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                                            >
                                                <UIcon size="20" name="i-tabler-alert-circle" />
                                                <span>{{
                                                    t("ai-mcp.backend.jsonImportCorrectExample")
                                                }}</span>
                                            </div>
                                            <pre
                                                class="bg-muted w-full overflow-x-auto rounded-lg p-4 text-sm"
                                            ><code>{{ correctJson }}</code></pre>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </UPopover>
                    </template>
                </UFormField>
            </div>

            <div class="bottom-0 z-10 flex justify-end gap-2 pt-4" v-show="!isView">
                <UButton color="neutral" variant="soft" size="lg" @click="emits('close')">
                    {{ t("console-common.cancel") }}
                </UButton>
                <UButton color="primary" size="lg" type="submit" :loading="isLock">
                    {{ mcpServerId ? t("console-common.update") : t("console-common.create") }}
                </UButton>
            </div>
        </UForm>
    </BdModal>
</template>
