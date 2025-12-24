import type { Meta, StoryObj } from "@storybook/vue3";

import BdUploader from "./index.vue";

/**
 * BdUploader component stories
 * @description Stories for the BdUploader component that provides file upload functionality
 */
const meta: Meta<typeof BdUploader> = {
    title: "Components/BdUploader",
    component: BdUploader,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A professional file uploader component with drag-and-drop support, progress tracking, and file type validation.",
            },
        },
    },
    argTypes: {
        modelValue: {
            control: { type: "text" },
            description: "Bound value, file URL(s)",
        },
        type: {
            control: { type: "select" },
            options: ["image", "video", "file"],
            description: "Upload type filter",
        },
        single: {
            control: { type: "boolean" },
            description: "Whether single file mode",
        },
        maxCount: {
            control: { type: "number" },
            description: "Maximum number of files",
        },
        accept: {
            control: { type: "text" },
            description: "Accepted file types",
        },
        maxSize: {
            control: { type: "number" },
            description: "Maximum file size in bytes",
        },
        text: {
            control: { type: "text" },
            description: "Upload area text",
        },
        icon: {
            control: { type: "text" },
            description: "Upload area icon",
        },
        disabled: {
            control: { type: "boolean" },
            description: "Whether disabled",
        },
        multiple: {
            control: { type: "boolean" },
            description: "Whether to allow multiple file selection",
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default uploader
 */
export const Default: Story = {
    args: {
        type: "file",
        single: false,
        maxCount: 5,
        text: "Click or drag files here to upload",
        icon: "i-lucide-upload",
        disabled: false,
        multiple: true,
    },
    render: (args) => ({
        components: { BdUploader },
        setup() {
            const files = ref<string[]>([]);

            const handleSuccess = (file: any, response: any) => {
                console.log("Upload success:", file, response);
            };

            const handleError = (file: any, error: any) => {
                console.log("Upload error:", file, error);
            };

            const handleProgress = (file: any, percent: number) => {
                console.log("Upload progress:", file.name, percent + "%");
            };

            return {
                args,
                files,
                handleSuccess,
                handleError,
                handleProgress,
            };
        },
        template: `
      <div class="w-full max-w-2xl">
        <BdUploader 
          v-bind="args" 
          v-model="files"
          @success="handleSuccess"
          @error="handleError"
          @progress="handleProgress"
        />
        <div class="mt-4 text-sm text-gray-600">
          Uploaded files: {{ files.length }}
        </div>
      </div>
    `,
    }),
};

/**
 * Image uploader
 */
export const ImageUploader: Story = {
    render: () => ({
        components: { BdUploader },
        setup() {
            const images = ref<string[]>([]);

            return { images };
        },
        template: `
      <div class="w-full max-w-2xl">
        <BdUploader 
          v-model="images"
          type="image"
          text="Click or drag images here to upload"
          icon="i-lucide-image"
          accept="image/*"
          :max-size="5 * 1024 * 1024"
          :max-count="3"
          multiple
        />
        <div class="mt-4 text-sm text-gray-600">
          Uploaded images: {{ images.length }}
        </div>
      </div>
    `,
    }),
};

/**
 * Single file uploader
 */
export const SingleFile: Story = {
    render: () => ({
        components: { BdUploader },
        setup() {
            const file = ref<string>("");

            return { file };
        },
        template: `
      <div class="w-full max-w-2xl">
        <BdUploader 
          v-model="file"
          type="file"
          single
          text="Click to select a single file"
          icon="i-lucide-file"
          accept=".pdf,.doc,.docx,.txt"
          :max-size="10 * 1024 * 1024"
        />
        <div class="mt-4 text-sm text-gray-600">
          Selected file: {{ file || 'None' }}
        </div>
      </div>
    `,
    }),
};

/**
 * Video uploader
 */
export const VideoUploader: Story = {
    render: () => ({
        components: { BdUploader },
        setup() {
            const videos = ref<string[]>([]);

            return { videos };
        },
        template: `
      <div class="w-full max-w-2xl">
        <BdUploader 
          v-model="videos"
          type="video"
          text="Click or drag videos here to upload"
          icon="i-lucide-video"
          accept="video/*"
          :max-size="100 * 1024 * 1024"
          :max-count="2"
          multiple
        />
        <div class="mt-4 text-sm text-gray-600">
          Uploaded videos: {{ videos.length }}
        </div>
      </div>
    `,
    }),
};

/**
 * With file size limit
 */
export const WithSizeLimit: Story = {
    render: () => ({
        components: { BdUploader },
        setup() {
            const files = ref<string[]>([]);

            return { files };
        },
        template: `
      <div class="w-full max-w-2xl">
        <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 class="font-medium text-yellow-800 mb-2">File Size Limit</h4>
          <p class="text-sm text-yellow-700">
            Maximum file size: 2MB per file
          </p>
        </div>
        
        <BdUploader 
          v-model="files"
          type="file"
          text="Upload files (max 2MB each)"
          icon="i-lucide-upload"
          :max-size="2 * 1024 * 1024"
          :max-count="5"
          multiple
        />
        <div class="mt-4 text-sm text-gray-600">
          Uploaded files: {{ files.length }}
        </div>
      </div>
    `,
    }),
};

/**
 * With file type restrictions
 */
export const WithTypeRestrictions: Story = {
    render: () => ({
        components: { BdUploader },
        setup() {
            const files = ref<string[]>([]);

            return { files };
        },
        template: `
      <div class="w-full max-w-2xl">
        <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 class="font-medium text-blue-800 mb-2">File Type Restrictions</h4>
          <p class="text-sm text-blue-700">
            Only PDF, DOC, DOCX, and TXT files are allowed
          </p>
        </div>
        
        <BdUploader 
          v-model="files"
          type="file"
          text="Upload documents only"
          icon="i-lucide-file-text"
          accept=".pdf,.doc,.docx,.txt"
          :max-count="3"
          multiple
        />
        <div class="mt-4 text-sm text-gray-600">
          Uploaded documents: {{ files.length }}
        </div>
      </div>
    `,
    }),
};

/**
 * Disabled state
 */
export const Disabled: Story = {
    render: () => ({
        components: { BdUploader },
        setup() {
            const files = ref<string[]>([]);

            return { files };
        },
        template: `
      <div class="w-full max-w-2xl">
        <BdUploader 
          v-model="files"
          type="file"
          text="Upload is disabled"
          icon="i-lucide-upload"
          disabled
          multiple
        />
        <div class="mt-4 text-sm text-gray-500">
          This uploader is disabled
        </div>
      </div>
    `,
    }),
};

/**
 * Custom styling
 */
export const CustomStyling: Story = {
    render: () => ({
        components: { BdUploader },
        setup() {
            const files = ref<string[]>([]);

            return { files };
        },
        template: `
      <div class="w-full max-w-2xl">
        <BdUploader 
          v-model="files"
          type="file"
          text="Custom styled uploader"
          icon="i-lucide-cloud-upload"
          class="border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 transition-colors"
          :max-count="4"
          multiple
        />
        <div class="mt-4 text-sm text-gray-600">
          Uploaded files: {{ files.length }}
        </div>
      </div>
    `,
    }),
};
