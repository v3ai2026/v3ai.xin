<script setup lang="ts">
import type { Agent, AgentChatMessage } from "@buildingai/service/consoleapi/ai-agent";
import { apiGetAgentChatsMessages } from "@buildingai/service/consoleapi/ai-agent";
import type { AiMessage } from "@buildingai/service/models/message";

const ChatContextModal = defineAsyncComponent(
    () => import("~/components/ask-assistant-chat/chats-context-modal.vue"),
);

const props = defineProps<{
    open: boolean;
    recordId: string;
    agentId?: string;
}>();
const emit = defineEmits<{
    (e: "update:open", value: boolean): void;
}>();

const { t } = useI18n();
const toast = useMessage();
const scrollAreaRef = useTemplateRef<{
    scrollToBottom: (animate?: boolean) => void;
    getViewportElement: () => { viewportElement: HTMLElement };
}>("scrollAreaRef");
const { height: scrollAreaHeight } = useElementSize(
    scrollAreaRef as unknown as Ref<HTMLElement | undefined>,
);
const overlay = useOverlay();

const messages = shallowRef<AgentChatMessage[]>([]);
const loading = shallowRef(false);
const queryPaging = reactive({ page: 1, pageSize: 20 });
const hasMore = shallowRef(false);
const isAtBottom = shallowRef(true);
const agents = inject<Ref<Agent>>("agents");

// 双向绑定 open
const isOpen = computed({
    get: () => props.open,
    set: (value) => emit("update:open", value),
});

const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    const threshold = 40;
    isAtBottom.value = target.scrollHeight - (target.scrollTop + target.clientHeight) <= threshold;
};

const loadMessages = async (reset = false) => {
    if (!props.recordId) return;

    if (reset) {
        queryPaging.page = 1;
        messages.value = [];
    }

    loading.value = true;
    try {
        const data = await apiGetAgentChatsMessages(props.recordId, queryPaging);
        const newMessages = (data.items || []).reverse() as unknown as AgentChatMessage[];

        messages.value = reset ? newMessages : [...newMessages, ...messages.value];
        hasMore.value = data.total > messages.value.length;
    } catch (error: unknown) {
        console.error("加载消息失败:", error);
    } finally {
        loading.value = false;
    }
};

const loadMoreMessages = async () => {
    if (!hasMore.value || loading.value) return;

    queryPaging.page++;
    try {
        await loadMessages(false);
    } catch (_error) {
        queryPaging.page--;
        hasMore.value = true;
    }
};

const scrollToBottom = async (animate = true) => {
    await nextTick();
    console.log("scrollToBottom", scrollAreaRef.value);
    scrollAreaRef.value?.scrollToBottom(animate);
};

const openContextModal = (context: AiMessage[]) => {
    const modal = overlay.create(ChatContextModal);
    modal.open({ context });
};

watch(
    () => [props.recordId, props.open] as const,
    async ([newRecordId, isOpen]) => {
        if (isOpen && newRecordId) {
            await loadMessages(true);
            await scrollToBottom(false);
        }
    },
    { immediate: true },
);

