# @buildingai/storybook

BuildingAI Storybook 配置模块 - 为所有 BuildingAI 项目提供标准化的 Storybook 配置

## 📄 模块概述

`@buildingai/storybook`
是 BuildingAI 项目中的 Storybook 配置模块，负责为整个 BuildingAI 生态系统提供统一、标准化的 Storybook 开发环境和文档系统。该模块封装了常用的 Storybook 配置、插件、预设和最佳实践，确保所有项目拥有一致的组件开发和文档体验。

### 核心职责

1. **统一配置管理**: 提供标准化的 Storybook 主配置（main.ts）和预览配置（preview.ts）
2. **插件集成**: 集成 Chromatic、文档生成、视图控制等常用插件
3. **视口预设**: 定义移动端、平板、桌面等常用视口尺寸
4. **主题支持**: 提供亮色、暗色、灰色等多种背景主题
5. **开发体验优化**: 解决 Vite 插件冲突、处理 Nuxt 特定问题
6. **类型导出**: 提供完整的 TypeScript 类型支持

### 技术特点

- **与 Nuxt 深度集成**: 基于 `@storybook-vue/nuxt` 框架
- **Monorepo 优化**: 自动识别并扫描所有项目的组件
- **智能依赖优化**: 自动优化 Vite 依赖，减少警告
- **虚拟模块处理**: 处理 Vite 插件冲突，兼容 Nuxt 环境
- **完整 TypeScript 支持**: 所有配置都有类型定义

---

## 📁 完整目录结构

```
@buildingai/storybook/
├── main.ts              # Storybook 主配置文件
├── preview.ts           # Storybook 预览配置文件
├── index.ts             # 模块统一导出入口
├── package.json         # 包配置文件
├── eslint.config.mjs   # ESLint 配置
├── README.md           # 原始 README（英文版）
└── README.zh-CN.md     # 中文版 README
```
