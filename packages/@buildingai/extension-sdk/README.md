# @buildingai/extension-sdk

BuildingAI 插件开发 SDK,提供统一的配置和工具函数。

## 功能

### defineBuildingAITsupConfig

统一管理插件的 tsup 构建配置,提供默认配置并支持自定义覆盖。

#### 使用方式

**基础使用(使用默认配置)**

```typescript
// tsup.config.ts
import { defineBuildingAITsupConfig } from "@buildingai/extension-sdk";

export default defineBuildingAITsupConfig();
```

**自定义配置(覆盖默认值)**

```typescript
// tsup.config.ts
import { defineBuildingAITsupConfig } from "@buildingai/extension-sdk";

export default defineBuildingAITsupConfig({
    // 覆盖默认配置
    sourcemap: false,
    clean: false,
    // 添加自定义配置
    minify: true,
});
```

#### 默认配置

```typescript
{
    entry: ["src/api/index.ts"],
    outDir: "dist",
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    treeshake: true,
    target: "es2023",
    tsconfig: "tsconfig.api.json",
    skipNodeModulesBundle: true,
}
```
