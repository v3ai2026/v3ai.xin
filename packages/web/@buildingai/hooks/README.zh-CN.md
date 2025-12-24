# @buildingai/hooks

BuildingAI Vue 组合式 API 模块 - 可复用的业务逻辑 Hooks

## 📄 模块概述

`@buildingai/hooks`
是 BuildingAI 项目中的 Vue 组合式 API（Composables）集合模块，提供大量可复用的业务逻辑 hooks，包含聊天、图片预览、消息提示、模态框管理、分页等功能。

### 核心职责

1. **业务逻辑封装**: 将常用业务逻辑封装成可复用的 hooks
2. **代码复用**: 减少重复代码，提高开发效率
3. **类型安全**: 完整的 TypeScript 类型支持
4. **功能完整**: 覆盖常见的业务场景

---

## 📁 目录结构

```
src/
├── use-access-control.ts    # 权限控制 Hook
├── use-chat.ts              # 聊天功能 Hook
├── use-image-preview.ts     # 图片预览 Hook
├── use-lock-fn.ts           # 函数锁定 Hook
├── use-message.ts           # 消息提示 Hook
├── use-modal.ts             # 模态框管理 Hook
├── use-mount-component.ts   # 组件挂载 Hook
├── use-paging.ts            # 分页功能 Hook
├── use-polling-task.ts      # 轮询任务 Hook
├── use-route-path.ts        # 路由路径 Hook
├── use-smart-navigate.ts    # 智能导航 Hook
└── index.ts                 # 模块导出入口
```

---

## 🧩 Hooks 说明

### use-access-control

权限控制 Hook，用于检查用户权限和访问控制。

### use-chat

聊天功能 Hook，提供聊天对话、流式传输等功能。

### use-image-preview

图片预览 Hook，支持图片点击预览、放大查看等功能。

### use-lock-fn

函数锁定 Hook，防止函数重复执行。

### use-message

消息提示 Hook，提供成功、错误、警告等消息提示功能。

### use-modal

模态框管理 Hook，用于打开、关闭和管理模态框。

### use-mount-component

组件挂载 Hook，用于动态挂载组件。

### use-paging

分页功能 Hook，提供分页数据的加载和管理。

### use-polling-task

轮询任务 Hook，用于定时轮询任务。

### use-route-path

路由路径 Hook，提供路由路径相关的工具函数。

### use-smart-navigate

智能导航 Hook，提供智能路由导航功能。

---

## 🚀 使用方式

```typescript
import { useMessage, useModal, usePaging, useImagePreview } from "@buildingai/hooks";

// 消息提示
const message = useMessage();
message.success("操作成功");
message.error("操作失败");

// 模态框管理
const modal = useModal();
modal.open("confirm");

// 分页功能
const paging = usePaging({
    onFetch: async (page, pageSize) => {
        // 获取数据
    },
});

// 图片预览
const { preview } = useImagePreview();
preview(imageUrl);
```

---

## 📝 技术栈

- **Vue 3**: Composition API
- **@vueuse/core**: Vue 工具库
- **TypeScript**: 类型支持
- **@nuxt/ui**: UI 组件

---

## 📄 License

Copyright © BuildingAI Teams - Private License
