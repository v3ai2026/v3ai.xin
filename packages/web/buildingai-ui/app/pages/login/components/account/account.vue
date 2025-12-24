<script setup lang="ts">
import type { LoginResponse } from "@buildingai/service/webapi/user";

const Forget = defineAsyncComponent(() => import("./forget.vue"));
const Login = defineAsyncComponent(() => import("./login.vue"));
const Register = defineAsyncComponent(() => import("./register.vue"));

const emits = defineEmits<{
    (e: "success", v: LoginResponse): void;
    (e: "update:showLoginMethods", v: boolean): void;
}>();

// 当前显示的组件
const currentComponent = shallowRef("account-login");

// 组件映射表
const componentMap: Record<string, Component> = {
    "account-login": Login,
    "account-register": Register,
    "account-forget": Forget,
} as const;

// 处理组件切换
function handleSwitchComponent(component: string) {
    currentComponent.value = component;
    emits("update:showLoginMethods", component === "account-login");
}

// 处理登录成功
function handleLoginSuccess(v: LoginResponse) {
    emits("success", v);
}

onMounted(() => {
    emits("update:showLoginMethods", true);
});
</script>

<template>
    <component
        :is="componentMap[currentComponent]"
        :key="currentComponent"
        @success="handleLoginSuccess"
        @switch-component="handleSwitchComponent"
    />
</template>
