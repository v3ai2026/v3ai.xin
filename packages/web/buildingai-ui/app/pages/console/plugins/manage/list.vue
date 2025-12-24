<script lang="ts" setup>
import {
    ExtensionStatus,
    ExtensionSupportTerminal,
    ExtensionType,
} from "@buildingai/constants/shared";
import { ROUTES } from "@buildingai/constants/web/routes.constant";
import type {
    ExtensionFormData,
    ExtensionQueryRequest,
} from "@buildingai/service/consoleapi/extensions";
import {
    // apiDeleteExtension,
    apiDisableExtension,
    apiEnableExtension,
    apiGetExtensionList,
    apiInstallExtension,
    apiUninstallExtension,
    apiUpgradeExtension,
} from "@buildingai/service/consoleapi/extensions";
import type { TabsItem } from "@nuxt/ui";

const ExtensionChangelogDrawer = defineAsyncComponent(() => import("../components/changelog.vue"));
const ExtensionDetailDrawer = defineAsyncComponent(() => import("../components/details.vue"));
const AddLocalExtension = defineAsyncComponent(() => import("../components/add-extension.vue"));
const FeatureConfigModal = defineAsyncComponent(() => import("../components/feature-config.vue"));

const { t } = useI18n();
const overlay = useOverlay();
const toast = useMessage();

const extensionTypeItems: TabsItem[] = [
    {
        label: t("extensions.manage.tabs.all"),
        value: "all",
    },
    {
        label: t("extensions.manage.tabs.installed"),
        value: "installed",
    },
    {
        label: t("extensions.manage.tabs.uninstalled"),
        value: "uninstalled",
    },
];

const selectedTab = shallowRef("all");

const searchForm = shallowReactive<ExtensionQueryRequest>({
    type: undefined,
});

const getTerminalLabel = (terminalType: number): string => {
    const terminalMap: Record<number, string> = {
        [ExtensionSupportTerminal.WEB]: t("extensions.modal.terminalTypes.web"),
        [ExtensionSupportTerminal.WEIXIN]: t("extensions.modal.terminalTypes.weixin"),
        [ExtensionSupportTerminal.H5]: t("extensions.modal.terminalTypes.h5"),
        [ExtensionSupportTerminal.MP]: t("extensions.modal.terminalTypes.mp"),
        [ExtensionSupportTerminal.API]: t("extensions.modal.terminalTypes.api"),
    };
    return terminalMap[terminalType] || t("extensions.manage.unknown");
};

const { paging, getLists } = usePaging({
    fetchFun: apiGetExtensionList,
    params: searchForm,
});

const hasMore = computed(() => paging.items.length < paging.total);

const loadMore = () => {
    if (paging.loading) return;
    paging.page++;
    getLists({ append: true });
};

const handleSearch = useDebounceFn(() => {
    paging.page = 1;
    getLists();
}, 500);

const handleTabChange = (value: string | number) => {
    selectedTab.value = String(value);
    const tabValue = selectedTab.value;
    if (tabValue === "all") {
        delete searchForm.isInstalled;
    } else {
        searchForm.isInstalled = tabValue === "installed";
    }
    paging.page = 1;
    getLists();
};

const handleNavigate = (extension: ExtensionFormData) => {
    window.open(`${ROUTES.EXTENSION}/${extension.identifier}/buildingai-middleware`, "_blank");
};

const installingMap = reactive<Record<string, boolean>>({});
const upgradingMap = reactive<Record<string, boolean>>({});

const handleInstall = async (extension: ExtensionFormData) => {
    if (installingMap[extension.identifier]) {
        return;
    }

    try {
        installingMap[extension.identifier] = true;
        await apiInstallExtension(extension.identifier);
        paging.page = 1;
        await getLists();
        toast.success(t("console-common.messages.success"));
    } catch (error) {
        console.error("安装插件失败:", error);
    } finally {
        installingMap[extension.identifier] = false;
    }
};

