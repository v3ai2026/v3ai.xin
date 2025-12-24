<script setup lang="ts">
import type { SecretTemplateFormData } from "@buildingai/service/consoleapi/secret-template";
import { getSecretTemplateDetail } from "@buildingai/service/consoleapi/secret-template";
import { useI18n } from "vue-i18n";
import { array, number, object, string } from "yup";

const props = defineProps<{
    id?: string;
    isJsonImport?: boolean;
}>();

const emits = defineEmits<{
    (e: "close", refresh?: boolean): void;
    (e: "submit", data: SecretTemplateFormData, id?: string): void;
    (e: "json-submit", data: string): void;
}>();

const { t } = useI18n();
const toast = useMessage();
const { copy } = useClipboard();

const formData = reactive<SecretTemplateFormData>({
    icon: "",
    name: "",
    isEnabled: 1,
    fieldConfig: [
        {
            name: "",
            type: "text",
            required: true,
            placeholder: "",
        },
    ],
    type: "",
});
const jsonFormData = shallowReactive({
    jsonImport: "",
});

const isValidationTriggered = shallowRef(false);

const columns = computed(() => [
    {
        accessorKey: "name",
        header: () =>
            h("span", [
                t("ai-secret.backend.type.edit.fieldName"),
                h("span", { class: "text-error ml-1" }, "*"),
            ]),
    },
    {
        accessorKey: "type",
        header: () =>
            h("span", [
                t("ai-secret.backend.type.edit.fieldType"),
                h("span", { class: "text-error ml-1" }, "*"),
            ]),
    },
    {
        accessorKey: "example",
        header: () =>
            h("span", [
                t("ai-secret.backend.type.edit.fieldExample"),
                h("span", { class: "text-error ml-1" }, "*"),
            ]),
    },
    {
        accessorKey: "required",
        header: t("ai-secret.backend.type.edit.fieldRequired"),
    },
    {
        accessorKey: "action",
        header: () => h("span", [t("console-common.operation")]),
    },
]);

// 单选框选项
const statusOptions = computed(() => [
    { label: t("console-common.enabled"), value: 1 },
    { label: t("console-common.disabled"), value: 0 },
]);

// 类型选项
const fieldTypeOptions = computed(() => [
    { label: t("ai-secret.backend.type.edit.singleLineText"), value: "text" },
    { label: t("ai-secret.backend.type.edit.number"), value: "number" },
    { label: t("ai-secret.backend.type.edit.multiLineText"), value: "textarea" },
]);

const rowSchema = object({
    name: string().trim().required("请输入字段名称"),
    type: string().trim().required("请选择字段类型"),
    placeholder: string().trim().required("请输入字段占位符"),
});

const schema = computed(() => {
    return object({
        name: string().trim().required("请输入类型名称"),
        isEnabled: number().required("请选择类型状态"),
        fieldConfig: array()
            .transform((list) => {
                if (!Array.isArray(list) || list.length === 0) return list;
                const last = list[list.length - 1];
                // 占位行判定：只要 name 和 placeholder 都为空，就视为占位行（忽略 type 的默认值）
                const isPlaceholder = !last?.name?.trim() && !last?.placeholder?.trim();
                return isPlaceholder && list.length > 1 ? list.slice(0, -1) : list;
            })
            .of(rowSchema),
    });
});

// JSON导入表单验证规则
const jsonImportSchema = object({
    jsonImport: string()
        .required("请输入JSON数据")
        .test("is-valid-json", "请输入有效的JSON数据", (value) => {
            if (!value) return false;
            try {
                JSON.parse(value);
                return true;
            } catch (_e) {
                return false;
            }
        }),
});

// JSON 模板示例
const correctJson = `{
    "name":"APIKeyModel",
    "fieldConfig":[
        {
            "name":"apiKey",
            "type":"text",
            "required":true/false,
            "placeholder":"Please enter APIKey"
        }
    ]
}`;

// JSON 导入模板
const jsonImportTemplate = `{
    "name":"APIKeyModel",
    "fieldConfig":[
        {
            "name":"apiKey",
            "type":"text",
            "required":true,
            "placeholder":"Please enter APIKey"
        }
    ]
}`;

const formatJsonExample = computed(() => {
    try {
        const jsonObj = JSON.parse(correctJson);
        return JSON.stringify(jsonObj, null, 2);
    } catch {
        return correctJson;
    }
});

const fetchDetail = async () => {
    const data = await getSecretTemplateDetail(props.id as string);
    useFormData(formData, data);
};

const addField = () => {
    formData.fieldConfig.push({
        name: "",
        type: "text",
        required: true,
        placeholder: "",
    });
};

