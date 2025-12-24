<script setup lang="ts">
import {
    apiGenerateRandomPassword,
    apiResetUserPassword,
} from "@buildingai/service/consoleapi/user";

const ResetPasswordResult = defineAsyncComponent(() => import("./reset-password-result.vue"));

type PasswordForm = {
    newPassword: string;
    confirmPassword: string;
};

const props = defineProps<{
    userid: string | null;
}>();

const emits = defineEmits<{
    (e: "close"): void;
}>();

const { t } = useI18n();
const toast = useMessage();
const overlay = useOverlay();

const activeTab = shallowRef<"change" | "reset">("change");

const formData = reactive<PasswordForm>({
    newPassword: "",
    confirmPassword: "",
});

const isResettingPassword = shallowRef(false);
const showPassword = shallowRef({
    new: false,
    confirm: false,
});

const tabItems = computed(() => [
    {
        value: "change",
        label: t("user.backend.password.changeTab"),
        icon: "i-lucide-edit",
        slot: "change",
    },
    {
        value: "reset",
        label: t("user.backend.password.resetTab"),
        icon: "i-lucide-refresh-cw",
        slot: "reset",
    },
]);

const errors = computed(() => {
    const result: Record<string, string> = {};

    if (activeTab.value === "change") {
        const newPassword = formData.newPassword.trim();
        const confirmPassword = formData.confirmPassword.trim();

        // 验证新密码：只在有值但不符合要求时显示错误
        if (newPassword && newPassword.length < 6) {
            result.newPassword = t("user.backend.password.validation.passwordMinLength");
        }

        // 验证确认密码：只在有值但不符合要求时显示错误
        if (confirmPassword) {
            if (!newPassword) {
                // 如果新密码为空，不显示确认密码的错误
            } else if (newPassword.length < 6) {
                // 如果新密码长度不够，不显示确认密码的错误
            } else if (confirmPassword !== newPassword) {
                result.confirmPassword = t("user.backend.password.validation.passwordMismatch");
            }
        }
    }

    return result;
});

const hasErrors = computed(() => Object.keys(errors.value).length > 0);

const isFormEmpty = computed(() => {
    if (activeTab.value === "reset") return false;
    const newPassword = formData.newPassword.trim();
    const confirmPassword = formData.confirmPassword.trim();
    // 两个字段都必须有值
    return !newPassword || !confirmPassword;
});

function resetForm() {
    formData.newPassword = "";
    formData.confirmPassword = "";
    showPassword.value = {
        new: false,
        confirm: false,
    };
}

function togglePasswordVisibility(field: keyof typeof showPassword.value) {
    showPassword.value[field] = !showPassword.value[field];
}

const { lockFn: changePasswordLockFn, isLock: isChangingPassword } = useLockFn(async () => {
    // 提交时进行完整验证
    const newPassword = formData.newPassword.trim();
    const confirmPassword = formData.confirmPassword.trim();

    if (!newPassword) {
        toast.warning(t("user.backend.password.validation.newPasswordRequired"));
        return;
    }

    if (newPassword.length < 6) {
        toast.warning(t("user.backend.password.validation.passwordMinLength"));
        return;
    }

    if (!confirmPassword) {
        toast.warning(t("user.backend.password.validation.confirmPasswordRequired"));
        return;
    }

    if (confirmPassword !== newPassword) {
        toast.warning(t("user.backend.password.validation.passwordMismatch"));
        return;
    }

    try {
        // 调用修改密码API
        await apiResetUserPassword(props.userid || "", newPassword);

        toast.success(t("user.backend.password.messages.changeSuccess"));
        handleClose();
    } catch (error) {
        console.error("修改密码失败:", error);
        toast.error(
            error instanceof Error
                ? error.message
                : t("user.backend.password.messages.changeFailed"),
        );
    }
});

/**
 * 打开新密码显示弹窗
 */
const openResetPasswordResultModal = (password: string) => {
    const modal = overlay.create(ResetPasswordResult);
    modal.open({ password });
};

const handleResetPassword = async () => {
    if (!props.userid) {
        toast.error(t("user.backend.password.validation.userIdRequired"));
        return;
    }

    try {
        isResettingPassword.value = true;

        // 生成新密码
        const { password } = await apiGenerateRandomPassword(props.userid || "");

        // 通过 overlay 打开新密码显示弹窗
        openResetPasswordResultModal(password);

        // 关闭当前弹窗
        handleClose();
    } catch (error) {
        console.error("重置密码失败:", error);
        toast.error(
            error instanceof Error
                ? error.message
                : t("user.backend.password.messages.resetFailed"),
        );
    } finally {
        isResettingPassword.value = false;
    }
};

