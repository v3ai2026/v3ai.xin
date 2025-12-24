<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone } from "@internationalized/date";
import type { Composer } from "vue-i18n";

import { formatDate, mergeTimeToDate, parseDateValue, parseToDate } from "../../utils/date-format";
import BdTimePicker from "../bd-time-picker/index.vue";
import type { DatePickerEmits, DatePickerProps } from "./types";

const { $i18n } = useNuxtApp();
const { t, locale } = $i18n as Composer;

const props = withDefaults(defineProps<DatePickerProps>(), {
    modelValue: "",
    dateStyle: "medium",
    timeStyle: "medium",
    disabled: false,
    readonly: false,
    clearable: true,
    size: "md",
    showTime: false,
    timeFormat: "HH:mm:ss",
    defaultTime: "",
    icon: "i-lucide-calendar",
    placement: "bottom",
});

const emit = defineEmits<DatePickerEmits>();

/** Whether the popup panel is open */
const isOpen = ref(false);
/** 当前选中的日期 */
const selectedDate = shallowRef<CalendarDate | null>(null);
/** Current selected time */
const selectedTime = shallowRef<Date | null>(null);
/** Time selector reference */
const timePickerRef = useTemplateRef("timePickerRef");

/** Current displayed month and year */
const currentDate = computed(() => {
    if (selectedDate.value) {
        return selectedDate.value;
    }
    // Default current date
    return new CalendarDate(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate(),
    );
});

/** Optional month list */
const months = [
    { value: 1, label: t("common.month.january") },
    { value: 2, label: t("common.month.february") },
    { value: 3, label: t("common.month.march") },
    { value: 4, label: t("common.month.april") },
    { value: 5, label: t("common.month.may") },
    { value: 6, label: t("common.month.june") },
    { value: 7, label: t("common.month.july") },
    { value: 8, label: t("common.month.august") },
    { value: 9, label: t("common.month.september") },
    { value: 10, label: t("common.month.october") },
    { value: 11, label: t("common.month.november") },
    { value: 12, label: t("common.month.december") },
];

/** Current displayed month */
const currentMonth = computed({
    get: () => currentDate.value.month,
    set: (value: number) => {
        if (selectedDate.value) {
            // Use CalendarDate's set method to create a new date object
            selectedDate.value = selectedDate.value.set({ month: value });
        } else {
            // If no date is selected, create a new date based on current displayed date
            selectedDate.value = currentDate.value.set({ month: value });
        }
    },
});

/** Current displayed year */
const currentYear = computed({
    get: () => currentDate.value.year,
    set: (value: number) => {
        if (selectedDate.value) {
            // Use CalendarDate's set method to create a new date object
            selectedDate.value = selectedDate.value.set({ year: value });
        } else {
            // If no date is selected, create a new date based on current displayed date
            selectedDate.value = currentDate.value.set({ year: value });
        }
    },
});

/** Optional year list */
const years = computed(() => {
    const currentYearValue = new Date().getFullYear();
    const years = [];
    for (let i = currentYearValue - 100; i <= currentYearValue + 10; i++) {
        years.push({ value: i, label: `${i} year` });
    }
    return years;
});

/** Format date display */
const formattedDate = computed(() =>
    formatDate(props.modelValue, locale.value, props.dateStyle, props.timeStyle, props.showTime),
);

/** Initialize date selector value */
const initDateValue = () => {
    // Parse date value
    selectedDate.value = parseDateValue(props.modelValue);

    // Initialize time selector
    if (props.showTime) {
        if (props.modelValue) {
            const date = parseToDate(props.modelValue);
            const formatter = new DateFormatter("zh-CN", {
                dateStyle: undefined,
                timeStyle: props.timeStyle,
            });
            selectedTime.value = formatter.format(date as Date) as unknown as Date;
        } else if (props.defaultTime) {
            // Use default time if no value is set
            const defaultTimeDate = parseToDate(props.defaultTime);
            if (defaultTimeDate) {
                selectedTime.value = defaultTimeDate;
                if (timePickerRef.value) {
                    timePickerRef.value.setTime(defaultTimeDate);
                }
            }
        }
    }
};

/** Handle popup panel status update */
const handlePopoverUpdate = (val: boolean) => {
    if (val) {
        emit("open");
        nextTick(() => {
            initDateValue();
        });
    } else {
        emit("close");
    }
};

/** Handle input box focus */
const handleFocus = (event: FocusEvent) => {
    if (!props.disabled && !props.readonly) {
        emit("focus", event);
    }
};

/** Handle input box blur */
const handleBlur = (event: FocusEvent) => {
    emit("blur", event);
};

/** Handle clear button click */
const handleClear = (event: Event) => {
    event.stopPropagation();
    selectedDate.value = null;
    selectedTime.value = null;
    emit("update:modelValue", null);
    emit("clear");
    emit("change", null);
    isOpen.value = false;
};

/** Handle confirm button click */
const handleConfirm = () => {
    isOpen.value = false;

    // Get time value, use defaultTime if selectedTime is null
    let timeValue = selectedTime.value;
    if (props.showTime && !timeValue && props.defaultTime) {
        timeValue = parseToDate(props.defaultTime);
    }

    // Create merged final date object
    const finalDate = mergeTimeToDate(
        selectedDate?.value?.toDate(getLocalTimeZone()) as Date,
        timeValue,
    );

    // Trigger events
    emit("update:modelValue", finalDate);
    emit("confirm", finalDate);
    emit("change", finalDate);
};