const checkAutoAddRow = () => {
    console.log(formData.fieldConfig);
    const list = formData.fieldConfig ? formData.fieldConfig : [];
    const lastRow = list[list.length - 1];

    // 如果最后一行有任何值，且不是全部为空，则自动添加新行
    const lastHasValue = !!((lastRow?.name ?? "").trim() || (lastRow?.placeholder ?? "").trim());
    if (lastHasValue) {
        const hasEmptyRow = list.some(
            (field: { name?: string; placeholder?: string }) =>
                !(field?.name ?? "").trim() && !(field?.placeholder ?? "").trim(),
        );
        console.log(hasEmptyRow);
        if (!hasEmptyRow) {
            addField();
        }
    }
};

const removeField = (index: number) => {
    formData.fieldConfig.splice(index, 1);
};

const hasFieldError = (
    field: { name?: string; placeholder?: string; type?: string },
    fieldName: string,
) => {
    if (!isValidationTriggered.value) return false;

    if (fieldName === "name") {
        return !(field?.name ?? "").trim();
    }
    if (fieldName === "type") {
        return !field.type;
    }
    if (fieldName === "placeholder") {
        return !(field?.placeholder ?? "").trim();
    }
    return false;
};

const jsonSubmitForm = () => {
    emits("json-submit", jsonFormData.jsonImport);
    emits("close");
};

/**
 * 复制JSON
 */
const copyJson = () => {
    copy(jsonImportTemplate);
    jsonFormData.jsonImport = jsonImportTemplate;
    toast.success(t("ai-secret.backend.type.edit.fillTemplateSuccess"));
};

const handleSubmit = () => {
    const { type: _type, ...newformData } = formData;
    emits("submit", newformData, props.id);
    emits("close");
};

