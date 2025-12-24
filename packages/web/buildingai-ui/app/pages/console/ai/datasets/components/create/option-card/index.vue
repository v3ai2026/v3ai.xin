<script setup lang="ts">
defineProps<{
    title: string;
    description?: string;
    icon?: string;
    iconClass?: string;
    selected?: boolean;
    selectedHeaderClass?: string;
}>();

const emit = defineEmits<{
    (e: "click"): void;
}>();

function onEnter(el: Element) {
    const element = el as HTMLElement;
    element.style.height = "0";
    element.style.opacity = "0";
    element.style.transition = "height 0.3s ease, opacity 0.3s ease";
    requestAnimationFrame(() => {
        element.style.height = element.scrollHeight + "px";
        element.style.opacity = "1";
    });
}

function onAfterEnter(el: Element) {
    const element = el as HTMLElement;
    element.style.height = "auto";
}

function onLeave(el: Element) {
    const element = el as HTMLElement;
    element.style.height = element.scrollHeight + "px";
    element.style.opacity = "1";
    element.style.transition = "height 0.3s ease, opacity 0.3s ease";
    requestAnimationFrame(() => {
        element.style.height = "0";
        element.style.opacity = "0";
    });
}

function onAfterLeave(el: Element) {
    const element = el as HTMLElement;
    element.style.height = "";
    element.style.opacity = "";
}
</script>

<template>
    <div
        class="cursor-pointer overflow-hidden rounded-lg border transition-colors"
        :class="selected ? 'border-primary' : 'border-default'"
        @click="emit('click')"
    >
        <!-- Header -->
        <div
            class="flex items-center gap-2 bg-linear-to-r p-4"
            :class="selected ? (selectedHeaderClass ?? 'from-primary-50! to-muted!') : 'bg-muted!'"
        >
            <div class="bg-background flex items-center gap-2 rounded-md p-2 shadow-sm">
                <UIcon v-if="icon" :name="icon" :class="iconClass ?? 'size-5'" />
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-xs font-medium">{{ title }}</span>
                <p v-if="description" class="text-muted-foreground text-xs">{{ description }}</p>
                <slot name="header" />
            </div>
        </div>

        <!-- Content -->
        <Transition
            name="collapse"
            @enter="onEnter"
            @after-enter="onAfterEnter"
            @leave="onLeave"
            @after-leave="onAfterLeave"
        >
            <div v-show="selected" class="overflow-hidden px-4">
                <div class="py-4">
                    <slot />
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
    overflow: hidden;
}
</style>
