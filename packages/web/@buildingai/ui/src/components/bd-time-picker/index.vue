<script setup lang="ts">
import { DateFormatter } from "@internationalized/date";
import { computed, nextTick, onMounted, shallowRef, watch } from "vue";
import type { Composer } from "vue-i18n";

import { parseToDate } from "../../utils/date-format";
import BdScrollArea from "../bd-scroll-area/index.vue";
import type { TimePickerEmits, TimePickerProps } from "./types";

const { $i18n } = useNuxtApp();
const { t } = $i18n as Composer;

const props = withDefaults(defineProps<TimePickerProps>(), {
    modelValue: null,
    timeStyle: "medium",
    disabled: false,
    readonly: false,
    clearable: true,
    size: "md",
    showSeconds: true,
    icon: "i-lucide-clock-3",
    placement: "bottom-start",
});

const emit = defineEmits<TimePickerEmits>();

/** Whether the popup panel is open */
const isOpen = shallowRef(false);
/** Selected hour */
const selectedHour = shallowRef(0);
/** Selected minute */
const selectedMinute = shallowRef(0);
/** Selected second */
const selectedSecond = shallowRef(0);
/** Temporarily stored time value */
const tempTimeValue = shallowRef<Date | null>(null);
/** Hour selector DOM reference */
const hoursRef = useTemplateRef("hoursRef");
/** Minute selector DOM reference */
const minutesRef = useTemplateRef("minutesRef");
/** Second selector DOM reference */
const secondsRef = useTemplateRef("secondsRef");
/** Input box reference */
const inputRef = ref<HTMLInputElement | null>(null);

/** Formatted display time value */
const displayValue = computed(() => {
    const date = parseToDate(props.modelValue);
    if (!date) return "";
    const formatter = new DateFormatter("zh-CN", {
        dateStyle: undefined,
        timeStyle: props.timeStyle,
    });

    return formatter.format(date);
});

/** Format time unit */
const formatTimeUnit = (unit: number): string => {
    return unit.toString().padStart(2, "0");
};

/** Time unit type */
type TimeUnitType = "hour" | "minute" | "second";

/** Time unit configuration mapping */
const TIME_UNIT_CONFIG = {
    hour: {
        ref: () => hoursRef,
        selector: ".hour-item",
        max: 24,
        value: () => selectedHour,
    },
    minute: {
        ref: () => minutesRef,
        selector: ".minute-item",
        max: 60,
        value: () => selectedMinute,
    },
    second: {
        ref: () => secondsRef,
        selector: ".second-item",
        max: 60,
        value: () => selectedSecond,
    },
} as const;

/** Initialize time picker values */
const initTimeValue = () => {
    // If no value, use current time
    const date = parseToDate(props.modelValue) || new Date();
    selectedHour.value = date.getHours();
    selectedMinute.value = date.getMinutes();
    selectedSecond.value = date.getSeconds();
    tempTimeValue.value = new Date(date);
};

/** Update temporary time value */
const updateTempTimeValue = () => {
    tempTimeValue.value = new Date();
    tempTimeValue.value.setHours(selectedHour.value, selectedMinute.value, selectedSecond.value);
};

/** Handle popover state update */
const handlePopoverUpdate = (val: boolean) => {
    if (val) {
        // Initialize time value when opening panel
        initTimeValue();
        emit("open");
        scrollToSelected();
    } else {
        emit("close");
    }
};

/** Scroll to specified item and center display */
const scrollToItem = (type: TimeUnitType, index: number) => {
    nextTick(() => {
        const config = TIME_UNIT_CONFIG[type];
        const ref = config.ref().value;
        const viewport = ref?.getViewportElement?.()?.viewportElement;
        const items = viewport?.querySelectorAll(config.selector);
        const selectedItem = items?.[index];

        selectedItem?.scrollIntoView({ block: "center" });
    });
};

/** Scroll to all selected items */
const scrollToSelected = () => {
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
        scrollToItem("hour", selectedHour.value);
        scrollToItem("minute", selectedMinute.value);
        if (props.showSeconds) {
            scrollToItem("second", selectedSecond.value);
        }
    }, 50);
};

/** Handle scroll events and find the item closest to center */
const handleTimeScroll = (event: Event, type: TimeUnitType) => {
    if (!event.target) return;
    const target = event.target as HTMLElement;
    const { clientHeight } = target;
    const config = TIME_UNIT_CONFIG[type];
    const valueRef = config.value();

    // Get all items
    const items = target.querySelectorAll(config.selector);
    if (!items.length) return;

    // Find the item closest to center
    let closestItem: Element | null = null;
    let minDistance = Infinity;
    const centerY = target.getBoundingClientRect().top + clientHeight / 2;

    items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(itemCenter - centerY);

        if (distance < minDistance) {
            minDistance = distance;
            closestItem = item;
        }
    });

    // If found the item closest to center, update the selected value
    if (closestItem) {
        const value = parseInt((closestItem as HTMLElement).textContent?.trim() || "0");
        valueRef.value = value;
        updateTempTimeValue();
        // Use debounce function to ensure snapping occurs after scrolling stops
        debouncedSnap(type, value);
    }
};

