<script setup lang="ts">
import type { Agent, UpdateAgentConfigParams } from "@buildingai/service/consoleapi/ai-agent";
import { apiUpdateAgentConfig } from "@buildingai/service/consoleapi/ai-agent";
import { useDebounceFn } from "@vueuse/core";
import type { Component } from "vue";

const FuncSetup = defineAsyncComponent(() => import("./func-setup.vue"));
const UserSetup = defineAsyncComponent(() => import("./user-setup.vue"));
const BillingSetup = defineAsyncComponent(() => import("./billing-setup.vue"));
const PreviewChat = defineAsyncComponent(() => import("../preview-chat.vue"));
const ModelConfig = defineAsyncComponent(() => import("./model-config.vue"));

const route = useRoute();
const { t } = useI18n();
const isInitialized = shallowRef(false);
const agentId = (route.params as Record<string, string>).id;
const agents = inject<Agent>("agents");
const active = shallowRef("0");
const components: { value: string; label: string; component: Component }[] = [
    {
        value: "0",
        label: t("ai-agent.backend.configuration.func"),
        component: FuncSetup,
    },
    {
        value: "1",
        label: t("ai-agent.backend.configuration.user"),
        component: UserSetup,
    },
    {
        value: "2",
        label: t("ai-agent.backend.configuration.billingSetup"),
        component: BillingSetup,
    },
];
const previewChatRef = useTemplateRef<InstanceType<typeof PreviewChat>>("previewChatRef");

const showVariableInput = shallowRef(true);
const enableAutoSave = useCookie<boolean>("agent-config-auto-save", {
    default: () => true,
});
const state = reactive<UpdateAgentConfigParams>({
    name: "",
    description: "",
    avatar: "",
    chatAvatar: "",
    rolePrompt: "",
    createMode: "direct",
    showContext: true,
    showReference: true,
    enableFeedback: true,
    enableWebSearch: false,
    billingConfig: {
        price: 0,
    },
    modelConfig: {
        id: "",
        options: {},
    },
    datasetIds: [],
    mcpServerIds: [],
    openingStatement: "你好，我是智能体默认开场白，你可以在界面配置中修改我",
    openingQuestions: [
        "我打算去北京旅游，有什么推荐的路线吗？",
        "预算大约2万，能帮我规划一下行程吗？",
        "我对历史文化很感兴趣，有合适的目的地推荐吗？",
    ],
    isPublic: false,
    quickCommands: [],
    autoQuestions: {
        enabled: false,
        customRuleEnabled: false,
        customRule: "",
    },
    formFields: [],
    formFieldsInputs: {},
    thirdPartyIntegration: {},
    tagIds: [],
});

function handleVariableModalOpen() {
    if (!state.formFields || state.formFields.length === 0) {
        useMessage().error(t("ai-agent.backend.configuration.variableInputDesc"));
        return;
    }
    showVariableInput.value = !showVariableInput.value;
}

const { lockFn: handleUpdate, isLock } = useLockFn(async (flag = true) => {
    await apiUpdateAgentConfig(agentId as string, state);
    if (flag) {
        useMessage().success(t("common.message.updateSuccess"));
        setTimeout(() => {
            useRouter().push(useRoutePath("ai-agent:list"));
        }, 1000);
    }
    refreshNuxtData(`agent-detail-${agentId as string}`);
});

const handleAutoSave = useDebounceFn(() => handleUpdate(false), 1000);

watch(
    () => state,
    () => {
        if (!isInitialized.value || !enableAutoSave.value) {
            return;
        }
        handleAutoSave();
    },
    { deep: true },
);

onMounted(() => {
    (Reflect.ownKeys({ ...state, tags: [] }) as Array<keyof UpdateAgentConfigParams>).forEach(
        (key) => {
            if (
                unref(agents) &&
                Object.prototype.hasOwnProperty.call(unref(agents), key) &&
                key !== "tags"
            ) {
                state[key] = (unref(agents)?.[key] as never) ?? state[key];
            }
            if (key === "tags") {
                state.tagIds = unref(agents)?.tags?.map((tag) => tag.id) ?? [];
            }
        },
    );
    setTimeout(() => {
        isInitialized.value = true;
    }, 1500);
});
</script>

<template>
    <div class="flex h-full min-h-0 flex-1 flex-col p-4">
        <div class="flex items-center justify-between">
            <h1 class="text-foreground text-lg font-medium">
                {{ $t("ai-agent.backend.menu.arrange") }}
            </h1>
        </div>
        <div class="flex h-full min-h-0 flex-1 gap-4 pt-4 pr-4">
            <div class="flex h-full min-h-0 w-1/2 flex-none flex-col">
                <div class="mb-4 flex">
                    <UTabs v-model="active" :items="components" class="block w-auto" />
                </div>
                <component :is="components[Number(active)]?.component" v-model="state" />
            </div>
            <div class="flex h-full min-h-0 w-1/2 flex-none flex-col">
                <!-- 模型参数配置 -->
                <div class="mb-4 flex items-center justify-end gap-3 p-0.5">
                    <UCheckbox
                        v-model="enableAutoSave"
                        :label="t('ai-agent.backend.configuration.enableAutoSave')"
                        class="flex-none"
                    />

                    <ModelConfig
                        v-if="state.createMode === 'direct'"
                        v-model="state.modelConfig!"
                    />

                    <AccessControl :codes="['ai-agent:update']">
                        <UButton
                            trailingIcon="i-lucide-arrow-big-up"
                            color="primary"
                            size="lg"
                            class="flex-none gap-1 px-4"
                            :disabled="isLock"
                            @click="handleUpdate"
                        >
                            {{ $t("ai-agent.backend.configuration.saveConfig") }}
                        </UButton>
                    </AccessControl>
                </div>

                <div
                    class="bg-muted border-default flex h-full min-h-0 w-full flex-col rounded-lg border"
                >
                    <div class="flex items-center justify-between p-4">
                        <h1 class="text-foreground text-lg font-medium">
                            {{ $t("ai-agent.backend.configuration.debugPreview") }}
                        </h1>
                        <div class="flex items-center gap-2">
                            <!-- 清除记录 -->
                            <UButton
                                icon="i-lucide-refresh-cw"
                                color="primary"
                                variant="ghost"
                                @click="previewChatRef?.clearRecord()"
                            />
                            <UButton
                                icon="i-lucide-settings-2"
                                color="primary"
                                :variant="showVariableInput ? 'soft' : 'ghost'"
                                @click="handleVariableModalOpen"
                            />
                        </div>
                    </div>
                    <PreviewChat
                        v-model:agent="state"
                        ref="previewChatRef"
                        :show-variable-input="showVariableInput"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
