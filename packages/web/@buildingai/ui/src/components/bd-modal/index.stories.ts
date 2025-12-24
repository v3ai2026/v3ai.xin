import type { Meta, StoryObj } from "@storybook/vue3";

import BdModal from "./index.vue";

/**
 * BdModal component stories
 * @description Stories for the BdModal component that provides a modal dialog with enhanced features
 */
const meta: Meta<typeof BdModal> = {
    title: "Components/BdModal",
    component: BdModal,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A professional modal component based on Nuxt UI's Modal with enhanced features like keyboard shortcuts, custom footer, and improved accessibility.",
            },
        },
    },
    argTypes: {
        title: {
            control: { type: "text" },
            description: "Modal title",
        },
        description: {
            control: { type: "text" },
            description: "Modal description text",
        },
        transition: {
            control: { type: "boolean" },
            description: "Whether to enable transition animation",
        },
        fullscreen: {
            control: { type: "boolean" },
            description: "Whether to display fullscreen",
        },
        dismissible: {
            control: { type: "boolean" },
            description: "Whether to prevent clicking outside to close",
        },
        overlay: {
            control: { type: "boolean" },
            description: "Whether to display overlay",
        },
        portal: {
            control: { type: "boolean" },
            description: "Whether to render modal in portal",
        },
        modelValue: {
            control: { type: "boolean" },
            description: "Modal display status",
        },
        disabledClose: {
            control: { type: "boolean" },
            description: "Whether to disable close button",
        },
        closeOnEsc: {
            control: { type: "boolean" },
            description: "Whether to close modal when ESC key is pressed",
        },
        showFooter: {
            control: { type: "boolean" },
            description: "Whether to display footer area",
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default modal
 */
export const Default: Story = {
    args: {
        title: "Default Modal",
        description: "This is a default modal with basic functionality",
        transition: true,
        fullscreen: false,
        dismissible: false,
        overlay: true,
        portal: true,
        disabledClose: false,
        closeOnEsc: true,
        showFooter: false,
    },
    render: (args) => ({
        components: { BdModal },
        setup() {
            const isOpen = ref(false);
            return { args, isOpen };
        },
        template: `
      <div>
        <UButton @click="isOpen = true" color="primary">
          Open Modal
        </UButton>
        
        <BdModal 
          v-bind="args" 
          v-model:open="isOpen"
        >
          <div class="space-y-4">
            <p class="text-gray-600">
              This is the modal content. You can put any content here.
            </p>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium mb-2">Features:</h4>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• Click outside to close (if dismissible is true)</li>
                <li>• Press ESC to close (if closeOnEsc is true)</li>
                <li>• Use Alt+O to toggle modal</li>
                <li>• Customizable title and description</li>
              </ul>
            </div>
          </div>
        </BdModal>
      </div>
    `,
    }),
};

/**
 * Modal with trigger slot
 */
export const WithTrigger: Story = {
    render: () => ({
        components: { BdModal },
        setup() {
            return {};
        },
        template: `
      <BdModal 
        title="Modal with Trigger"
        description="This modal uses a trigger slot instead of external button"
      >
        <template #trigger>
          <UButton color="secondary" variant="outline">
            <UIcon name="i-lucide-plus" class="mr-2" />
            Add Item
          </UButton>
        </template>
        
        <div class="space-y-4">
          <p class="text-gray-600">
            This modal was opened using the trigger slot. The trigger button is part of the modal component.
          </p>
          <div class="space-y-3">
            <UInput placeholder="Enter item name" />
            <UTextarea placeholder="Enter description" />
          </div>
        </div>
        
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost">Cancel</UButton>
            <UButton color="primary">Add Item</UButton>
          </div>
        </template>
      </BdModal>
    `,
    }),
};

/**
 * Modal with footer
 */
export const WithFooter: Story = {
    render: () => ({
        components: { BdModal },
        setup() {
            const isOpen = ref(false);
            return { isOpen };
        },
        template: `
      <div>
        <UButton @click="isOpen = true" color="primary">
          Open Modal with Footer
        </UButton>
        
        <BdModal 
          v-model:open="isOpen"
          title="Confirm Action"
          description="Are you sure you want to perform this action?"
          show-footer
          @confirm="console.log('Confirmed!')"
        >
          <div class="space-y-4">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex">
                <UIcon name="i-lucide-alert-triangle" class="text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h4 class="text-yellow-800 font-medium">Warning</h4>
                  <p class="text-yellow-700 text-sm mt-1">
                    This action cannot be undone. Please make sure you want to proceed.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Type "DELETE" to confirm:
              </label>
              <UInput placeholder="Type DELETE here" />
            </div>
          </div>
        </BdModal>
      </div>
    `,
    }),
};

/**
 * Fullscreen modal
 */
export const Fullscreen: Story = {
    render: () => ({
        components: { BdModal },
        setup() {
            const isOpen = ref(false);
            return { isOpen };
        },
        template: `
      <div>
        <UButton @click="isOpen = true" color="primary">
          Open Fullscreen Modal
        </UButton>
        
        <BdModal 
          v-model:open="isOpen"
          title="Fullscreen Modal"
          description="This modal takes up the entire screen"
          fullscreen
        >
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">Left Column</h3>
                <div class="space-y-3">
                  <UInput placeholder="Input 1" />
                  <UInput placeholder="Input 2" />
                  <UTextarea placeholder="Textarea" />
                </div>
              </div>
              
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">Right Column</h3>
                <div class="space-y-3">
                  <USelect placeholder="Select option" :options="['Option 1', 'Option 2', 'Option 3']" />
                  <UCheckbox label="Checkbox option" />
                  <URadioGroup :options="['Radio 1', 'Radio 2', 'Radio 3']" />
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium mb-2">Additional Content</h4>
              <p class="text-gray-600 text-sm">
                This is additional content to demonstrate the fullscreen modal's ability to handle large amounts of content.
              </p>
            </div>
          </div>
        </BdModal>
      </div>
    `,
    }),
};

/**
 * Non-dismissible modal
 */
export const NonDismissible: Story = {
    render: () => ({
        components: { BdModal },
        setup() {
            const isOpen = ref(false);
            return { isOpen };
        },
        template: `
      <div>
        <UButton @click="isOpen = true" color="primary">
          Open Non-Dismissible Modal
        </UButton>
        
        <BdModal 
          v-model:open="isOpen"
          title="Important Notice"
          description="This modal cannot be dismissed by clicking outside"
          dismissible
          disabled-close
          close-on-esc="false"
        >
          <div class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex">
                <UIcon name="i-lucide-info" class="text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h4 class="text-blue-800 font-medium">Important Information</h4>
                  <p class="text-blue-700 text-sm mt-1">
                    This modal requires explicit user action to close. You cannot close it by clicking outside or pressing ESC.
                  </p>
                </div>
              </div>
            </div>
            
            <p class="text-gray-600">
              Please read the information above carefully before proceeding.
            </p>
          </div>
          
          <template #footer>
            <div class="flex justify-end">
              <UButton color="primary" @click="isOpen = false">
                I Understand
              </UButton>
            </div>
          </template>
        </BdModal>
      </div>
    `,
    }),
};

/**
 * Different sizes
 */
export const DifferentSizes: Story = {
    render: () => ({
        components: { BdModal },
        setup() {
            const modals = ref({
                small: false,
                medium: false,
                large: false,
                fullscreen: false,
            });

            const openModal = (size: string) => {
                (modals.value as Record<string, boolean>)[size] = true;
            };

            return { modals, openModal };
        },
        template: `
      <div class="space-y-4">
        <div class="flex gap-4">
          <UButton @click="openModal('small')" color="primary" size="sm">
            Small Modal
          </UButton>
          <UButton @click="openModal('medium')" color="primary" size="sm">
            Medium Modal
          </UButton>
          <UButton @click="openModal('large')" color="primary" size="sm">
            Large Modal
          </UButton>
          <UButton @click="openModal('fullscreen')" color="primary" size="sm">
            Fullscreen Modal
          </UButton>
        </div>
        
        <!-- Small Modal -->
        <BdModal 
          v-model:open="modals.small"
          title="Small Modal"
          :ui="{ container: 'sm:max-w-sm' }"
        >
          <p class="text-gray-600">This is a small modal with limited width.</p>
        </BdModal>
        
        <!-- Medium Modal -->
        <BdModal 
          v-model:open="modals.medium"
          title="Medium Modal"
          :ui="{ container: 'sm:max-w-md' }"
        >
          <p class="text-gray-600">This is a medium-sized modal with moderate width.</p>
        </BdModal>
        
        <!-- Large Modal -->
        <BdModal 
          v-model:open="modals.large"
          title="Large Modal"
          :ui="{ container: 'sm:max-w-2xl' }"
        >
          <div class="space-y-4">
            <p class="text-gray-600">This is a large modal with more space for content.</p>
            <div class="grid grid-cols-2 gap-4">
              <UInput placeholder="Input 1" />
              <UInput placeholder="Input 2" />
            </div>
          </div>
        </BdModal>
        
        <!-- Fullscreen Modal -->
        <BdModal 
          v-model:open="modals.fullscreen"
          title="Fullscreen Modal"
          fullscreen
        >
          <div class="space-y-6">
            <p class="text-gray-600">This modal takes up the entire screen space.</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-medium mb-2">Column 1</h4>
                <p class="text-sm text-gray-600">Content for column 1</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-medium mb-2">Column 2</h4>
                <p class="text-sm text-gray-600">Content for column 2</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-medium mb-2">Column 3</h4>
                <p class="text-sm text-gray-600">Content for column 3</p>
              </div>
            </div>
          </div>
        </BdModal>
      </div>
    `,
    }),
};
