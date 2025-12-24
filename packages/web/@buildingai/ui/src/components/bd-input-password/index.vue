<script setup lang="ts">
import { ref } from "vue";

// Define all properties received by the component, passed to UInput via v-bind="$attrs"
defineOptions({ inheritAttrs: false });

// Define default slots
defineSlots();

// Password visible status
const visiblePassword = ref(false);
</script>

<template>
    <UInput v-bind="$attrs" :type="visiblePassword ? 'text' : 'password'">
        <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
        </template>

        <template #trailing>
            <slot name="trailing-before" />
            <UIcon
                :name="visiblePassword ? 'tabler:eye-off' : 'tabler:eye'"
                class="text-foreground/70 cursor-pointer"
                :size="20"
                @click="visiblePassword = !visiblePassword"
            />
            <slot name="trailing-after" />
        </template>
    </UInput>
</template>
