<script setup lang="ts">
import { AspectRatio } from "reka-ui";

import type { BdAspectRatioProps } from "./types";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BdAspectRatioProps>(), {
    ratio: 16 / 9,
});
</script>

<template>
    <AspectRatio :ratio="props.ratio" class="bd-aspect-ratio" v-bind="$attrs">
        <slot />
    </AspectRatio>
</template>

<style scoped>
.bd-aspect-ratio {
    display: block;
}
</style>
