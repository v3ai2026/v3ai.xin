<script setup lang="ts">
import type {
    MicropageCreateRequest,
    MicropageUpdateRequest,
} from "@buildingai/service/consoleapi/decorate";
import {
    apiCreateMicropage,
    apiGetMicropageDetail,
    apiUpdateMicropage,
} from "@buildingai/service/consoleapi/decorate";
import { object, string } from "yup";

const { t } = useI18n();
const toast = useMessage();

const props = defineProps<{
    id: string | null;
}>();
const emits = defineEmits<{
    (e: "close", refresh?: boolean): void;
}>();

const formData = reactive<MicropageUpdateRequest>({
    terminal: "web",
    name: "",
    configs: {
        backgroundColor: "#ffffff",
        backgroundDarkColor: "",
        backgroundImage: "",
        backgroundType: "solid",
        pageHeight: 1080,
    },
    content: [],
});

/**
 * 表单验证规则
 */
const micropageSchema = object({
    name: string()
        .required(t("decorate.micropage.edit.pageNameRequired"))
        .max(32, t("decorate.micropage.edit.pageNameMaxLength")),
});

/**
 * 获取微页面详情
 */
const { lockFn: fetchDetail, isLock: detailLoading } = useLockFn(async () => {
    try {
        const data: MicropageCreateRequest = await apiGetMicropageDetail(props.id as string);
        Object.keys(formData).forEach((key) => {
            const typedKey = key as keyof MicropageCreateRequest;
            const value = data[typedKey];
            if (value !== undefined) {
                (formData[typedKey] as typeof value) = value;
            }
        });
    } catch (error) {
        console.error("获取微页面详情失败:", error);
    }
});

/**
 * 提交表单
 */
const { lockFn: submitForm, isLock } = useLockFn(async () => {
    try {
        if (props.id) {
            await apiUpdateMicropage(props.id as string, formData);
            toast.success(t("console-common.messages.success"));
        } else {
            await apiCreateMicropage(formData as MicropageCreateRequest);
            toast.success(t("console-common.messages.success"));
        }

        emits("close", true);
    } catch (error) {
        console.error("提交失败:", error);
    }
});

/**
 * 弹窗标题
 */
const modalTitle = computed(() =>
    props.id
        ? t("decorate.micropage.edit.modalTitleEdit")
        : t("decorate.micropage.edit.modalTitleCreate"),
);

/**
 * 弹窗描述
 */
const modalDescription = computed(() =>
    props.id
        ? t("decorate.micropage.edit.modalDescriptionEdit")
        : t("decorate.micropage.edit.modalDescriptionCreate"),
);

onMounted(async () => props.id && (await fetchDetail()));
</script>

<template>
    <BdModal
        :title="modalTitle"
        :description="modalDescription"
        :ui="{ content: 'max-w-md' }"
        @close="emits('close', false)"
    >
        <div v-if="detailLoading" class="flex items-center justify-center py-12">
            <div class="flex flex-col items-center gap-3">
                <UIcon name="i-lucide-loader-2" class="text-primary size-8 animate-spin" />
                <p class="text-muted-foreground text-sm">
                    {{ t("common.loading") }}
                </p>
            </div>
        </div>

        <UForm
            v-else
            :state="formData"
            :schema="micropageSchema"
            class="space-y-6"
            @submit="submitForm"
        >
            <!-- 基本信息 -->
            <div class="space-y-4">
                <UFormField :label="t('decorate.micropage.edit.pageName')" name="name" required>
                    <UInput
                        v-model="formData.name"
                        :placeholder="t('decorate.micropage.edit.pageNamePlaceholder')"
                        maxlength="32"
                        show-count
                        size="lg"
                        :ui="{ root: 'w-full' }"
                    />
                </UFormField>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-end gap-3 pt-6">
                <UButton type="button" variant="outline" size="lg" @click="emits('close', false)">
                    {{ t("console-common.cancel") }}
                </UButton>
                <UButton type="submit" :loading="isLock" size="lg" icon="i-lucide-save">
                    {{ props.id ? t("console-common.update") : t("console-common.create") }}
                </UButton>
            </div>
        </UForm>
    </BdModal>
</template>
