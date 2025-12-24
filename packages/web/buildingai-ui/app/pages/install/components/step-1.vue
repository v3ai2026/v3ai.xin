<script setup lang="ts">
import { apiUploadInitFile } from "@buildingai/service/common";
import type { SystemInitializeRequest } from "@buildingai/service/consoleapi/system";
import * as yup from "yup";

const props = withDefaults(
    defineProps<{
        modelValue: SystemInitializeRequest;
        loading?: boolean;
    }>(),
    {
        loading: false,
    },
);

const emit = defineEmits<{
    (e: "update:modelValue", value: SystemInitializeRequest): void;
    (e: "submit"): void;
}>();

const { t } = useI18n();
const formData = useVModel(props, "modelValue", emit);

const showMoreOptions = shallowRef(false);

/** 是否同意隐私协议 */
const agreedToTerms = ref(false);

const form = useTemplateRef("form");

/** 表单状态对象，包含所有需要验证的字段 */
const formState = computed(() => ({
    ...formData.value,
    agreedToTerms: agreedToTerms.value,
}));

const schema = yup.object({
    username: yup
        .string()
        .required(t("install.validation.usernameRequired"))
        .min(3, t("install.validation.usernameLength"))
        .max(20, t("install.validation.usernameLength"))
        .matches(/^[a-zA-Z0-9_]+$/, t("install.validation.usernamePattern")),
    password: yup
        .string()
        .required(t("install.validation.passwordRequired"))
        .min(6, t("install.validation.passwordLength")),
    email: yup.string().email(t("install.validation.emailInvalid")),
    agreedToTerms: yup.boolean().oneOf([true], t("install.validation.agreementRequired")),
});

/**
 * Compute password strength requirements.
 * Returns a list of requirement checks with their met state and description.
 */
function checkPasswordStrength(str: string) {
    const requirements = [
        { regex: /.{8,}/, text: t("login.requirements.minLength8") },
        { regex: /\d/, text: t("login.requirements.number") },
        { regex: /[a-z]/, text: t("login.requirements.lowercase") },
        { regex: /[A-Z]/, text: t("login.requirements.uppercase") },
    ];
    return requirements.map((req) => ({ met: req.regex.test(str), text: req.text }));
}

/** Compute the list of met/unmet requirements for the current password. */
const passwordStrength = computed(() => checkPasswordStrength(formData.value.password || ""));

/** Compute numeric score [0..4] for the current password. */
const passwordScore = computed(() => passwordStrength.value.filter((req) => req.met).length);

/** Map score to color token for UI components. */
const passwordColor = computed(() => {
    if (passwordScore.value === 0) return "neutral";
    if (passwordScore.value <= 1) return "error";
    if (passwordScore.value <= 2) return "warning";
    if (passwordScore.value === 3) return "warning";
    return "success";
});

/** Compute localized text label for current password strength. */
const passwordStrengthText = computed(() => {
    if (passwordScore.value === 0) return "";
    if (passwordScore.value <= 1) return t("login.strength.weak");
    if (passwordScore.value <= 3) return t("login.strength.medium");
    return t("login.strength.strong");
});

/** Match the strength label color to the progress color. */
const passwordTextClass = computed(() => {
    const c = passwordColor.value;
    if (c === "error") return "text-error";
    if (c === "warning") return "text-warning";
    if (c === "success") return "text-success";
    return "text-muted";
});

async function handleSubmit() {
    const isValid = await form.value?.validate();
    if (isValid && agreedToTerms.value) {
        emit("submit");
    }
}
</script>

