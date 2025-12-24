<script setup lang="ts">
import type { SecretConfigRequest } from "@buildingai/service/consoleapi/secret-list";
import { getSecretDetail } from "@buildingai/service/consoleapi/secret-list";
import type { FieldConfig } from "@buildingai/service/consoleapi/secret-template";
import {
    getSecretTemplateDetail,
    getSecretTemplateListAll,
} from "@buildingai/service/consoleapi/secret-template";
import { object, string } from "yup";

const props = defineProps<{
    id?: string;
}>();

const emits = defineEmits<{
    (e: "close", refresh?: boolean): void;
    (e: "submit", formData: SecretConfigRequest, id?: string): void;
}>();

const { t } = useI18n();
const router = useRouter();

const typeOptions = shallowRef<
    {
        label: string;
        value: string;
    }[]
>([]);
const customFieldOptions = shallowRef<FieldConfig[]>([]);
const formData = shallowReactive<SecretConfigRequest>({
    name: "",
    templateId: undefined,
    fieldValues: [],
    remark: "",
    status: 1,
    sortOrder: 0,
});
const isTemplateId = shallowRef<boolean>(false);

const schema = computed(() => {
    // 基础schema定义
    const baseSchema = {
        name: string().trim().required(t("ai-secret.backend.list.edit.keyTypeRequired")),
        templateId: string().trim().required(t("ai-secret.backend.list.edit.keyTypeRequired")),
        remark: string(),
    };

    if (customFieldOptions.value && customFieldOptions.value.length > 0) {
        customFieldOptions.value.forEach((field, index) => {
            if (!field.required) return;
            // 使用字段名作为验证键，如果重复则添加索引
            const fieldKey = field.name || `customField_${index}`;

            baseSchema[fieldKey as keyof typeof baseSchema] = string().required(
                t("ai-secret.backend.list.edit.fieldRequired") + field.name,
            );
        });
    }

    return object(baseSchema);
});

const initDynamicFields = () => {
    if (customFieldOptions.value && customFieldOptions.value.length > 0) {
        customFieldOptions.value.forEach((field) => {
            if (field.name) {
                // 动态添加字段到formData，如果字段不存在才初始化为空字符串
                if (!(field.name in formData)) {
                    formData[field.name] = "";
                }
            }
        });
    }
};

const fetchDetail = async () => {
    try {
        const data: SecretConfigRequest = await getSecretDetail(props.id as string);

        // 填充基础字段
        formData.name = data.name || "";
        formData.remark = data.remark || "";
        formData.status = data.status || 1;
        formData.sortOrder = data.sortOrder || 0;

        // 检查templateId是否在可用选项中
        const templateExists = typeOptions.value.some((option) => option.value === data.templateId);
        isTemplateId.value = templateExists;
        if (templateExists) {
            formData.templateId = data.templateId;
        } else {
            // 如果模板不存在，清除templateId
            formData.templateId = undefined;
        }

        // 处理动态字段值
        if (data.fieldValues && Array.isArray(data.fieldValues)) {
            data.fieldValues.forEach((field) => {
                if (field.name && field.value !== undefined) {
                    // 将动态字段值赋值到formData对象上
                    (formData as Record<string, unknown>)[field.name] = field.value;
                }
            });
        }
    } catch (error) {
        console.error("获取API密钥详情失败:", error);
    }
};

// 获取所有启用的模板
const getEnabledTemplates = async () => {
    const res = await getSecretTemplateListAll();
    res.forEach((item) => {
        typeOptions.value.push({
            label: item.name,
            value: item.id || "",
        });
    });
    if (!props.id) {
        formData.templateId = typeOptions.value[0]?.value;
    } else {
        console.log(formData.templateId);
    }

    if (formData.templateId) {
        handleTypeChange(formData.templateId);
    }
};

const goToApiKeyManage = () => {
    emits("close");
    router.push({
        path: useRoutePath("secret-templates:list"),
    });
};

const handleTypeChange = async (value: string) => {
    const res = await getSecretTemplateDetail(value);
    customFieldOptions.value = res.fieldConfig;
    // 重新初始化动态字段
    initDynamicFields();
};

const handleSubmit = () => {
    // 确保包含所有自定义字段，即使值为空
    const dynamicFieldValues = customFieldOptions.value.map((field) => {
        return {
            name: field.name || "",
            value: String(formData[field.name || ""] || ""),
        };
    });

    const newFormData = {
        name: formData.name,
        templateId: formData.templateId,
        remark: formData.remark,
        status: formData.status,
        sortOrder: formData.sortOrder,
        fieldValues: dynamicFieldValues,
    };

    if (props.id) {
        emits("submit", newFormData, props.id);
    } else {
        emits("submit", newFormData);
    }
    emits("close");
};

