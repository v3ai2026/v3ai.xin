# @buildingai/http

BuildingAI HTTP 客户端模块 - 统一的 HTTP 请求封装

## 📄 模块概述

`@buildingai/http` 是 BuildingAI 项目中的 HTTP 客户端工具模块，基于 `ofetch`
提供统一的 HTTP 请求封装。支持请求拦截、响应处理、错误处理、流式传输等功能。

### 核心职责

1. **HTTP 请求封装**: 统一的 HTTP 请求接口
2. **拦截器管理**: 请求和响应拦截器
3. **错误处理**: 统一的错误处理机制
4. **特殊功能**: 文件上传、流式传输等

---

## 📁 目录结构

```
src/
├── builders/
│   └── http-client-builder.ts    # HTTP 客户端构建器
├── core/
│   ├── http-client-impl.ts      # HTTP 客户端实现
│   ├── interceptor-manager.ts   # 拦截器管理器
│   └── request-executor.ts      # 请求执行器
├── features/
│   ├── chat-stream.ts           # 聊天流式传输
│   └── file-upload.ts           # 文件上传
├── handlers/
│   ├── error-handler.ts         # 错误处理器
│   └── response-handler.ts      # 响应处理器
├── hooks/
│   └── use-request.ts           # 请求组合式函数
├── utils/
│   ├── params-processor.ts      # 参数处理器
│   └── request-cache.ts        # 请求缓存
└── index.ts                     # 模块导出入口
```

---

## 🧩 核心模块

### 核心实现

- **HttpClientImpl**: HTTP 客户端核心实现
- **InterceptorManager**: 拦截器管理器
- **RequestExecutor**: 请求执行器

### 功能模块

- **ChatStream**: 聊天流式传输功能
- **FileUpload**: 文件上传功能

### 工具类

- **ParamsProcessor**: 参数处理和转换
- **RequestCache**: 请求缓存管理

### 处理器

- **ErrorHandler**: 错误处理逻辑
- **ResponseHandler**: 响应处理逻辑

### 构建器

- **HttpClientBuilder**: 使用构建器模式创建 HTTP 客户端

---

## 🚀 使用方式

### 创建 HTTP 客户端

```typescript
import { createHttpClient } from "@buildingai/http";

// 创建自定义客户端
const client = createHttpClient({
    baseURL: "https://api.example.com",
    timeout: 30000,
    dedupe: true,
});

// 发起请求
const data = await client.get("/users");
```

### 使用组合式函数

```typescript
import { useRequest } from "@buildingai/http/hooks/use-request";

const { request, get, post, put, del } = useRequest({
    apiPrefix: "/api/v1",
    requireAuth: true,
});

// 发起 GET 请求
const users = await get("/users");
```

---

## 📝 技术栈

- **ofetch**: 基于 fetch 的 HTTP 库
- **Vue 3**: Vue 框架
- **TypeScript**: 类型支持
- **@buildingai/stores**: 状态管理

---

## 📄 License

Copyright © BuildingAI Teams - Private License