const { lockFn: resetPasswordLockFn } = useLockFn(handleResetPassword);

function handleSubmit() {
    if (activeTab.value === "change") {
        changePasswordLockFn();
    } else {
        resetPasswordLockFn();
    }
}

const handleClose = () => {
    resetForm();
    emits("close");
};

watch(activeTab, () => {
    resetForm();
});

const isSubmitDisabled = computed(() => {
    const isBusy = isChangingPassword.value || isResettingPassword.value;
    if (activeTab.value === "change") {
        return isFormEmpty.value || hasErrors.value || isBusy;
    }
    return isBusy;
});

defineShortcuts({
    escape: handleClose,
});

const isBusy = computed(() => isChangingPassword.value || isResettingPassword.value);
</script>

<template>
    <BdModal
        :title="t('user.backend.password.title')"
        :ui="{
            content: 'max-w-md overflow-y-auto h-fit',
        }"
        :show-footer="true"
        @close="handleClose()"
    >
        <div class="space-y-4">
            <!-- Tab 切换 -->
            <UTabs v-model="activeTab" :items="tabItems" class="w-full">
                <template #change>
                    <div class="space-y-4 pt-4">
                        <!-- 新密码 -->
                        <UFormField
                            :label="t('user.backend.password.newPassword')"
                            size="lg"
                            required
                            :error="errors.newPassword"
                        >
                            <UInput
                                v-model="formData.newPassword"
                                :type="showPassword.new ? 'text' : 'password'"
                                :placeholder="t('user.backend.password.newPasswordPlaceholder')"
                                :ui="{ root: 'w-full' }"
                                @keydown.enter.prevent="handleSubmit"
                            >
                                <template #trailing>
                                    <UButton
                                        variant="ghost"
                                        size="xs"
                                        :icon="
                                            showPassword.new ? 'i-lucide-eye-off' : 'i-lucide-eye'
                                        "
                                        @click="togglePasswordVisibility('new')"
                                    />
                                </template>
                            </UInput>
                        </UFormField>

                        <!-- 确认密码 -->
                        <UFormField
                            :label="t('user.backend.password.confirmPassword')"
                            size="lg"
                            required
                            :error="errors.confirmPassword"
                        >
                            <UInput
                                v-model="formData.confirmPassword"
                                :type="showPassword.confirm ? 'text' : 'password'"
                                :placeholder="t('user.backend.password.confirmPasswordPlaceholder')"
                                :ui="{ root: 'w-full' }"
                                @keydown.enter.prevent="handleSubmit"
                            >
                                <template #trailing>
                                    <UButton
                                        variant="ghost"
                                        size="xs"
                                        :icon="
                                            showPassword.confirm
                                                ? 'i-lucide-eye-off'
                                                : 'i-lucide-eye'
                                        "
                                        @click="togglePasswordVisibility('confirm')"
                                    />
                                </template>
                            </UInput>
                        </UFormField>

                        <div class="text-muted-foreground text-xs">
                            {{ t("user.backend.password.passwordHelp") }}
                        </div>
                    </div>
                </template>

                <template #reset>
                    <div class="space-y-4 pt-4">
                        <div
                            class="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950"
                        >
                            <div class="flex items-start gap-3">
                                <UIcon
                                    name="i-lucide-alert-triangle"
                                    class="mt-0.5 size-5 text-orange-600 dark:text-orange-400"
                                />
                                <div class="space-y-2">
                                    <h4 class="font-medium text-orange-800 dark:text-orange-200">
                                        {{ t("user.backend.password.resetConfirmTitle") }}
                                    </h4>
                                    <p class="text-sm text-orange-700 dark:text-orange-300">
                                        {{ t("user.backend.password.resetConfirmDesc") }}
                                    </p>
                                    <ul
                                        class="ml-4 list-disc space-y-1 text-sm text-orange-600 dark:text-orange-400"
                                    >
                                        <li>{{ t("user.backend.password.resetWarning1") }}</li>
                                        <li>{{ t("user.backend.password.resetWarning2") }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </UTabs>
        </div>

        <template #footer>
            <div class="flex justify-end gap-2">
                <UButton variant="soft" color="neutral" @click="handleClose">
                    {{ t("user.backend.password.cancel") }}
                </UButton>
                <UButton
                    :disabled="isSubmitDisabled"
                    :color="activeTab === 'reset' ? 'warning' : 'primary'"
                    :loading="isBusy"
                    @click="handleSubmit"
                >
                    {{
                        activeTab === "change"
                            ? t("user.backend.password.changePassword")
                            : t("user.backend.password.confirmReset")
                    }}
                </UButton>
            </div>
        </template>
    </BdModal>
</template>