onMounted(async () => {
    if (props.id) {
        await fetchDetail();
        addField();
    }
});
</script>
<template>
    <BdModal
        :title="
            props.id ? t('ai-secret.backend.type.edit.title') : t('ai-secret.backend.type.addType')
        "
        :ui="{
            content: 'max-w-3xl overflow-y-auto h-fit',
        }"
        @close="emits('close')"
    >
        <UForm
            v-if="!isJsonImport"
            :state="formData"
            :schema="schema"
            class="space-y-4"
            @submit="handleSubmit"
        >
            <div class="grid grid-cols-2 items-center gap-4">
                <UFormField :label="t('ai-secret.backend.type.edit.icon')" name="icon">
                    <BdUploader
                        v-model="formData.icon"
                        class="h-32 w-32"
                        text="上传图标"
                        icon="i-lucide-upload"
                        accept=".jpg,.png,.svg,.ico"
                        :maxCount="1"
                        :single="true"
                        :multiple="false"
                    />
                </UFormField>
                <div class="flex h-full flex-col justify-around">
                    <UFormField :label="t('ai-secret.backend.type.edit.name')" name="name" required>
                        <UInput
                            v-model="formData.name"
                            class="w-full"
                            :placeholder="t('ai-secret.backend.type.edit.nameRequired')"
                            :highlight="hasFieldError(formData, 'name')"
                        />
                    </UFormField>

                    <UFormField :label="t('ai-secret.backend.type.edit.status')" name="isActive">
                        <URadioGroup
                            v-model="formData.isEnabled"
                            :items="statusOptions"
                            orientation="horizontal"
                            color="primary"
                        />
                    </UFormField>
                </div>
            </div>

            <!-- 配置表格 -->
            <div class="mt-6">
                <div class="flex items-center justify-between pb-2">
                    <div class="text-default block text-sm font-medium">
                        {{ t("ai-secret.backend.type.edit.customField") }}
                    </div>
                </div>
                <UTable
                    :columns="columns"
                    :data="formData.fieldConfig"
                    :ui="{
                        base: 'table-fixed border-separate border-spacing-0',
                        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
                        tbody: '[&>tr]:last:[&>td]:border-b-0',
                        th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
                        td: 'border-b border-default px-2',
                        tr: '[&:has(>td[colspan])]:hidden',
                    }"
                >
                    <template #name-cell="{ row }">
                        <UFormField :name="`fieldConfig.${row.index}.name`" required>
                            <UInput
                                v-model="row.original.name"
                                :placeholder="t('ai-secret.backend.type.edit.nameRequired')"
                                :highlight="hasFieldError(row.original, 'name')"
                                variant="subtle"
                                :ui="{
                                    base: 'border-0 ring-0 ring-inset outline-none bg-transparent hover:ring-1 hover:ring-primary focus:ring-1 focus:ring-primary dark:hover:ring-primary dark:focus:ring-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 transition-colors duration-200',
                                }"
                                @update:model-value="checkAutoAddRow"
                            />
                        </UFormField>
                    </template>
                    <template #type-cell="{ row }">
                        <UFormField :name="`fieldConfig.${row.index}.type`" required>
                            <USelect
                                v-model="row.original.type"
                                :items="fieldTypeOptions"
                                :placeholder="t('ai-secret.backend.type.edit.typeValueRequired')"
                                :highlight="hasFieldError(row.original, 'type')"
                                variant="subtle"
                                :ui="{
                                    base: 'border-0 ring-0 ring-inset outline-none bg-transparent hover:ring-1 hover:ring-primary focus:ring-1 focus:ring-primary dark:hover:ring-primary dark:focus:ring-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 transition-colors duration-200',
                                }"
                            />
                        </UFormField>
                    </template>
                    <template #example-cell="{ row }">
                        <UFormField :name="`fieldConfig.${row.index}.placeholder`" required>
                            <UInput
                                v-model="row.original.placeholder"
                                :placeholder="t('ai-secret.backend.type.edit.exampleRequired')"
                                :highlight="hasFieldError(row.original, 'example')"
                                variant="subtle"
                                :ui="{
                                    base: 'border-0 ring-0 ring-inset outline-none bg-transparent hover:ring-1 hover:ring-primary focus:ring-1 focus:ring-primary dark:hover:ring-primary dark:focus:ring-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 transition-colors duration-200',
                                }"
                                @update:model-value="checkAutoAddRow"
                            />
                        </UFormField>
                    </template>
                    <template #required-cell="{ row }">
                        <UFormField
                            :name="`fieldConfig.${row.index}.required`"
                            class="px-3"
                            required
                        >
                            <USwitch v-model="row.original.required" />
                        </UFormField>
                    </template>
                    <template #action-cell="{ row }">
                        <UButton
                            v-if="row.index !== formData.fieldConfig.length - 1"
                            class="cursor-pointer px-3"
                            icon="i-tabler-trash"
                            color="error"
                            variant="ghost"
                            @click="removeField(row.index)"
                        />
                    </template>
                </UTable>
            </div>

            <!-- 底部按钮 -->
            <div class="mt-6 flex justify-end gap-2">
                <UButton color="neutral" variant="soft" @click="emits('close')">
                    {{ t("console-common.cancel") }}
                </UButton>
                <UButton color="primary" type="submit">
                    {{ t("console-common.save") }}
                </UButton>
            </div>
        </UForm>

        <!-- JSON导入 -->
        <UForm v-else :state="jsonFormData" :schema="jsonImportSchema" @submit="jsonSubmitForm">
            <div class="pb-2">
                <div class="grid grid-cols-2 gap-4">
                    <!-- 左侧：JSON 输入区域 -->
                    <div>
                        <UFormField
                            :label="t('ai-mcp.backend.form.jsonImport')"
                            name="jsonImport"
                            required
                        >
                            <UTextarea
                                v-model="jsonFormData.jsonImport"
                                :placeholder="t('ai-mcp.backend.form.jsonImportPlaceholder')"
                                :rows="22"
                                :ui="{ root: 'w-full' }"
                            />
                            <template #hint>
                                <UButton
                                    variant="link"
                                    class="text-primary cursor-pointer text-xs"
                                    @click="copyJson"
                                >
                                    {{ t("ai-secret.backend.type.edit.fillTemplate") }}
                                </UButton>
                            </template>
                        </UFormField>
                    </div>

                    <!-- 右侧：代码块样式显示 -->
                    <div class="flex flex-col">
                        <label class="text-muted mt-0.5 mb-2.5 block text-sm font-medium">
                            {{ t("ai-secret.backend.type.edit.templateExample") }}
                        </label>
                        <div
                            class="bg-muted border-muted flex-1 overflow-y-auto rounded-lg border p-4 select-none"
                        >
                            <pre
                                class="text-muted text-sm whitespace-pre-wrap select-none"
                            ><code>{{ formatJsonExample }}</code></pre>
                        </div>

                        <!-- fieldConfig type 类型说明 -->
                        <div
                            class="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-800"
                        >
                            <h4 class="mb-2 text-sm font-medium text-blue-800 dark:text-blue-200">
                                {{ t("ai-secret.backend.type.edit.fieldTypeSupported") }}
                            </h4>
                            <ul class="space-y-1 text-xs text-blue-700 dark:text-blue-200">
                                <li>
                                    <code class="rounded bg-blue-100 px-1 dark:bg-blue-900"
                                        >text</code
                                    >
                                    - {{ t("ai-secret.backend.type.edit.fieldTypes.text") }}
                                </li>
                                <li>
                                    <code class="rounded bg-blue-100 px-1 dark:bg-blue-900"
                                        >textarea</code
                                    >
                                    - {{ t("ai-secret.backend.type.edit.fieldTypes.textarea") }}
                                </li>
                                <li>
                                    <code class="rounded bg-blue-100 px-1 dark:bg-blue-900"
                                        >number</code
                                    >
                                    - {{ t("ai-secret.backend.type.edit.fieldTypes.number") }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 操作按钮 -->
            <div class="bottom-0 z-10 flex justify-end gap-2 pt-4">
                <UButton color="neutral" variant="soft" size="lg" @click="emits('close')">
                    {{ t("console-common.cancel") }}
                </UButton>
                <UButton color="primary" size="lg" type="submit">
                    {{ t("console-common.save") }}
                </UButton>
            </div>
        </UForm>
    </BdModal>
</template>
