# @buildingai/nuxt

BuildingAI Nuxt 配置模块 - Nuxt 应用的统一配置和预设

## 📄 模块概述

`@buildingai/nuxt`
是 BuildingAI 项目中的 Nuxt 配置工具模块，提供 Nuxt 应用的统一配置、模块集成、预设和工具。该模块封装了 BuildingAI 生态系统在 Nuxt 中的标准配置。

### 核心职责

1. **配置管理**: 提供统一的 Nuxt 配置预设
2. **模块集成**: 集成 BuildingAI 模块（UI、Hooks、Stores 等）
3. **主题配置**: 提供主题颜色和样式配置
4. **工具函数**: 提供配置和工具函数

---

## 📁 目录结构

```
src/
├── assets/
│   ├── icons/
│   │   └── icons.json        # 图标配置文件
│   └── styles/
│       └── globals.css       # 全局样式
├── config/
│   ├── phone-area.ts         # 手机区域配置
│   ├── pwa.ts               # PWA 配置
│   └── theme.ts             # 主题配置
├── directives/
│   └── ripple.ts            # 波纹指令
├── modules/                 # BuildingAI 模块集成
│   ├── buildingai-components.ts   # 组件模块
│   ├── buildingai-hooks.ts        # Hooks 模块
│   ├── buildingai-i18n.ts         # 国际化模块
│   ├── buildingai-pages.ts        # 页面模块
│   ├── buildingai-stores.ts       # 状态管理模块
│   └── buildingai-ui.ts           # UI 模块
├── plugins/                 # 插件
│   ├── dompurify-html.ts    # HTML 清理插件
│   ├── load-cdn.client.ts   # CDN 加载插件
│   ├── ripple.ts            # 波纹插件
│   └── theme.ts             # 主题插件
├── index.ts                 # 模块导出入口
└── nuxt.config.ts          # Nuxt 配置文件
```

---

## 🧩 核心功能

### 配置预设

提供多个 Nuxt 配置预设，包括：

- **default**: 默认预设，包含所有标准配置
- SSR/CSR 支持
- 开发服务器配置
- 模块自动集成

### BuildingAI 模块

自动集成以下模块：

- `buildingai-ui`: UI 组件库
- `buildingai-hooks`: Vue Composables
- `buildingai-stores`: 状态管理
- `buildingai-i18n`: 国际化配置
- `buildingai-components`: 组件自动注册
- `buildingai-pages`: 页面路由配置

### 主题配置

提供完整的主题颜色系统：

- **14 种主色调**: red, orange, yellow, lime, green, teal, cyan, blue, indigo, violet, purple,
  fuchsia, pink, black
- **5 种中性色**: slate, gray, zinc, neutral, stone
- 颜色工具函数

### 插件

包含多个 Nuxt 插件：

- **ripple**: 波纹点击效果
- **dompurify-html**: HTML 清理和 sanitization
- **theme**: 主题切换和管理
- **load-cdn**: CDN 资源加载

---

## 🚀 使用方式

### 基础配置

```typescript
// nuxt.config.ts
import { defineBuildingAIConfig } from "@buildingai/nuxt";

export default defineBuildingAIConfig({
    // 自定义配置
});
```

### 主题配置

```typescript
import { colorList, getColor } from "@buildingai/nuxt";

// 获取颜色
const primaryColor = getColor("blue");
```

### 模块使用

BuildAI 模块会自动加载，可以直接使用：

```vue
<script setup>
import { useUserStore } from "@buildingai/stores";
import { useMessage } from "@buildingai/hooks";
</script>
```

---

## 📝 技术栈

- **Nuxt 3**: SSR 框架
- **defu**: 配置合并工具
- **@nuxt/ui**: UI 框架
- **@pinia/nuxt**: 状态管理
- **@nuxtjs/i18n**: 国际化

---

## 📄 License

Copyright © BuildingAI Teams - Private License
