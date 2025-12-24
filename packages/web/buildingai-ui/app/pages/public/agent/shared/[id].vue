<script setup lang="ts">
import Chat from "../components/chat.vue";

definePageMeta({ layout: "full-screen", auth: false });
</script>

<template>
    <Chat billingMode="creator" />
</template>
