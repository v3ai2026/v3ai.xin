# @buildingai/hooks

BuildingAI Vue Composables Module - Reusable Business Logic Hooks

## 📄 Module Overview

`@buildingai/hooks` is the Vue Composables collection module in the BuildingAI project, providing
numerous reusable business logic hooks including chat, image preview, message notifications, modal
management, pagination, and more.

### Core Responsibilities

1. **Business Logic Encapsulation**: Encapsulate common business logic into reusable hooks
2. **Code Reuse**: Reduce duplicate code and improve development efficiency
3. **Type Safety**: Complete TypeScript type support
4. **Complete Features**: Cover common business scenarios

---

## 📁 Directory Structure

```
src/
├── use-access-control.ts    # Access control Hook
├── use-chat.ts              # Chat functionality Hook
├── use-image-preview.ts     # Image preview Hook
├── use-lock-fn.ts           # Function locking Hook
├── use-message.ts           # Message notification Hook
├── use-modal.ts             # Modal management Hook
├── use-mount-component.ts   # Component mounting Hook
├── use-paging.ts            # Pagination Hook
├── use-polling-task.ts      # Polling task Hook
├── use-route-path.ts        # Route path Hook
├── use-smart-navigate.ts    # Smart navigation Hook
└── index.ts                 # Module export entry
```

---

## 🧩 Hooks Details

### use-access-control

Access control Hook for checking user permissions and access control.

### use-chat

Chat functionality Hook, providing chat conversation and streaming features.

### use-image-preview

Image preview Hook, supporting click-to-preview and zoom functionality.

### use-lock-fn

Function locking Hook to prevent duplicate function execution.

### use-message

Message notification Hook, providing success, error, warning notifications.

### use-modal

Modal management Hook for opening, closing, and managing modals.

### use-mount-component

Component mounting Hook for dynamically mounting components.

### use-paging

Pagination Hook for loading and managing paginated data.

### use-polling-task

Polling task Hook for scheduled polling tasks.

### use-route-path

Route path Hook providing route path related utility functions.

### use-smart-navigate

Smart navigation Hook for intelligent route navigation.

---

## 🚀 Usage

```typescript
import { useMessage, useModal, usePaging, useImagePreview } from "@buildingai/hooks";

// Message notifications
const message = useMessage();
message.success("Operation successful");
message.error("Operation failed");

// Modal management
const modal = useModal();
modal.open("confirm");

// Pagination
const paging = usePaging({
    onFetch: async (page, pageSize) => {
        // Fetch data
    },
});

// Image preview
const { preview } = useImagePreview();
preview(imageUrl);
```

---

## 📝 Tech Stack

- **Vue 3**: Composition API
- **@vueuse/core**: Vue utilities
- **TypeScript**: Type support
- **@nuxt/ui**: UI components

---

## 📄 License

Copyright © BuildingAI Teams - Private License
