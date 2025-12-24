<script setup lang="ts">
import Draggable from "vuedraggable";
const props = defineProps<{
    modelValue: string[];
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string[]): void;
}>();

const problem = useVModel(props, "modelValue", emit);

const addProblem = () => {
    if (!problem.value) {
        problem.value = [];
    }
    problem.value.push("");
};

const removeProblem = (index: number) => {
    problem.value.splice(index, 1);
};
</script>

<template>
    <div class="bg-muted space-y-2 rounded-lg p-3">
        <div class="flex items-center justify-between">
            <div class="text-foreground flex items-center gap-1 text-sm font-medium">
                {{ $t("ai-agent.backend.configuration.problem") }}
            </div>

            <UButton
                size="sm"
                color="primary"
                variant="ghost"
                class="flex items-center"
                @click="addProblem"
            >
                <UIcon name="i-lucide-plus" />
                <span>{{ $t("console-common.add") }}</span>
            </UButton>
        </div>

        <div class="flex h-auto w-full space-y-2" v-if="problem?.length">
            <Draggable
                class="draggable w-full cursor-move"
                v-model="problem"
                animation="300"
                handle=".drag-move"
                itemKey="id"
            >
                <template v-slot:item="{ index }">
                    <div class="mt-2 flex items-center gap-2">
                        <UInput
                            icon="i-lucide-grip-vertical"
                            v-model="problem[index]"
                            :placeholder="
                                $t('ai-agent.backend.configuration.formVariableOptionsLabel')
                            "
                            :ui="{ root: 'flex-1', leadingIcon: 'drag-move' }"
                        />
                        <UButton
                            size="xs"
                            color="error"
                            variant="ghost"
                            icon="i-lucide-trash"
                            @click="removeProblem(index)"
                        />
                    </div>
                </template>
            </Draggable>
        </div>
    </div>
</template>
