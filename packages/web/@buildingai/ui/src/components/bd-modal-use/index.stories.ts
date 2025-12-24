import type { Meta, StoryObj } from "@storybook/vue3";

import BdModalUse from "./index.vue";

/**
 * BdModalUse component stories
 * @description Stories for the BdModalUse component that provides dynamic modal functionality
 */
const meta: Meta<typeof BdModalUse> = {
    title: "Components/BdModalUse",
    component: BdModalUse,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A dynamic modal component used for programmatic modal creation with custom content.",
            },
        },
    },
    argTypes: {
        color: {
            control: { type: "select" },
            options: ["error", "primary", "secondary", "success", "info", "warning", "neutral"],
        },
        title: { control: { type: "text" } },
        description: { control: { type: "text" } },
        content: { control: { type: "text" } },
        showConfirm: { control: { type: "boolean" } },
        showCancel: { control: { type: "boolean" } },
        confirmText: { control: { type: "text" } },
        cancelText: { control: { type: "text" } },
        dismissible: { control: { type: "boolean" } },
        contentId: { control: { type: "text" } },
        ui: { control: { type: "object" } },
        confirm: { action: "confirm" },
        cancel: { action: "cancel" },
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        color: "primary",
        title: "Confirm Action",
        description: "Are you sure you want to proceed with this action?",
        content: "This action cannot be undone. Please review your decision carefully.",
        showConfirm: true,
        showCancel: true,
        confirmText: "Yes, Continue",
        cancelText: "Cancel",
        dismissible: true,
    },
    render: (args) => ({
        components: { BdModalUse },
        setup() {
            const isOpen = ref(true);
            const handleClose = (confirmed: boolean) => {
                isOpen.value = false;
                console.log("Modal closed, confirmed:", confirmed);
            };
            return { args, isOpen, handleClose };
        },
        template: `
      <div v-if="isOpen">
        <BdModalUse v-bind="args" @close="handleClose" />
      </div>
      <div v-else class="text-center">
        <p>Modal was closed</p>
        <UButton @click="isOpen = true">Reopen Modal</UButton>
      </div>
    `,
    }),
};

export const Warning: Story = {
    args: {
        color: "warning",
        title: "Warning",
        description: "This action will delete all data permanently.",
        content: "Are you absolutely sure you want to delete everything? This cannot be undone.",
        showConfirm: true,
        showCancel: true,
        confirmText: "Delete All",
        cancelText: "Keep Data",
        dismissible: false,
    },
    render: (args) => ({
        components: { BdModalUse },
        setup() {
            const isOpen = ref(true);
            const handleClose = (confirmed: boolean) => {
                isOpen.value = false;
                console.log("Warning modal closed, confirmed:", confirmed);
            };
            return { args, isOpen, handleClose };
        },
        template: `
      <div v-if="isOpen">
        <BdModalUse v-bind="args" @close="handleClose" />
      </div>
      <div v-else class="text-center">
        <p>Warning modal was closed</p>
        <UButton @click="isOpen = true">Reopen Warning Modal</UButton>
      </div>
    `,
    }),
};

export const Success: Story = {
    args: {
        color: "success",
        title: "Success!",
        description: "Your action has been completed successfully.",
        content: "All changes have been saved and applied. You can now continue with your work.",
        showConfirm: true,
        showCancel: false,
        confirmText: "Continue",
        dismissible: true,
    },
    render: (args) => ({
        components: { BdModalUse },
        setup() {
            const isOpen = ref(true);
            const handleClose = (confirmed: boolean) => {
                isOpen.value = false;
                console.log("Success modal closed, confirmed:", confirmed);
            };
            return { args, isOpen, handleClose };
        },
        template: `
      <div v-if="isOpen">
        <BdModalUse v-bind="args" @close="handleClose" />
      </div>
      <div v-else class="text-center">
        <p>Success modal was closed</p>
        <UButton @click="isOpen = true">Reopen Success Modal</UButton>
      </div>
    `,
    }),
};

export const CustomContent: Story = {
    args: {
        color: "info",
        title: "Custom Content",
        description: "This modal contains custom Vue component content.",
        content: "CustomComponent",
        showConfirm: true,
        showCancel: true,
        confirmText: "Save",
        cancelText: "Cancel",
        dismissible: true,
    },
    render: (args) => ({
        components: { BdModalUse },
        setup() {
            const isOpen = ref(true);
            const handleClose = (confirmed: boolean) => {
                isOpen.value = false;
                console.log("Custom modal closed, confirmed:", confirmed);
            };

            // Custom component for modal content
            const CustomComponent = {
                template: `
                  <div class="space-y-4">
                    <h3 class="text-lg font-semibold">Custom Form</h3>
                    <div>
                      <label class="block text-sm font-medium mb-1">Name:</label>
                      <UInput placeholder="Enter your name" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-1">Email:</label>
                      <UInput placeholder="Enter your email" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-1">Message:</label>
                      <UTextarea placeholder="Enter your message" />
                    </div>
                  </div>
                `,
            };

            return { args, isOpen, handleClose, CustomComponent };
        },
        template: `
      <div v-if="isOpen">
        <BdModalUse v-bind="args" :content="CustomComponent" @close="handleClose" />
      </div>
      <div v-else class="text-center">
        <p>Custom modal was closed</p>
        <UButton @click="isOpen = true">Reopen Custom Modal</UButton>
      </div>
    `,
    }),
};