onMounted(() => {
    const viewportEl = scrollAreaRef.value?.getViewportElement()?.viewportElement as HTMLElement;

    if (viewportEl) {
        viewportEl.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll({ target: viewportEl } as unknown as Event);

        const mutationObserver = new MutationObserver(() => {
            if (isAtBottom.value) scrollToBottom(false);
        });

        mutationObserver.observe(viewportEl, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        onUnmounted(() => {
            viewportEl.removeEventListener("scroll", handleScroll);
            mutationObserver.disconnect();
        });
    }
});
</script>
<template>
    <div>
        <UDrawer
            v-model:open="isOpen"
            :set-background-color-on-scale="false"
            direction="right"
            should-scale-background
            :handle-only="true"
            class="bg-muted w-full max-w-xl"
        >
            <template #content>
                <div class="flex h-full w-full flex-col">
                    <!-- 头部 -->
                    <div class="flex items-center justify-between p-4">
                        <div class="flex items-center gap-3">
                            <UIcon name="i-lucide-message-circle" class="text-primary size-5" />
                            <h2 class="text-lg font-semibold">
                                {{ t("ai-agent.backend.logs.dialogMessage") }}
                            </h2>
                        </div>
                        <UButton
                            icon="i-lucide-x"
                            color="neutral"
                            variant="ghost"
                            @click="isOpen = false"
                        />
                    </div>

                    <!-- 消息内容 -->
                    <div class="flex h-full min-h-0 flex-1 flex-col">
                        <!-- 加载状态 -->
                        <div
                            v-if="loading && messages.length === 0"
                            class="flex h-full items-center justify-center"
                        >
                            <div class="text-muted-foreground flex items-center gap-2 text-sm">
                                <UIcon name="i-lucide-loader-2" class="size-4 animate-spin" />
                                {{ t("console-ai-agent.logs.loadingMessages") }}
                            </div>
                        </div>

                        <!-- 空状态 -->
                        <div
                            v-else-if="!loading && messages.length === 0"
                            class="flex h-full items-center justify-center"
                        >
                            <div class="text-muted-foreground text-center">
                                <UIcon
                                    name="i-lucide-message-circle-x"
                                    class="mx-auto mb-2 size-12"
                                />
                                <p>{{ t("console-ai-agent.logs.noMessages") }}</p>
                            </div>
                        </div>
                        <!-- 消息 -->
                        <BdScrollArea
                            v-else
                            class="h-full min-h-0 w-full"
                            type="auto"
                            ref="scrollAreaRef"
                            @in-view="scrollToBottom(false)"
                        >
                            <BdChatScroll
                                :loading="loading"
                                :has-more="hasMore"
                                :threshold="500"
                                content-class="max-w-full w-full space-y-3 px-4"
                                @load-more="loadMoreMessages"
                            >
                                <ChatsMessages
                                    :messages="messages as AiMessage[]"
                                    :scroll-area-height="scrollAreaHeight"
                                    :assistant="{
                                        actions: [
                                            {
                                                label: t(
                                                    'console-ai-agent.configuration.chatContext',
                                                ),
                                                icon: 'i-lucide-file-type',
                                                show: !agents?.value?.showContext,
                                                onClick: (message: AiMessage) => {
                                                    if (message?.metadata?.context) {
                                                        openContextModal(message.metadata.context);
                                                    } else {
                                                        toast.error(
                                                            t(
                                                                'console-ai-agent.configuration.noChatContext',
                                                            ),
                                                        );
                                                    }
                                                },
                                            },
                                        ],
                                    }"
                                    :spacing-offset="160"
                                >
                                    <template #content="{ message }">
                                        <BdMarkdown
                                            v-if="
                                                message.content.length ||
                                                (message.metadata?.references &&
                                                    message.metadata.references.length)
                                            "
                                            :content="message.content.toString()"
                                            class="mb-2"
                                        >
                                            <template #after>
                                                <template
                                                    v-if="
                                                        message.metadata?.references &&
                                                        message.metadata.references.length > 0 &&
                                                        message.role === 'assistant'
                                                    "
                                                >
                                                    <!-- 知识库引用来源 -->
                                                    <div class="my-2 flex items-center gap-1">
                                                        <span
                                                            class="text-muted-foreground flex-none text-xs"
                                                        >
                                                            {{
                                                                t(
                                                                    "console-ai-agent.configuration.referenceTitle",
                                                                )
                                                            }}
                                                        </span>
                                                        <USeparator
                                                            size="xs"
                                                            type="dashed"
                                                            v-if="
                                                                message.metadata?.references &&
                                                                message.metadata.references.length >
                                                                    0 &&
                                                                message.role === 'assistant'
                                                            "
                                                        />
                                                    </div>
                                                    <KnowledgeReferenceFiles
                                                        :references="message.metadata.references"
                                                    />
                                                </template>

                                                <!-- 标注命中 -->
                                                <div
                                                    class="mt-2 flex items-center gap-1"
                                                    v-if="
                                                        message.metadata?.annotations &&
                                                        message.role === 'assistant'
                                                    "
                                                >
                                                    <span
                                                        class="text-muted-foreground flex-none text-xs"
                                                    >
                                                        {{
                                                            message.metadata?.annotations?.createdBy
                                                        }}
                                                        {{
                                                            t(
                                                                "console-ai-agent.configuration.editedAnswer",
                                                            )
                                                        }}
                                                    </span>
                                                    <USeparator size="xs" type="dashed" />
                                                </div>
                                            </template>
                                        </BdMarkdown>
                                    </template>
                                </ChatsMessages>
                            </BdChatScroll>
                        </BdScrollArea>
                    </div>
                </div>
            </template>
        </UDrawer>
    </div>
</template>