// Use debounce to handle scroll end events
const debouncedSnap = useDebounceFn((type: TimeUnitType, value: number) => {
    scrollToItem(type, value);
}, 200);

/** Handle hour scroll events */
const handleHoursScroll = (event: Event) => {
    handleTimeScroll(event, "hour");
};

/** Handle minute scroll events */
const handleMinutesScroll = (event: Event) => {
    handleTimeScroll(event, "minute");
};

/** Handle second scroll events */
const handleSecondsScroll = (event: Event) => {
    handleTimeScroll(event, "second");
};

/** Handle time unit click */
const handleTimeUnitClick = (type: TimeUnitType, value: number) => {
    const valueRef = TIME_UNIT_CONFIG[type].value();
    valueRef.value = value;
    updateTempTimeValue();
    scrollToItem(type, value);
};

/** Handle hour click */
const handleHourClick = (hour: number) => {
    handleTimeUnitClick("hour", hour);
};

/** Handle minute click */
const handleMinuteClick = (minute: number) => {
    handleTimeUnitClick("minute", minute);
};

/** Handle second click */
const handleSecondClick = (second: number) => {
    handleTimeUnitClick("second", second);
};

/** Handle input box gaining focus */
const handleFocus = (event: FocusEvent) => {
    if (!props.disabled && !props.readonly) {
        emit("focus", event);
    }
};

/** Handle input box losing focus */
const handleBlur = (event: FocusEvent) => {
    emit("blur", event);
};

/** Handle clear button click */
const handleClear = (event: Event) => {
    event.stopPropagation();
    emit("update:modelValue", null);
    emit("clear");
    emit("change", null);
    isOpen.value = false;
};

/** Handle confirm button click */
const handleConfirm = () => {
    updateTempTimeValue();
    emit("update:modelValue", tempTimeValue.value);
    emit("confirm", tempTimeValue.value);
    emit("change", tempTimeValue.value);
    isOpen.value = false;
};

/** Handle cancel button click */
const handleCancel = () => {
    emit("cancel");
    emit("change", null);
    isOpen.value = false;
};

/** Set to current time and confirm */
const setNow = () => {
    const now = new Date();
    selectedHour.value = now.getHours();
    selectedMinute.value = now.getMinutes();
    selectedSecond.value = now.getSeconds();
    tempTimeValue.value = new Date(now);
    handleConfirm();
};

/** Prevent click event bubbling */
const handlePanelClick = (event: MouseEvent) => {
    event.stopPropagation();
};

/** Watch modelValue changes */
watch(
    () => props.modelValue,
    async (val) => {
        if (!val) return;
        initTimeValue();
        if (isOpen.value) {
            await nextTick();
            scrollToSelected();
        }
    },
);

/** Watch isOpen changes */
watch(
    () => isOpen.value,
    (val) => {
        handlePopoverUpdate(val);
    },
    { immediate: false },
);

/** Initialize keyboard events and time values when component is mounted */
onMounted(() => {
    // Initialize time values
    initTimeValue();
});

/** Expose component methods */
defineExpose({
    /** Open dropdown panel */
    open: () => {
        if (!props.disabled && !props.readonly) {
            isOpen.value = true;
        }
    },

    /** Close dropdown panel */
    close: () => {
        isOpen.value = false;
    },

    /** Focus input box */
    focus: () => {
        inputRef.value?.focus?.();
    },

    /** Blur input box */
    blur: () => {
        inputRef.value?.blur?.();
    },

    /** Clear selection */
    clear: () => {
        emit("update:modelValue", null);
        emit("clear");
    },

    /** Get currently selected time value */
    getTime: () => tempTimeValue.value,

    /** Set time value */
    setTime: (time: Date | string | number) => {
        const date = parseToDate(time);
        if (date) {
            emit("update:modelValue", date);
            selectedHour.value = date.getHours();
            selectedMinute.value = date.getMinutes();
            selectedSecond.value = date.getSeconds();
            tempTimeValue.value = new Date(date);
        }
    },

    /** Set to current time and confirm */
    setNow: () => {
        const now = new Date();
        selectedHour.value = now.getHours();
        selectedMinute.value = now.getMinutes();
        selectedSecond.value = now.getSeconds();
        tempTimeValue.value = new Date(now);
        handleConfirm();
    },
});

defineShortcuts({
    o: () => (isOpen.value = !isOpen.value),
});
</script>