const handleUpgrade = async (extension: ExtensionFormData) => {
    if (upgradingMap[extension.identifier]) {
        return;
    }

    try {
        upgradingMap[extension.identifier] = true;
        await apiUpgradeExtension(extension.identifier);
        paging.page = 1;
        await getLists();
        toast.success(t("console-common.messages.success"));
    } catch (error) {
        console.error("更新插件失败:", error);
    } finally {
        upgradingMap[extension.identifier] = false;
    }
};

const { lockFn: handleUninstall } = useLockFn(async (extension: ExtensionFormData) => {
    try {
        await apiUninstallExtension(extension.identifier);
        paging.page = 1;
        await getLists();
        toast.success(t("console-common.messages.success"));
    } catch (error) {
        console.error("卸载插件失败:", error);
    }
});

// const handleDelete = async (extension: ExtensionFormData) => {
//     await apiDeleteExtension(extension.id);
//     getLists();
// };

const handleEnable = async (extension: ExtensionFormData) => {
    try {
        await apiEnableExtension(extension.id);
        paging.page = 1;
        await getLists();
        toast.success(t("console-common.messages.success"));
    } catch (error) {
        console.error("启用插件失败:", error);
    }
};

const handleDisable = async (extension: ExtensionFormData) => {
    try {
        await apiDisableExtension(extension.id);
        paging.page = 1;
        await getLists();
        toast.success(t("console-common.messages.success"));
    } catch (error) {
        console.error("禁用插件失败:", error);
    }
};

const handleFeatureConfig = (extension: ExtensionFormData) => {
    const modal = overlay.create(FeatureConfigModal);
    modal.open({ extension });
};

const handleLocal = async (extension: ExtensionFormData, flag: boolean) => {
    const modal = overlay.create(AddLocalExtension);
    const instance = modal.open({
        isEdit: flag,
        id: extension.id,
        initialData: {
            name: extension.name,
            packName: extension.identifier,
            description: extension.description,
            version: extension.version,
            icon: extension.icon,
            type: extension.type,
            supportTerminal: extension.supportTerminal || [],
            author: extension.author || {
                avatar: "",
                name: "",
                homepage: "",
            },
        },
    });
    const shouldRefresh = await instance.result;
    if (shouldRefresh) {
        paging.page = 1;
        getLists();
    }
};

const toStore = () => {
    window.open("https://buildingai.cc/plugin");
};

const handleDetailExtension = (extension: ExtensionFormData) => {
    const modal = overlay.create(ExtensionDetailDrawer);
    modal.open({
        isIdentifier: extension.isLocal,
        extensionId: extension.id as string,
        identifier: extension.identifier as string,
    });
};

const handleChangelogExtension = (extension: ExtensionFormData) => {
    const modal = overlay.create(ExtensionChangelogDrawer);
    modal.open({
        extension: extension,
        identifier: extension.identifier,
    });
};

onMounted(() => getLists());
</script>

