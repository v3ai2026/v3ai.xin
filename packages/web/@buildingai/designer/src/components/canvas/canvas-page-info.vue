<script lang="ts" setup>
import { useCanvasMetrics } from "../../hooks/use-canvas-metrics";

const props = defineProps<{
    zoomScale: number;
}>();

const router = useRouter();
const { t } = useI18n();
const { designHeight, designStyle, changeDesignSize } = useCanvasMetrics();
</script>

<template>
    <UPopover
        :content="{
            align: 'center',
            side: 'top',
            sideOffset: 10,
        }"
    >
        <div
            class="hover:bg-primary-50 hover:text-primary-600 group bg-muted absolute bottom-full left-0 z-10 mb-2.5 flex h-7 cursor-pointer items-center rounded-md px-2 py-0.5 whitespace-nowrap transition-all duration-200"
            :style="{
                transform: `scale(${1 / (props.zoomScale >= 1.3 ? 1.3 : props.zoomScale)})`,
                transformOrigin: 'left bottom',
            }"
        >
            <span
                class="group-hover:text-primary-600 text-secondary-foreground text-sm leading-none font-medium"
            >
                {{ t("console-widgets.pageConfig.page") }}
            </span>

            <div class="bg-border mx-1.5 h-3 w-px"></div>

            <span class="group-hover:text-primary-600 text-muted text-sm leading-none">
                {{ designStyle.width }} * {{ designStyle.height }}
            </span>

            <UTooltip :text="$t('console-common.preview')" :popper="{ placement: 'top' }">
                <UIcon
                    name="i-heroicons-play-circle-20-solid"
                    class="group-hover:text-primary-600 text-muted ml-2 size-4"
                    @click="router.push('/console/decorate/micropage/preview')"
                />
            </UTooltip>
        </div>

        <template #content>
            <div class="w-80 p-4">
                <div class="space-y-3">
                    <div class="text-secondary-foreground text-sm font-medium">
                        {{ t("console-widgets.pageConfig.pageSettings") }}
                    </div>
                    <div class="space-y-2">
                        <label
                            class="text-muted-foreground text-xs font-medium tracking-wide uppercase"
                        >
                            {{ t("console-widgets.pageConfig.pageHeight") }}
                        </label>
                        <UInput
                            v-model="designHeight"
                            type="number"
                            :placeholder="t('console-widgets.pageConfig.inputPageHeight')"
                            @change="changeDesignSize"
                            :ui="{ root: 'w-full' }"
                        />
                    </div>
                </div>
            </div>
        </template>
    </UPopover>
</template>
