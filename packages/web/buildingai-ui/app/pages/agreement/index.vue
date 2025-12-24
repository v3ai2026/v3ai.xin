<script lang="ts" setup>
import { apiGetAgreementConfig } from "@buildingai/service/common";

/**
 * @fileoverview Agreement page component
 * @description This page displays policy agreements including service terms,
 * privacy policy, and payment terms with navigation and content display.
 *
 * @author BuildingAI Teams
 */

/** Agreement item interface */
export interface AgreementItem {
    /** Agreement title */
    title: string;
    /** Agreement type */
    type: string;
    /** Agreement content */
    content: string;
    /** Last update time */
    updateAt: string;
}

/** Agreement menu item interface */
export interface AgreementMenuItem {
    /** Menu ID */
    id: string;
    /** Menu label */
    label: string;
    /** Menu value */
    value: string;
    /** Whether to expand by default */
    defaultOpen?: boolean;
    /** Sub-item list */
    list: AgreementItem[];
}

useHead({
    title: "Policy Agreements",
});

definePageMeta({
    layout: "full-screen",
    auth: false,
});

const route = useRoute();

// Get agreement configuration data using SSR
const { data: agreementConfigData, pending: configLoading } = await useAsyncData(
    () => apiGetAgreementConfig(),
    {
        transform: (data) => {
            const agreement = data.agreement;
            if (!agreement) {
                console.warn("Agreement configuration not found");
                return [];
            }

            const agreementList: AgreementItem[] = [];

            // Add service agreement
            if (agreement.serviceTitle && agreement.serviceContent) {
                agreementList.push({
                    title: agreement.serviceTitle,
                    type: "service",
                    content: agreement.serviceContent,
                    updateAt: agreement.updateAt || new Date().toISOString(),
                });
            }

            // Add privacy agreement
            if (agreement.privacyTitle && agreement.privacyContent) {
                agreementList.push({
                    title: agreement.privacyTitle,
                    type: "privacy",
                    content: agreement.privacyContent,
                    updateAt: agreement.updateAt || new Date().toISOString(),
                });
            }

            // Add payment agreement
            if (agreement.paymentTitle && agreement.paymentContent) {
                agreementList.push({
                    title: agreement.paymentTitle,
                    type: "payment",
                    content: agreement.paymentContent,
                    updateAt: agreement.updateAt || new Date().toISOString(),
                });
            }

            return agreementList;
        },
    },
);

// If no agreement data is found, throw 404 error
if (!agreementConfigData.value || agreementConfigData.value.length === 0) {
    console.error("Agreement configuration data not found");
}

const isOpen = ref<boolean>(false);
defineShortcuts({
    o: () => (isOpen.value = !isOpen.value),
});

const contentLoading = ref<boolean>(false);

// Currently displayed agreement content
const currentAgreement = ref<AgreementItem | null>(null);

// Build menu item data
const items = computed<AgreementMenuItem[]>(() => [
    {
        id: "agreement",
        value: "agreement",
        label: "Policy Agreements",
        defaultOpen: true,
        list: agreementConfigData.value || [],
    },
]);

/**
 * Switch displayed content
 * @param id Menu item ID
 * @param item Agreement item data
 */
async function changeContent(id: string, item: AgreementItem) {
    contentLoading.value = true;

    // Immediately update current displayed content
    currentAgreement.value = item;

    // Update URL parameters
    await navigateTo(
        {
            path: "/agreement",
            query: {
                type: id,
                item: item.type,
            },
        },
        {
            replace: true,
        },
    );

    await nextTick();
    document.getElementById("__read_area__")?.scrollTo({ top: 0, behavior: "smooth" });
    contentLoading.value = false;
}

// Watch route changes to sync current agreement
watch(
    () => route.query,
    (newQuery) => {
        const activeType = newQuery.type as string;
        const activeItem = newQuery.item as string;
        const agreementList = agreementConfigData.value || [];

        if (activeType === "agreement" && activeItem) {
            const targetItem = agreementList.find((item) => item.type === activeItem);
            if (targetItem) {
                currentAgreement.value = targetItem;
                return;
            }
        }

        // If no corresponding agreement is found or no parameters, display the first agreement
        if (agreementList[0] && !currentAgreement.value) {
            currentAgreement.value = agreementList[0];
        }
    },
    { immediate: true },
);
</script>