<template>
    <div class="extension-manage-container flex h-full flex-col pb-5">
        <div class="header bg-background sticky top-0 z-10 pb-6">
            <div class="space-y-4">
                <div class="flex w-full flex-wrap justify-between gap-4">
                    <div class="flex items-end justify-end">
                        <UTabs
                            :items="extensionTypeItems"
                            v-model="selectedTab"
                            @update:model-value="handleTabChange"
                            class="block w-auto"
                        />
                    </div>

                    <div class="flex items-center gap-4">
                        <UInput
                            v-model="searchForm.name"
                            :placeholder="t('extensions.manage.search')"
                            @update:model-value="handleSearch"
                        />
                        <USelect
                            v-model="searchForm.type"
                            :items="[
                                {
                                    label: t('extensions.manage.filters.allTypes'),
                                    value: undefined,
                                },
                                {
                                    label: t('extensions.modal.extensionTypes.application'),
                                    value: ExtensionType.APPLICATION,
                                },
                                {
                                    label: t('extensions.modal.extensionTypes.function'),
                                    value: ExtensionType.FUNCTIONAL,
                                },
                            ]"
                            class="block w-auto"
                            :placeholder="t('extensions.manage.selectType')"
                        />
                        <UButton
                            icon="i-lucide-plus"
                            color="primary"
                            @click="handleLocal({} as ExtensionFormData, false)"
                        >
                            {{ t("extensions.manage.add") }}
                        </UButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty state -->
        <div
            v-if="!paging.loading && paging.items.length === 0"
            class="relative grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
            <div class="z-10 h-[170px] rounded-lg border border-dashed p-4">
                <div class="flex flex-col">
                    <h3 class="text-muted-foreground pb-2 pl-2 text-xs font-bold">
                        {{ t("extensions.manage.add") }}
                    </h3>
                    <div
                        class="text-primary hover:bg-primary-50 flex cursor-pointer items-center rounded-lg px-2 py-2 text-sm"
                        @click="handleLocal({} as ExtensionFormData, false)"
                    >
                        <UIcon name="i-lucide-file-plus-2" class="mr-2 size-4" />
                        <span>{{ t("extensions.manage.add") }}</span>
                    </div>
                    <div
                        class="text-primary hover:bg-primary-50 flex cursor-pointer items-center rounded-lg px-2 py-2 text-sm"
                        @click="toStore"
                    >
                        <UIcon name="i-lucide-external-link" class="mr-2 size-4" />
                        <span>{{ t("extensions.manage.store") }}</span>
                    </div>
                </div>
            </div>
            <div
                class="absolute top-0 right-0 bottom-0 left-0 flex h-[calc(100vh-12rem)] items-center justify-center"
            >
                <span class="text-muted-foreground text-sm font-medium">
                    {{ t("extensions.manage.empty.description") }}
                </span>
            </div>
        </div>

        <div v-else class="grid h-[calc(100vh-12rem)]">
            <BdScrollArea class="h-full" :shadow="false">
                <BdInfiniteScroll
                    :loading="paging.loading"
                    :has-more="hasMore"
                    :loading-text="t('extensions.manage.loadingText')"
                    :no-more-text="paging.page !== 1 ? t('extensions.manage.noMoreText') : ' '"
                    @load-more="loadMore"
                >
                    <div
                        class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                        <!-- Extension Cards -->
                        <div class="h-[170px] rounded-lg border border-dashed p-4">
                            <div class="flex flex-col">
                                <h3 class="text-muted-foreground pb-2 pl-2 text-xs font-bold">
                                    {{ t("extensions.manage.add") }}
                                </h3>
                                <div
                                    class="text-primary hover:bg-primary-50 dark:hover:bg-primary/15 flex cursor-pointer items-center rounded-lg px-2 py-2 text-sm"
                                    @click="handleLocal({} as ExtensionFormData, false)"
                                >
                                    <UIcon name="i-lucide-file-plus-2" class="mr-2 size-4" />
                                    <span>{{ t("extensions.manage.add") }}</span>
                                </div>
                                <div
                                    class="text-primary hover:bg-primary-50 dark:hover:bg-primary/15 flex cursor-pointer items-center rounded-lg px-2 py-2 text-sm"
                                    @click="toStore"
                                >
                                    <UIcon name="i-lucide-external-link" class="mr-2 size-4" />
                                    <span>{{ t("extensions.manage.store") }}</span>
                                </div>
                            </div>
                        </div>
                        <div
                            v-for="extension in paging.items"
                            :key="extension.id"
                            class="bg-background border-muted relative h-[170px] overflow-hidden rounded-[6px] border border-solid transition duration-150 ease-out hover:shadow-[0_6px_8px_0_rgba(28,31,35,6%)]"
                        >
                            <div class="flex h-full w-full cursor-pointer flex-col p-4">
                                <!-- Top Section: Title and Avatar -->
                                <div class="flex justify-between">
                                    <!-- Left Content -->
                                    <div class="flex w-[calc(100%-76px)] flex-col gap-1">
                                        <!-- Title with Verification -->
                                        <div class="flex items-center gap-1">
                                            <span
                                                class="text-foreground truncate text-[16px] leading-[22px] font-[500]"
                                            >
                                                {{ extension.name }}
                                            </span>
                                        </div>
                                        <!-- Description -->
                                        <span
                                            class="text-muted-foreground line-clamp-1 text-[14px] leading-[20px] font-normal wrap-break-word"
                                        >
                                            {{
                                                extension.description ||
                                                t("extensions.manage.noDescription")
                                            }}
                                            {{
                                                extension.description ||
                                                t("extensions.manage.noDescription")
                                            }}
                                            {{
                                                extension.description ||
                                                t("extensions.manage.noDescription")
                                            }}
                                        </span>

                                        <div class="mt-1.5 flex items-center gap-2">
                                            <UBadge
                                                v-if="extension.version"
                                                color="neutral"
                                                variant="soft"
                                                :label="`v${extension.version}`"
                                            />
                                            <UBadge
                                                v-if="extension.isInstalled"
                                                :color="
                                                    extension.status === ExtensionStatus.ENABLED
                                                        ? 'success'
                                                        : 'neutral'
                                                "
                                                variant="soft"
                                                :label="
                                                    extension.status === ExtensionStatus.ENABLED
                                                        ? t('extensions.manage.enable')
                                                        : t('extensions.manage.disable')
                                                "
                                            />
                                            <UBadge
                                                v-for="supportTerminal in extension.supportTerminal"
                                                :color="
                                                    supportTerminal === ExtensionSupportTerminal.WEB
                                                        ? 'success'
                                                        : supportTerminal ===
                                                            ExtensionSupportTerminal.API
                                                          ? 'info'
                                                          : 'neutral'
                                                "
                                                variant="soft"
                                                :label="getTerminalLabel(supportTerminal)"
                                            />
                                        </div>
                                    </div>
                                    <!-- Right Avatar -->
                                    <div
                                        class="ml-[12px] h-[64px] w-[64px] flex-none overflow-hidden rounded-[10px]"
                                    >
                                        <UAvatar
                                            :src="extension.icon"
                                            :alt="extension.name"
                                            icon="i-lucide-puzzle"
                                            :ui="{
                                                root: `size-full rounded-md ${extension.icon ? '' : 'bg-primary'}`,
                                                icon: 'size-7 text-white',
                                            }"
                                        >
                                        </UAvatar>
                                    </div>
                                </div>

                                <!-- Tag Section -->

                                <!-- User Info Section -->
                                <div class="mt-auto flex items-center justify-between">
                                    <div class="flex items-center gap-1 text-xs">
                                        <UAvatar
                                            color="primary"
                                            size="xs"
                                            :src="extension.author?.avatar"
                                            :ui="{ root: 'rounded-full bg-primary size-5' }"
                                        >
                                            <UIcon name="i-lucide-user" class="size-3 text-white" />
                                        </UAvatar>
                                        <div class="text-nowrap">
                                            {{
                                                extension.author.name ||
                                                t("extensions.manage.unknownAuthor")
                                            }}
                                        </div>
                                    </div>

                                    <!-- Bottom Actions -->
                                    <div class="bg-background flex items-center gap-2">
                                        <div
                                            class="text-error flex items-center gap-1"
                                            v-if="!extension.isCompatible"
                                        >
                                            <UIcon
                                                name="i-lucide-circle-alert"
                                                class="size-3.5 cursor-pointer"
                                            />
                                            <span class="text-xs leading-none">
                                                {{ $t("extensions.manage.incompatible") }}
                                            </span>
                                        </div>
                                        <UTooltip
                                            v-if="
                                                extension.type === ExtensionType.APPLICATION &&
                                                extension.isInstalled &&
                                                extension.status === ExtensionStatus.ENABLED &&
                                                extension.isCompatible
                                            "
                                            :text="t('extensions.manage.manage')"
                                        >
                                            <UButton
                                                color="primary"
                                                icon="i-lucide-settings"
                                                variant="soft"
                                                size="sm"
                                                :label="t('extensions.manage.manage')"
                                                @click="handleNavigate(extension)"
                                            />
                                        </UTooltip>

                                        <UTooltip
                                            v-if="
                                                extension.type === ExtensionType.APPLICATION &&
                                                extension.isInstalled &&
                                                extension.status === ExtensionStatus.DISABLED &&
                                                extension.isCompatible
                                            "
                                            :text="t('extensions.manage.enable')"
                                        >
                                            <UButton
                                                color="primary"
                                                icon="i-lucide-power"
                                                variant="soft"
                                                size="sm"
                                                :label="t('extensions.manage.enable')"
                                                @click="handleEnable(extension)"
                                            />
                                        </UTooltip>

                                        <UButton
                                            v-if="!extension.isInstalled && extension.isCompatible"
                                            color="primary"
                                            variant="solid"
                                            icon="i-lucide-download"
                                            size="sm"
                                            :loading="installingMap[extension.identifier]"
                                            :label="$t('extensions.manage.install')"
                                            @click="handleInstall(extension)"
                                        />

                                        <UButton
                                            v-if="extension.hasUpdate"
                                            color="info"
                                            variant="subtle"
                                            icon="i-lucide-circle-fading-arrow-up"
                                            size="sm"
                                            :loading="upgradingMap[extension.identifier]"
                                            :label="$t('extensions.manage.upgrade')"
                                            @click="handleUpgrade(extension)"
                                        />

                                        <UDropdownMenu
                                            v-if="extension.isInstalled"
                                            :items="[
                                                [
                                                    {
                                                        label: t('extensions.manage.detail'),
                                                        icon: 'i-lucide-info',
                                                        onSelect: () =>
                                                            handleDetailExtension(extension),
                                                    },
                                                    extension.isLocal
                                                        ? undefined
                                                        : {
                                                              label: t('extensions.manage.logs'),
                                                              icon: 'i-lucide-file-text',
                                                              onSelect: () =>
                                                                  handleChangelogExtension(
                                                                      extension,
                                                                  ),
                                                          },
                                                    {
                                                        label: t('extensions.manage.featureConfig'),
                                                        icon: 'i-lucide-settings',
                                                        onSelect: () =>
                                                            handleFeatureConfig(extension),
                                                    },
                                                ].filter((item) => item !== undefined),
                                                [
                                                    {
                                                        label:
                                                            extension.status ===
                                                            ExtensionStatus.ENABLED
                                                                ? t('extensions.manage.disable')
                                                                : t('extensions.manage.enable'),
                                                        icon:
                                                            extension.status ===
                                                            ExtensionStatus.ENABLED
                                                                ? 'i-lucide-power-off'
                                                                : 'i-lucide-power',
                                                        color:
                                                            extension.status ===
                                                            ExtensionStatus.ENABLED
                                                                ? 'warning'
                                                                : 'success',
                                                        disabled: !extension.isCompatible,
                                                        onSelect: () => {
                                                            if (
                                                                extension.status ===
                                                                ExtensionStatus.ENABLED
                                                            ) {
                                                                handleDisable(extension);
                                                            } else {
                                                                handleEnable(extension);
                                                            }
                                                        },
                                                    },
                                                ],
                                                [
                                                    extension.isLocal
                                                        ? {
                                                              label: t('console-common.edit'),
                                                              icon: 'i-lucide-pen-line',
                                                              onSelect: () =>
                                                                  handleLocal(extension, true),
                                                          }
                                                        : undefined,
                                                    {
                                                        label: t('extensions.manage.uninstall'),
                                                        icon: 'i-lucide-trash-2',
                                                        color: 'error',
                                                        onSelect: () => {
                                                            handleUninstall(extension);
                                                        },
                                                    },
                                                ].filter((item) => item !== undefined),
                                            ]"
                                            :content="{
                                                align: 'end',
                                                side: 'bottom',
                                                sideOffset: 4,
                                            }"
                                            :ui="{ content: 'w-32', itemLeadingIcon: 'size-4' }"
                                        >
                                            <UButton
                                                icon="i-lucide-ellipsis-vertical"
                                                color="neutral"
                                                variant="ghost"
                                                size="sm"
                                            />
                                        </UDropdownMenu>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </BdInfiniteScroll>
            </BdScrollArea>
        </div>
    </div>
</template>
