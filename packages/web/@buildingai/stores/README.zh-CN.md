# @buildingai/stores

BuildingAI 状态管理模块 - 基于 Pinia 的全局状态管理

## 📄 模块概述

`@buildingai/stores`
是 BuildingAI 项目中的状态管理模块，使用 Pinia 提供全局状态管理功能。该模块包含应用配置、用户认证、权限管理和界面控制等核心状态。

### 核心职责

1. **应用配置管理**: 站点配置、登录设置等全局配置
2. **用户认证**: 登录、登出、用户信息管理
3. **权限管理**: 用户权限检查和菜单数据管理
4. **界面控制**: 模态框、布局模式等 UI 状态

---

## 📁 目录结构

```
src/
├── app.ts        # 应用配置 Store
├── user.ts       # 用户认证 Store
├── permission.ts # 权限管理 Store
└── controls.ts   # 界面控制 Store
```

---

## 🚀 使用方式

```typescript
import { useUserStore } from "@buildingai/stores/user";
import { useAppStore } from "@buildingai/stores/app";
import { usePermissionStore } from "@buildingai/stores/permission";
import { useControlsStore } from "@buildingai/stores/controls";

// 使用用户 Store
const userStore = useUserStore();
if (!userStore.isLogin) {
    await userStore.toLogin();
}

// 使用应用配置 Store
const appStore = useAppStore();
await appStore.getConfig();

// 使用权限 Store
const permissionStore = usePermissionStore();
const hasAccess = permissionStore.hasPermission("user:list");

// 使用控制 Store
const controlsStore = useControlsStore();
controlsStore.toggleSettingsModal();
```

---

## 📝 技术栈

- **Pinia**: Vue 3 状态管理库
- **TypeScript**: 类型支持
- **@buildingai/service**: 内部服务模块

---

## 📄 License

Copyright © BuildingAI Teams - Private License
