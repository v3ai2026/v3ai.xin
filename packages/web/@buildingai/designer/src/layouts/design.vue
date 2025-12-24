<script setup lang="ts">
import { useDesignStore } from "../stores/design";

const { t } = useI18n();
const router = useRouter();
const design = useDesignStore();
const appStore = useAppStore();

const isOpen = shallowRef(false);

const { lockFn: handlePublish, isLock } = useLockFn(async () => {
    await design.savePages();
    useMessage().success(t("console-widgets.designer.saveSuccess"));
    setTimeout(() => router.back(), 1000);
});

/**
 * 离开页面处理
 * 根据是否有未保存的更改决定是否显示确认弹窗
 */
function handleBack() {
    const leaveAction = () => {
        design.resetState();
        router.back();
    };

    // 没有未保存的更改，直接离开
    if (!design.isDirty) {
        leaveAction();
        return;
    }

    // 有未保存的更改，显示确认弹窗
    useModal({
        title: t("console-common.tips"),
        description: t("console-common.messages.confirmLeave"),
        confirmText: t("console-common.confirm"),
        cancelText: t("console-common.cancel"),
    }).then(leaveAction);
}

/**
 * 浏览器页面离开前确认
 * 只有在有未保存的更改时才阻止页面离开
 */
onMounted(() => {
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
        if (design.isDirty) {
            e.preventDefault();
            return t("console-common.messages.confirmLeave");
        }
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);
    onBeforeUnmount(() => {
        window.removeEventListener("beforeunload", beforeUnloadHandler);
    });
});
</script>

<template>
    <!-- 设计器布局容器 -->
    <div class="design-layout dark:bg-muted flex h-screen w-full flex-col bg-[#f7f7fc] pb-2">
        <!-- 顶部导航栏 -->
        <div class="relative flex h-14 items-center px-5">
            <!-- 左侧：返回按钮和项目信息 -->
            <div class="flex items-center gap-x-2">
                <UButton
                    color="neutral"
                    icon="i-lucide-chevron-left"
                    variant="ghost"
                    class="hover:bg-[#ebecf5]"
                    @click="handleBack"
                />

                <!-- 项目信息区域 -->
                <div class="flex items-center gap-x-2 leading-[30px]">
                    <!-- 项目图标 -->

                    <h1 class="flex size-8 items-center justify-center rounded-lg">
                        <NuxtImg
                            v-if="appStore.siteConfig?.webinfo.logo"
                            :src="appStore.siteConfig?.webinfo.logo"
                            alt="Logo"
                            class="size-8"
                        />
                        <UIcon v-else name="system-logo" class="text-background size-8" />
                    </h1>

                    <!-- 项目名称 -->
                    <div class="text-base">
                        {{ design.projectName }}
                    </div>

                    <!-- 项目名称编辑器 -->
                    <BdModal
                        v-model:open="isOpen"
                        :title="t('console-widgets.designer.editProjectName')"
                        :ui="{ content: 'max-w-md' }"
                        :showFooter="true"
                    >
                        <template #trigger>
                            <div
                                class="hover:text-primary hover:bg-primary-light-9 flex cursor-pointer items-center rounded-lg p-2"
                            >
                                <UIcon name="i-lucide-edit" class="size-4" />
                            </div>
                        </template>

                        <div class="space-y-4 pb-8">
                            <UFormField
                                :label="t('console-widgets.designer.pageName')"
                                name="name"
                                required
                            >
                                <UInput
                                    v-model="design.projectName"
                                    :placeholder="t('console-widgets.designer.enterPageName')"
                                    maxlength="32"
                                    show-count
                                    size="lg"
                                    :ui="{ root: 'w-full' }"
                                />
                            </UFormField>
                        </div>
                    </BdModal>
                </div>
            </div>

            <!-- 中间：界面设置区域 - 使用绝对定位实现真正居中 -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div class="dark:bg-accent rounded-lg bg-[#ebecf5] px-1.5 py-1">
                    <div class="bg-background flex items-center rounded-lg px-2 py-1">
                        <UIcon name="i-lucide-palette" class="size-4" />
                        <span class="mx-2 text-sm leading-5 font-medium">
                            {{ $t("console-common.userInterface") }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- 右侧：操作按钮组 -->
            <div class="ml-auto flex items-center gap-2">
                <!-- 保存按钮 -->
                <UButton color="primary" :loading="isLock" @click="handlePublish">
                    {{ $t("console-common.save") }}
                </UButton>
            </div>
        </div>

        <!-- 主要内容区域 -->
        <main class="relative flex h-full w-full gap-3 px-2">
            <NuxtPage />
        </main>
    </div>
</template>