onMounted(async () => {
    initDynamicFields();
    await getEnabledTemplates();
    if (props.id) {
        await fetchDetail();
    }
    await handleTypeChange(formData.templateId || "");
});
</script>
<template>
    <BdModal
        :title="props.id ? t('ai-secret.backend.list.edit.title') : t('ai-secret.backend.list.add')"
        :ui="{
            content: 'max-w-2xl overflow-y-auto h-fit',
        }"
        @close="emits('close')"
    >
        <UForm :state="formData" :schema="schema" class="space-y-4" @submit="handleSubmit">
            <div class="grid grid-cols-2 items-center gap-4">
                <UFormField :label="t('ai-secret.backend.list.edit.name')" name="name" required>
                    <UInput
                        v-model="formData.name"
                        :placeholder="t('ai-secret.backend.list.edit.nameRequired')"
                        class="w-full"
                    />
                </UFormField>
                <UFormField
                    :label="t('ai-secret.backend.list.edit.keyType')"
                    name="templateId"
                    required
                >
                    <template #hint>
                        <UButton
                            variant="link"
                            class="cursor-pointer gap-0 p-0"
                            trailing-icon="i-lucide-arrow-right"
                            :ui="{ trailingIcon: 'size-4' }"
                            @click="goToApiKeyManage()"
                        >
                            {{ t("ai-secret.backend.type.addType") }}
                        </UButton>
                    </template>
                    <USelectMenu
                        v-if="typeOptions.length > 0"
                        v-model="formData.templateId"
                        :items="typeOptions"
                        label-key="label"
                        value-key="value"
                        :placeholder="t('ai-secret.backend.list.edit.keyTypeRequired')"
                        class="w-full"
                        @update:model-value="handleTypeChange"
                    />
                </UFormField>
            </div>
            <UFormField
                v-for="item in customFieldOptions"
                :key="item.name"
                :label="item.name"
                :name="item.name"
                :required="item.required"
            >
                <template v-if="item.name === 'baseUrl'" #hint>
                    <UPopover mode="hover" :open-delay="0">
                        <span
                            class="text-muted-foreground inline-flex cursor-help items-center gap-1"
                        >
                            <UIcon name="i-lucide-help-circle" class="size-3.5" />
                            <span class="text-xs">{{
                                t("ai-secret.backend.list.edit.baseUrlHelp")
                            }}</span>
                        </span>
                        <template #content>
                            <div class="max-w-100 space-y-3 p-3">
                                <div class="space-y-2">
                                    <h4 class="text-sm font-semibold">
                                        {{ t("ai-secret.backend.list.edit.baseUrlHelpTitle") }}
                                    </h4>
                                    <div class="text-muted-foreground space-y-2 text-xs">
                                        <p>
                                            {{ t("ai-secret.backend.list.edit.baseUrlHelpDesc") }}
                                        </p>
                                        <div class="space-y-1">
                                            <div class="font-medium">
                                                {{
                                                    t("ai-secret.backend.list.edit.baseUrlExample")
                                                }}:
                                            </div>
                                            <div class="bg-muted rounded p-2 font-mono text-xs">
                                                <div class="text-success">
                                                    ✓
                                                    {{
                                                        t(
                                                            "ai-secret.backend.list.edit.baseUrlCorrect",
                                                        )
                                                    }}
                                                </div>
                                                <div class="text-muted-foreground text-xs">
                                                    https://api.openai.com/v1
                                                </div>
                                            </div>
                                            <div class="bg-muted rounded p-2 font-mono text-xs">
                                                <div class="text-error">
                                                    ✗
                                                    {{
                                                        t(
                                                            "ai-secret.backend.list.edit.baseUrlIncorrect",
                                                        )
                                                    }}
                                                </div>
                                                <div class="text-muted-foreground text-xs">
                                                    https://api.openai.com/v1/chat/completions
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mt-3 rounded bg-blue-50 p-2">
                                            <div class="mb-1 text-xs font-medium text-blue-600">
                                                {{
                                                    t(
                                                        "ai-secret.backend.list.edit.openaiFormatNote",
                                                    )
                                                }}
                                            </div>
                                            <div class="text-xs text-blue-600">
                                                {{
                                                    t(
                                                        "ai-secret.backend.list.edit.openaiFormatDesc",
                                                    )
                                                }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </UPopover>
                </template>
                <UInput
                    v-if="item.type === 'number'"
                    v-model="formData[item.name]"
                    type="number"
                    :placeholder="item.placeholder"
                    class="w-full"
                />
                <UInput
                    v-else-if="item.type === 'text'"
                    v-model="formData[item.name]"
                    :placeholder="item.placeholder"
                    class="w-full"
                />
                <UTextarea
                    v-else
                    v-model="formData[item.name]"
                    :placeholder="item.placeholder"
                    class="w-full"
                />
            </UFormField>
            <UFormField :label="t('ai-secret.backend.list.edit.remark')" name="remark">
                <UTextarea
                    v-model="formData.remark"
                    :placeholder="t('ai-secret.backend.list.edit.remarkRequired')"
                    class="w-full"
                />
            </UFormField>
            <!-- 底部按钮 -->
            <div class="mt-6 flex justify-end gap-2">
                <UButton color="neutral" variant="soft" @click="emits('close')">
                    {{ t("console-common.cancel") }}
                </UButton>
                <UButton color="primary" type="submit">{{ t("console-common.save") }}</UButton>
            </div>
        </UForm>
    </BdModal>
</template>
