# @buildingai/stores

BuildingAI State Management Module - Global State Management with Pinia

## 📄 Module Overview

`@buildingai/stores` is the state management module in the BuildingAI project, providing global
state management using Pinia. This module includes core states such as application configuration,
user authentication, permission management, and UI controls.

### Core Responsibilities

1. **Application Configuration**: Global configuration such as site config and login settings
2. **User Authentication**: Login, logout, and user information management
3. **Permission Management**: User permission checking and menu data management
4. **UI Controls**: Modal, layout mode, and other UI states

---

## 📁 Directory Structure

```
src/
├── app.ts        # Application Configuration Store
├── user.ts       # User Authentication Store
├── permission.ts # Permission Management Store
└── controls.ts   # UI Controls Store
```

---

## 🚀 Usage

```typescript
import { useUserStore } from "@buildingai/stores/user";
import { useAppStore } from "@buildingai/stores/app";
import { usePermissionStore } from "@buildingai/stores/permission";
import { useControlsStore } from "@buildingai/stores/controls";

// Use user store
const userStore = useUserStore();
if (!userStore.isLogin) {
    await userStore.toLogin();
}

// Use app store
const appStore = useAppStore();
await appStore.getConfig();

// Use permission store
const permissionStore = usePermissionStore();
const hasAccess = permissionStore.hasPermission("user:list");

// Use controls store
const controlsStore = useControlsStore();
controlsStore.toggleSettingsModal();
```

---

## 📝 Tech Stack

- **Pinia**: Vue 3 state management library
- **TypeScript**: Type support
- **@buildingai/service**: Internal service module

---

## 📄 License

Copyright © BuildingAI Teams - Private License
