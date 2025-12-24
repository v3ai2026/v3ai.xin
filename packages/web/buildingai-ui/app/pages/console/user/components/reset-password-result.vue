<script setup lang="ts">
/**
 * 重置密码结果显示组件
 * 用于显示重置密码后生成的新密码
 * 通过 overlay 动态调起
 */

const emits = defineEmits<{
    (e: "close"): void;
}>();

const props = defineProps<{
    /** 生成的新密码 */
    password: string;
}>();

const { t } = useI18n();
const toast = useMessage();

/**
 * 复制密码到剪贴板
 */
const copyPassword = async () => {
    try {
        await navigator.clipboard.writeText(props.password);
        toast.success(t("user.backend.password.messages.copySuccess"));
    } catch (_error) {
        toast.error(t("user.backend.password.messages.copyFailed"));
    }
};

/**
 * 关闭弹窗
 */
const closeModal = () => {
    copyPassword();
    emits("close");
};
</script>

<template>
    <BdModal
        :title="t('user.backend.password.resetSuccessTitle')"
        :ui="{
            content: 'max-w-md overflow-y-auto h-fit',
        }"
        :show-footer="true"
        @close="closeModal"
    >
        <div class="space-y-4">
            <div class="bg-primary/20 border-primary/50 rounded-lg border p-4">
                <div class="flex items-start gap-3">
                    <UIcon name="i-lucide-check-circle" class="text-primary mt-0.5 size-5" />
                    <div class="space-y-3">
                        <h4 class="text-primary font-medium">
                            {{ t("user.backend.password.newPasswordGenerated") }}
                        </h4>
                        <p class="text-primary text-sm">
                            {{ t("user.backend.password.newPasswordDesc") }}
                        </p>

                        <!-- 密码显示区域 -->
                        <div class="border-primary/50 bg-muted rounded-md border p-3">
                            <div class="flex items-center justify-between gap-2">
                                <code class="font-mono text-sm break-all">
                                    {{ password }}
                                </code>
                                <UButton
                                    variant="ghost"
                                    size="xs"
                                    icon="i-lucide-copy"
                                    @click="copyPassword"
                                    class="shrink-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end">
                <UButton @click="closeModal">
                    {{ t("user.backend.password.copyAndClose") }}
                </UButton>
            </div>
        </template>
    </BdModal>
</template>
