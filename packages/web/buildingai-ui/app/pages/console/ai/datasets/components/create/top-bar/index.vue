<script lang="ts" setup>
defineProps<{
    steps: { id: number; title: string }[];
    activeIndex: number;
}>();
const emit = defineEmits<{
    (e: "step-change", step: number): void;
}>();

const handleStepClick = (step: number) => {
    emit("step-change", step);
};
</script>

<template>
    <div class="dataset-step-indicator mx-auto w-3xl py-4">
        <div class="flex items-center justify-between">
            <div
                v-for="(step, index) in steps"
                :key="step.id"
                class="flex items-center"
                :class="{ 'flex-1': index != 2 }"
            >
                <!-- 当前步骤 -->
                <UButton
                    v-if="step.id === activeIndex"
                    label="step"
                    size="xs"
                    color="primary"
                    class="mr-1 rounded-full"
                />
                <!-- 步骤圆圈 -->
                <div
                    class="flex size-6 items-center justify-center rounded-full border transition-colors duration-200"
                    :class="[
                        step.id === activeIndex
                            ? 'border-primary bg-primary text-white'
                            : step.id < activeIndex
                              ? 'border-primary-500 text-primary-500'
                              : 'border-default text-default',
                    ]"
                >
                    <UIcon v-if="step.id < activeIndex" name="i-heroicons-check" class="h-4 w-4" />
                    <span v-else class="text-sm font-medium">{{ step.id }}</span>
                </div>

                <!-- 步骤标题 -->
                <div class="ml-2">
                    <div
                        class="flex-none text-sm font-medium"
                        :class="[
                            step.id === activeIndex
                                ? 'text-primary'
                                : step.id < activeIndex
                                  ? 'text-primary'
                                  : 'text-default',
                        ]"
                        @click="handleStepClick(step.id)"
                    >
                        {{ step.title }}
                    </div>
                </div>

                <!-- 连线 -->
                <div v-if="index < steps.length - 1" class="mr-4 flex-1">
                    <div
                        class="mx-2 h-px w-full"
                        :class="step.id < activeIndex ? 'bg-primary' : 'bg-gray-300'"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