<template>
    <div class="w-full py-6">
        <div class="mb-8">
            <h1 class="text-foreground text-2xl font-bold">{{ t("install.steps.admin.title") }}</h1>
            <p class="text-muted-foreground mt-2 text-sm">
                {{ t("install.steps.admin.description") }}
            </p>
        </div>
        <UForm ref="form" :state="formState" :schema="schema" @submit="handleSubmit">
            <div class="space-y-5">
                <!-- Username -->
                <UFormField :label="t('install.username')" name="username" required>
                    <UInput
                        v-model="formData.username"
                        :placeholder="t('install.usernamePlaceholder')"
                        size="lg"
                        :ui="{ root: 'w-full', base: 'bg-accent' }"
                        variant="soft"
                        autocomplete="username"
                    >
                        <template #leading>
                            <UIcon name="i-lucide-user" />
                        </template>
                    </UInput>
                </UFormField>

                <!-- Password -->
                <UFormField :label="t('install.password')" name="password" required>
                    <BdInputPassword
                        v-model="formData.password"
                        type="password"
                        :placeholder="t('install.passwordPlaceholder')"
                        size="lg"
                        :ui="{ root: 'w-full', base: 'bg-accent' }"
                        variant="soft"
                        autocomplete="new-password"
                    >
                        <template #leading>
                            <UIcon name="i-lucide-lock" />
                        </template>
                    </BdInputPassword>
                    <!-- Password Strength Indicator -->
                    <div v-if="formData.password" class="mt-2">
                        <UProgress
                            :color="passwordColor"
                            :model-value="passwordScore"
                            :max="4"
                            size="sm"
                        />
                        <div
                            v-if="passwordStrengthText"
                            class="mt-1 flex items-center gap-1 text-xs font-medium"
                            :class="passwordTextClass"
                        >
                            <span>{{ passwordStrengthText }}</span>
                            <UPopover mode="hover" :open-delay="0">
                                <span
                                    class="inline-flex items-center"
                                    aria-label="Password requirements"
                                >
                                    <UIcon name="i-lucide-help-circle" class="size-3.5" />
                                </span>
                                <template #content>
                                    <ul class="space-y-1 p-2" aria-label="Password requirements">
                                        <li
                                            v-for="(req, index) in passwordStrength"
                                            :key="index"
                                            class="flex items-center gap-0.5"
                                            :class="req.met ? 'text-success' : 'text-muted'"
                                        >
                                            <UIcon
                                                :name="
                                                    req.met
                                                        ? 'i-lucide-circle-check'
                                                        : 'i-lucide-circle-x'
                                                "
                                                class="size-4 shrink-0"
                                            />
                                            <span class="text-xs font-light">
                                                {{ req.text }}
                                                <span class="sr-only">
                                                    {{
                                                        req.met
                                                            ? t("login.strength.met")
                                                            : t("login.strength.notMet")
                                                    }}
                                                </span>
                                            </span>
                                        </li>
                                    </ul>
                                </template>
                            </UPopover>
                        </div>
                    </div>
                </UFormField>

                <!-- More Options Toggle -->
                <UButton
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    :icon="showMoreOptions ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                    @click="showMoreOptions = !showMoreOptions"
                >
                    {{ t("install.moreOptions") }}
                </UButton>

                <!-- Optional Fields (Expandable) -->
                <Transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                >
                    <div v-show="showMoreOptions" class="space-y-5">
                        <!-- Avatar -->
                        <UFormField :label="t('install.avatar')" name="avatar">
                            <BdUploader
                                v-model="formData.avatar"
                                class="h-24 w-24"
                                :text="t('install.avatarPlaceholder')"
                                icon="i-lucide-upload"
                                accept=".jpg,.png,.jpeg"
                                :max-count="1"
                                :single="true"
                                :upload-api="apiUploadInitFile"
                            />
                        </UFormField>

                        <!-- Nickname -->
                        <UFormField :label="t('install.nickname')" name="nickname">
                            <UInput
                                v-model="formData.nickname"
                                :placeholder="t('install.nicknamePlaceholder')"
                                size="lg"
                                :ui="{ root: 'w-full', base: 'bg-accent' }"
                                variant="soft"
                            >
                                <template #leading>
                                    <UIcon name="i-lucide-user-circle" />
                                </template>
                            </UInput>
                        </UFormField>

                        <!-- Email -->
                        <UFormField :label="t('install.email')" name="email">
                            <UInput
                                v-model="formData.email"
                                type="email"
                                :placeholder="t('install.emailPlaceholder')"
                                size="lg"
                                :ui="{ root: 'w-full', base: 'bg-accent' }"
                                variant="soft"
                                autocomplete="email"
                            >
                                <template #leading>
                                    <UIcon name="i-lucide-mail" />
                                </template>
                            </UInput>
                        </UFormField>

                        <!-- Phone -->
                        <UFormField :label="t('install.phone')" name="phone">
                            <UInput
                                v-model="formData.phone"
                                type="tel"
                                :placeholder="t('install.phonePlaceholder')"
                                size="lg"
                                :ui="{ root: 'w-full', base: 'bg-accent' }"
                                variant="soft"
                                autocomplete="tel"
                            >
                                <template #leading>
                                    <UIcon name="i-lucide-phone" />
                                </template>
                            </UInput>
                        </UFormField>
                    </div>
                </Transition>

                <!-- Submit Button -->
                <div class="flex flex-col gap-3 pt-4">
                    <!-- Privacy Agreement Checkbox -->
                    <UFormField name="agreedToTerms" :model-value="agreedToTerms">
                        <UCheckbox
                            v-model="agreedToTerms"
                            name="agreedToTerms"
                            :ui="{ root: 'items-center' }"
                        >
                            <template #label>
                                <p class="text-foreground/50 text-xs">
                                    <span>{{ t("install.agreement") }}</span>
                                    <a
                                        href="https://github.com/BidingCC/BuildingAI/blob/master/PRIVACY_NOTICE.md"
                                        target="_blank"
                                        class="text-primary mx-px font-medium"
                                    >
                                        《{{ t("install.privacyLink") }}》
                                    </a>
                                </p>
                            </template>
                        </UCheckbox>
                    </UFormField>
                    <div class="flex items-center justify-between">
                        <UButton
                            type="submit"
                            size="lg"
                            trailing-icon="i-lucide-arrow-right"
                            :loading="loading"
                            :disabled="loading || !agreedToTerms"
                            :ui="{ base: 'w-full justify-center' }"
                        >
                            {{ t("install.nextStep") }}
                        </UButton>
                    </div>
                </div>

                <!-- Open Source License Notice -->
                <div class="text-muted-foreground text-left text-sm">
                    {{ t("install.agreementTip") }}
                    <a
                        href="https://github.com/BidingCC/BuildingAI/blob/master/LICENSE"
                        target="_blank"
                        class="text-primary font-bold"
                    >
                        [{{ t("install.agreementLink") }}]
                    </a>
                </div>
            </div>
        </UForm>
    </div>
</template>
