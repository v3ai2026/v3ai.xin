<script setup lang="ts">
definePageMeta({ layout: "full-screen" });

const router = useRouter();

const goBack = () => {
    router.back();
};

// SEO settings
useSeoMeta({
    title: "403 - Forbidden",
    description: "You don't have permission to access this page",
    robots: "noindex, nofollow",
});
</script>

<template>
    <div class="flex min-h-screen flex-col items-center justify-center px-6">
        <div class="text-center">
            <!-- Error Code with Separator -->
            <div class="mb-8 flex items-center justify-center gap-6">
                <h1 class="text-2xl font-semibold">403</h1>
                <div class="bg-border h-12 w-px"></div>
                <p class="text-sm font-medium">This page could not be accessed.</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-center gap-3">
                <UButton
                    color="neutral"
                    variant="soft"
                    size="sm"
                    icon="i-heroicons-arrow-left"
                    class="hover:bg-muted"
                    @click="goBack"
                >
                    Go Back
                </UButton>
                <UButton
                    color="neutral"
                    to="/"
                    variant="soft"
                    size="sm"
                    icon="i-heroicons-home"
                    class="hover:bg-muted"
                >
                    Go Back Home
                </UButton>
            </div>
        </div>
    </div>
</template>