<template>
    <div
        class="bd-time-picker relative inline-flex w-full"
        :class="[{ 'cursor-not-allowed opacity-60': disabled }]"
    >
        <UPopover
            v-model:open="isOpen"
            :disabled="disabled || readonly"
            :placement="placement"
            :popper="{ strategy: 'fixed' }"
            :ui="{ content: 'w-auto' }"
            :prevent-close="true"
        >
            <!-- Input box trigger -->
            <div class="relative w-full" :class="ui?.root">
                <UInput
                    v-model="displayValue"
                    :placeholder="t('common.placeholder.timeSelect')"
                    :disabled="disabled"
                    :readonly="true"
                    :size="size"
                    :color="color"
                    :variant="variant"
                    :class="{ 'cursor-default': readonly }"
                    :ui="{
                        ...ui,
                        root: ui?.root || 'w-full',
                        base: `${isOpen ? 'ring-2 ring-inset ring-primary' : ''} text-left ${ui?.base}`,
                    }"
                    @focus="handleFocus"
                    @blur="handleBlur"
                >
                    <template #leading>
                        <UIcon
                            :name="icon"
                            :class="displayValue ? 'text-highlighted' : 'text-dimmed'"
                        />
                    </template>
                    <template #trailing>
                        <UButton
                            v-if="clearable && displayValue && !disabled && !readonly"
                            color="neutral"
                            variant="ghost"
                            icon="i-lucide-x"
                            :padded="false"
                            size="xs"
                            @click.stop="handleClear"
                        />
                    </template>
                </UInput>
            </div>

            <!-- Time selection panel -->
            <template #content>
                <div class="bg-default flex w-[240px] flex-col p-4" @click="handlePanelClick">
                    <div class="">
                        <!-- Time selection area -->
                        <div class="flex h-[200px] justify-between">
                            <!-- Hour selection -->
                            <div class="mx-1 flex flex-1 flex-col text-center">
                                <div class="text-foreground py-2 text-sm">
                                    {{ t("common.time.hour") }}
                                </div>
                                <BdScrollArea
                                    class="relative flex-1"
                                    type="hover"
                                    :shadow="false"
                                    ref="hoursRef"
                                    @scroll="handleHoursScroll"
                                >
                                    <!-- Top padding -->
                                    <div class="h-[70px]"></div>

                                    <div
                                        v-for="hour in 24"
                                        :key="`hour-${hour - 1}`"
                                        class="hour-item text-foreground cursor-pointer py-1.5 text-sm transition-all select-none"
                                        :class="{
                                            'text-primary-500 font-semibold':
                                                selectedHour === hour - 1,
                                        }"
                                        @click="handleHourClick(hour - 1)"
                                    >
                                        {{ formatTimeUnit(hour - 1) }}
                                    </div>

                                    <!-- Bottom padding -->
                                    <div class="h-[70px]"></div>
                                </BdScrollArea>
                            </div>

                            <!-- Minute selection -->
                            <div class="mx-1 flex flex-1 flex-col text-center">
                                <div class="text-foreground py-2 text-sm">
                                    {{ t("common.time.minute") }}
                                </div>
                                <BdScrollArea
                                    class="relative flex-1"
                                    type="hover"
                                    :shadow="false"
                                    ref="minutesRef"
                                    @scroll="handleMinutesScroll"
                                >
                                    <!-- Top padding -->
                                    <div class="h-[70px]"></div>

                                    <div
                                        v-for="minute in 60"
                                        :key="`minute-${minute - 1}`"
                                        class="minute-item text-foreground cursor-pointer py-1.5 text-sm transition-all select-none"
                                        :class="{
                                            'text-primary-500 font-semibold':
                                                selectedMinute === minute - 1,
                                        }"
                                        @click="handleMinuteClick(minute - 1)"
                                    >
                                        {{ formatTimeUnit(minute - 1) }}
                                    </div>

                                    <!-- Bottom padding -->
                                    <div class="h-[70px]"></div>
                                </BdScrollArea>
                            </div>

                            <!-- Second selection (optional) -->
                            <div v-if="showSeconds" class="mx-1 flex flex-1 flex-col text-center">
                                <div class="text-foreground py-2 text-sm">
                                    {{ t("common.time.second") }}
                                </div>
                                <BdScrollArea
                                    class="relative flex-1"
                                    type="hover"
                                    :shadow="false"
                                    ref="secondsRef"
                                    @scroll="handleSecondsScroll"
                                >
                                    <!-- Top padding -->
                                    <div class="h-[70px]"></div>

                                    <div
                                        v-for="second in 60"
                                        :key="`second-${second - 1}`"
                                        class="second-item text-foreground cursor-pointer py-1.5 text-sm transition-all select-none"
                                        :class="{
                                            'text-primary-500 font-semibold':
                                                selectedSecond === second - 1,
                                        }"
                                        @click="handleSecondClick(second - 1)"
                                    >
                                        {{ formatTimeUnit(second - 1) }}
                                    </div>

                                    <!-- Bottom padding -->
                                    <div class="h-[70px]"></div>
                                </BdScrollArea>
                            </div>
                        </div>
                    </div>

                    <!-- Action button area -->
                    <div class="flex justify-between gap-2 pt-2">
                        <div>
                            <UButton size="sm" variant="ghost" @click="setNow">
                                {{ t("common.now") }}
                            </UButton>
                        </div>
                        <div class="flex gap-2">
                            <UButton
                                size="sm"
                                icon="i-lucide-x"
                                variant="ghost"
                                @click="handleCancel"
                            ></UButton>
                            <UButton
                                size="sm"
                                icon="i-lucide-check"
                                @click="handleConfirm"
                            ></UButton>
                        </div>
                    </div>
                </div>
            </template>
        </UPopover>
    </div>
</template>
