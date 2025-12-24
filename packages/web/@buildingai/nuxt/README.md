# @buildingai/nuxt

BuildingAI Nuxt Configuration Module - Unified Nuxt Configuration and Presets

## 📄 Module Overview

`@buildingai/nuxt` is the Nuxt configuration utility module in the BuildingAI project, providing
unified Nuxt configuration, module integration, presets, and utilities. This module encapsulates the
standard configuration for the BuildingAI ecosystem in Nuxt applications.

### Core Responsibilities

1. **Configuration Management**: Provides unified Nuxt configuration presets
2. **Module Integration**: Integrates BuildingAI modules (UI, Hooks, Stores, etc.)
3. **Theme Configuration**: Provides theme colors and styling configurations
4. **Utility Functions**: Provides configuration and utility functions

---

## 📁 Directory Structure

```
src/
├── assets/
│   ├── icons/
│   │   └── icons.json        # Icon configuration
│   └── styles/
│       └── globals.css       # Global styles
├── config/
│   ├── phone-area.ts         # Phone area configuration
│   ├── pwa.ts               # PWA configuration
│   └── theme.ts             # Theme configuration
├── directives/
│   └── ripple.ts            # Ripple directive
├── modules/                 # BuildingAI module integration
│   ├── buildingai-components.ts   # Components module
│   ├── buildingai-hooks.ts        # Hooks module
│   ├── buildingai-i18n.ts         # Internationalization module
│   ├── buildingai-pages.ts        # Pages module
│   ├── buildingai-stores.ts       # State management module
│   └── buildingai-ui.ts           # UI module
├── plugins/                 # Plugins
│   ├── dompurify-html.ts    # HTML sanitization plugin
│   ├── load-cdn.client.ts   # CDN loading plugin
│   ├── ripple.ts           # Ripple plugin
│   └── theme.ts            # Theme plugin
├── index.ts                # Module export entry
└── nuxt.config.ts         # Nuxt configuration file
```

---

## 🧩 Core Features

### Configuration Presets

Provides multiple Nuxt configuration presets:

- **default**: Default preset with all standard configurations
- SSR/CSR support
- Development server configuration
- Automatic module integration

### BuildingAI Modules

Automatically integrates the following modules:

- `buildingai-ui`: UI component library
- `buildingai-hooks`: Vue Composables
- `buildingai-stores`: State management
- `buildingai-i18n`: Internationalization configuration
- `buildingai-components`: Automatic component registration
- `buildingai-pages`: Page routing configuration

### Theme Configuration

Provides complete theme color system:

- **14 Primary Colors**: red, orange, yellow, lime, green, teal, cyan, blue, indigo, violet, purple,
  fuchsia, pink, black
- **5 Neutral Colors**: slate, gray, zinc, neutral, stone
- Color utility functions

### Plugins

Includes multiple Nuxt plugins:

- **ripple**: Ripple click effect
- **dompurify-html**: HTML sanitization
- **theme**: Theme switching and management
- **load-cdn**: CDN resource loading

---

## 🚀 Usage

### Basic Configuration

```typescript
// nuxt.config.ts
import { defineBuildingAIConfig } from "@buildingai/nuxt";

export default defineBuildingAIConfig({
    // Custom configuration
});
```

### Theme Configuration

```typescript
import { colorList, getColor } from "@buildingai/nuxt";

// Get color
const primaryColor = getColor("blue");
```

### Module Usage

BuildAI modules are automatically loaded and can be used directly:

```vue
<script setup>
import { useUserStore } from "@buildingai/stores";
import { useMessage } from "@buildingai/hooks";
</script>
```

---

## 📝 Tech Stack

- **Nuxt 3**: SSR framework
- **defu**: Configuration merging tool
- **@nuxt/ui**: UI framework
- **@pinia/nuxt**: State management
- **@nuxtjs/i18n**: Internationalization

---

## 📄 License

Copyright © BuildingAI Teams - Private License
