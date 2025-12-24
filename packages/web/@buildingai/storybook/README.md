# @buildingai/storybook

BuildingAI Storybook Configuration Module - Standardized Storybook Configuration for All BuildingAI
Projects

## 📄 Module Overview

`@buildingai/storybook` is the Storybook configuration module in the BuildingAI project, responsible
for providing a unified and standardized Storybook development environment and documentation system
for the entire BuildingAI ecosystem. This module encapsulates common Storybook configurations,
plugins, presets, and best practices to ensure all projects have a consistent component development
and documentation experience.

### Core Responsibilities

1. **Unified Configuration Management**: Provides standardized Storybook main configuration
   (main.ts) and preview configuration (preview.ts)
2. **Plugin Integration**: Integrates common plugins such as Chromatic, documentation generation,
   and viewport controls
3. **Viewport Presets**: Defines common viewport sizes for mobile, tablet, desktop, etc.
4. **Theme Support**: Provides light, dark, and gray background themes
5. **Development Experience Optimization**: Resolves Vite plugin conflicts and handles Nuxt-specific
   issues
6. **Type Exports**: Provides complete TypeScript type support

### Technical Features

- **Deep Nuxt Integration**: Based on `@storybook-vue/nuxt` framework
- **Monorepo Optimization**: Automatically identifies and scans components from all projects
- **Smart Dependency Optimization**: Automatically optimizes Vite dependencies, reduces warnings
- **Virtual Module Handling**: Handles Vite plugin conflicts, compatible with Nuxt environment
- **Complete TypeScript Support**: All configurations have type definitions

---

## 📁 Complete Directory Structure

```
@buildingai/storybook/
├── main.ts              # Storybook main configuration file
├── preview.ts           # Storybook preview configuration file
├── index.ts             # Module unified export entry
├── package.json         # Package configuration file
├── eslint.config.mjs   # ESLint configuration
├── README.md           # Original README (English version)
└── README.zh-CN.md     # Chinese version README
```