<template>
    <div class="bg-background flex size-full overflow-hidden">
        <div class="fixed bottom-1/2 left-0 md:hidden">
            <UButton icon="tabler:list" :ui="{ base: 'rounded-s-none' }" @click="isOpen = true" />
        </div>
        <USlideover v-model:open="isOpen" side="left" :ui="{ content: '!w-fit flex-0 max-w-fit' }">
            <template #content>
                <div class="relative flex h-full w-52 flex-col">
                    <div class="absolute -right-7 bottom-1/2 md:hidden">
                        <UButton
                            icon="tabler:text-wrap"
                            :ui="{ base: 'rounded-s-none' }"
                            @click="isOpen = false"
                        />
                    </div>
                    <div class="flex-1 overflow-hidden">
                        <BdScrollArea class="h-full px-4">
                            <UAccordion
                                :items="items"
                                type="multiple"
                                style="--ui-border: transparent"
                                :default-value="['agreement']"
                                :ui="{
                                    trigger: 'text-md',
                                    trailingIcon: 'size-4',
                                }"
                            >
                                <template #content="{ item }">
                                    <div v-if="configLoading" class="h-full space-y-3">
                                        <USkeleton class="h-6 w-full" />
                                        <USkeleton class="h-6 w-full" />
                                        <USkeleton class="h-6 w-full" />
                                    </div>
                                    <div v-else class="flex flex-col gap-3">
                                        <div
                                            v-for="listItem in (item as AgreementMenuItem).list"
                                            :key="listItem.type"
                                            class="hover:text-foreground active:text-primary cursor-pointer truncate pr-3 pl-6"
                                            :class="{
                                                'text-primary hover:text-primary!':
                                                    listItem.type === currentAgreement?.type,
                                            }"
                                            @click="
                                                () => {
                                                    changeContent(
                                                        (item as AgreementMenuItem).id,
                                                        listItem,
                                                    );
                                                    isOpen = false;
                                                }
                                            "
                                        >
                                            {{ listItem.title }}
                                        </div>
                                    </div>
                                </template>
                            </UAccordion>
                        </BdScrollArea>
                    </div>
                    <div class="mt-auto px-4 py-2">
                        <ClientOnly>
                            <BdThemeToggle />
                        </ClientOnly>
                    </div>
                </div>
            </template>
        </USlideover>
        <div class="bg-muted w-0 overflow-x-hidden transition-[width] md:w-44 lg:w-52">
            <div class="flex h-full w-full min-w-44 flex-col gap-4">
                <div class="flex-1 overflow-hidden">
                    <BdScrollArea class="h-full pr-4 pl-2">
                        <UAccordion
                            :items="items"
                            type="multiple"
                            :default-value="['agreement']"
                            style="--ui-border: transparent"
                            :ui="{ trailingIcon: 'size-4' }"
                        >
                            <template #content="{ item }">
                                <div v-if="configLoading" class="h-full space-y-3">
                                    <USkeleton class="h-6 w-full" />
                                    <USkeleton class="h-6 w-full" />
                                    <USkeleton class="h-6 w-full" />
                                </div>
                                <div v-else class="flex flex-col gap-3 text-sm">
                                    <div
                                        v-for="listItem in (item as AgreementMenuItem).list"
                                        :key="listItem.type"
                                        class="hover:text-foreground active:text-primary cursor-pointer truncate pr-3 pl-6"
                                        :class="{
                                            'text-primary hover:text-primary!':
                                                listItem.type === currentAgreement?.type,
                                        }"
                                        @click="
                                            changeContent((item as AgreementMenuItem).id, listItem)
                                        "
                                    >
                                        {{ listItem.title }}
                                    </div>
                                </div>
                            </template>
                        </UAccordion>
                    </BdScrollArea>
                </div>
                <div class="mt-auto px-4 py-2">
                    <ClientOnly>
                        <BdThemeToggle />
                    </ClientOnly>
                </div>
            </div>
        </div>
        <div id="__read_area__" class="flex-1 overflow-y-auto">
            <div class="mx-auto flex w-full flex-col gap-4 p-6 md:max-w-prose">
                <div v-if="contentLoading" class="space-y-4">
                    <USkeleton class="h-6 w-[250px]" />
                    <USkeleton class="h-4 w-[200px]" />
                    <div class="mt-8! space-y-6">
                        <USkeleton v-for="item in 15" :key="item" class="h-4 w-full" />
                    </div>
                </div>
                <div v-else class="space-y-4">
                    <h1 class="text-2xl font-medium">
                        {{ currentAgreement?.title }}
                    </h1>
                    <p class="text-foreground/60 text-xs">
                        {{ $t("common.updateAt") }}:
                        <TimeDisplay
                            v-if="currentAgreement?.updateAt"
                            :datetime="currentAgreement.updateAt"
                            mode="datetime"
                        />
                        <span v-else>-</span>
                    </p>
                    <div
                        v-dompurify-html="currentAgreement?.content"
                        class="prose dark:prose-invert"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