/** Handle cancel button click */
const handleCancel = () => {
    isOpen.value = false;
    emit("cancel");
    emit("change", null);
};

/** Previous month */
const prevMonth = () => {
    if (selectedDate.value) {
        selectedDate.value = selectedDate.value.subtract({ months: 1 });
    } else {
        // If no date is selected, create a new date based on current displayed date
        selectedDate.value = currentDate.value.subtract({ months: 1 });
    }
};

/** Next month */
const nextMonth = () => {
    if (selectedDate.value) {
        selectedDate.value = selectedDate.value.add({ months: 1 });
    } else {
        // If no date is selected, create a new date based on current displayed date
        selectedDate.value = currentDate.value.add({ months: 1 });
    }
};

/** Set to current time and confirm */
const setNow = () => {
    const now = new Date();
    // Use CalendarDate's constructor to create a date object directly
    selectedDate.value = new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());

    if (props.showTime) {
        selectedTime.value = new Date(now);
        if (timePickerRef.value) {
            timePickerRef.value.setTime(now);
        }
    }

    // Directly confirm selection
    handleConfirm();
};

/** Watch modelValue changes */
watch(
    () => props.modelValue,
    async (val) => {
        if (!val) return;
        initDateValue();
    },
);

/** Watch selectedDate changes and apply defaultTime if needed */
watch(
    () => selectedDate.value,
    () => {
        if (props.showTime && selectedDate.value && !selectedTime.value && props.defaultTime) {
            const defaultTimeDate = parseToDate(props.defaultTime);
            if (defaultTimeDate) {
                selectedTime.value = defaultTimeDate;
                if (timePickerRef.value) {
                    timePickerRef.value.setTime(defaultTimeDate);
                }
            }
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

/** Initialize date value when component is mounted */
onMounted(initDateValue);
</script>

<template>
    <div
        class="bd-date-picker relative inline-flex w-full"
        :class="[size, { 'cursor-not-allowed opacity-60': disabled }]"
    >
        <UPopover
            v-model:open="isOpen"
            :disabled="disabled || readonly"
            :placement="placement"
            :popper="{ placement, strategy: 'fixed' }"
            :ui="{ content: 'w-auto' }"
            :prevent-close="true"
        >
            <!-- Input box trigger -->
            <div class="relative w-full" :class="ui?.root">
                <UInput
                    v-model="formattedDate"
                    :placeholder="t('common.placeholder.dateSelect')"
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
                            :class="formattedDate ? 'text-highlighted' : 'text-dimmed'"
                        />
                    </template>
                    <template #trailing>
                        <UButton
                            v-if="clearable && formattedDate && !disabled && !readonly"
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

            <template #content>
                <div class="bd-date-picker-panel bg-default w-[320px] p-4" @click.stop="">
                    <!-- Calendar header -->
                    <div class="mb-2 flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <!-- Year selection -->
                            <USelect
                                v-model="currentYear"
                                :items="years"
                                option-attribute="value"
                                :ui="{
                                    base: 'min-w-[100px] py-1',
                                }"
                                size="sm"
                            />

                            <!-- Month selection -->
                            <USelect
                                v-model="currentMonth"
                                :items="months"
                                option-attribute="value"
                                :ui="{
                                    base: 'min-w-[100px] py-1',
                                }"
                                size="sm"
                            />
                        </div>

                        <!-- Month navigation button -->
                        <div class="flex items-center space-x-1">
                            <UButton
                                icon="i-lucide-chevron-left"
                                variant="ghost"
                                color="neutral"
                                size="sm"
                                :padded="false"
                                @click="prevMonth"
                            />
                            <UButton
                                icon="i-lucide-chevron-right"
                                variant="ghost"
                                color="neutral"
                                size="sm"
                                :padded="false"
                                @click="nextMonth"
                            />
                        </div>
                    </div>

                    <!-- Calendar body -->
                    <UCalendar
                        v-model="selectedDate"
                        :month-controls="false"
                        :year-controls="false"
                        color="primary"
                        size="sm"
                    />

                    <!-- Time selector (optional) -->
                    <div v-if="showTime" class="b mt-2 pt-2">
                        <BdTimePicker
                            ref="timePickerRef"
                            v-model="selectedTime"
                            :format="timeFormat"
                            :disabled="disabled"
                            :readonly="readonly"
                            :clearable="false"
                            size="sm"
                            :ui="{ root: 'w-full' }"
                        />
                    </div>

                    <!-- Operation button area -->
                    <div class="b mt-2 flex justify-between gap-2 pt-2">
                        <div>
                            <UButton size="sm" variant="soft" @click="setNow">
                                {{ t("common.now") }}
                            </UButton>
                        </div>
                        <div class="flex gap-2">
                            <UButton
                                size="sm"
                                variant="ghost"
                                icon="i-lucide-x"
                                @click="handleCancel"
                            ></UButton>
                            <UButton
                                size="sm"
                                icon="i-lucide-check"
                                :disabled="!selectedDate && !disabled"
                                @click="handleConfirm"
                            ></UButton>
                        </div>
                    </div>
                </div>
            </template>
        </UPopover>
    </div>
</template>
