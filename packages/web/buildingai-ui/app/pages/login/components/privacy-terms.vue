<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean;
}>();

const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
}>();

const isAgreed = useVModel(props, "modelValue", emits);
</script>

<template>
    <div class="flex items-center">
        <UCheckbox v-model="isAgreed" name="privacy" size="sm" :ui="{ root: 'items-center' }">
            <template #label>
                <p class="text-foreground/50 text-xs">
                    <span>{{ $t("login.agreement") }}</span>
                    <NuxtLink
                        class="text-primary mx-[1px] font-medium"
                        to="/agreement?type=agreement&item=service"
                        target="_blank"
                    >
                        《{{ $t("login.userAgreement") }}》
                    </NuxtLink>
                    <span>{{ $t("login.and") }}</span>
                    <NuxtLink
                        class="text-primary mx-[1px] font-medium"
                        to="/agreement?type=agreement&item=privacy"
                        target="_blank"
                    >
                        《{{ $t("login.privacyPolicy") }}》
                    </NuxtLink>
                </p>
            </template>
        </UCheckbox>
    </div>
</template>
