<script setup lang="ts">
import Chat from "../components/chat.vue";

definePageMeta({ auth: false, activePath: "/public/agent/square" });
</script>

<template>
    <Chat billingMode="user" />
</template>
