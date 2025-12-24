# @buildingai/i18n-config

BuildingAI 国际化配置模块 - Nuxt i18n 配置加载器

## 📄 模块概述

`@buildingai/i18n-config` 是 BuildingAI 项目中的国际化配置模块，提供通用的 Nuxt
i18n 配置加载器，支持动态路径加载和插件系统。该模块提供语言配置、翻译文件管理和工具函数。

### 核心职责

1. **语言配置**: 定义支持的语言（中文、英文、日文）
2. **动态加载**: 自动加载翻译文件
3. **工具函数**: 提供语言相关的工具函数
4. **共享翻译**: 提供通用的共享翻译内容

---

## 📁 目录结构

```
src/
├── generate-locales.ts # 生成和加载翻译模块的工具函数
├── language.ts         # 语言配置和工具函数
├── index.ts            # 模块导出入口
└── shared/             # 共享翻译文件
    ├── en/             # 英文翻译
    │   ├── common.json
    │   ├── layouts.json
    │   └── login.json
    ├── zh/             # 中文翻译
    │   ├── common.json
    │   ├── layouts.json
    │   └── login.json
    ├── jp/             # 日文翻译
    │   ├── common.json
    │   ├── layouts.json
    │   └── login.json
    └── index.ts        # 共享翻译导出
```

---

## 🧩 功能说明

### 支持的语言

- **zh** (简体中文)
- **en** (English)
- **jp** (日本語)

### 主要功能

- `getDefaultLanguage()`: 根据浏览器设置获取默认语言
- `getTranslationModules()`: 动态加载翻译模块
- `getSharedMessages()`: 获取共享翻译内容
- `isLanguageSupported()`: 检查语言是否支持
- `getLanguageOption()`: 获取语言配置选项

---

## 🚀 使用方式

```typescript
import { getDefaultLanguage, getLanguageOption, sharedMessages } from "@buildingai/i18n-config";

// 获取默认语言
const defaultLang = getDefaultLanguage();

// 获取语言配置
const langOption = getLanguageOption("zh");

// 使用共享翻译
const messages = sharedMessages.zh;
```

---

## 📝 技术栈

- **TypeScript**: 类型支持
- **Nuxt**: Nuxt 3 框架
- **Vite**: 构建工具

---

## 📄 License

Copyright © BuildingAI Teams - Private License
