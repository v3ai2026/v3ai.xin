# @buildingai/http

BuildingAI HTTP Client Module - Unified HTTP Request Encapsulation

## 📄 Module Overview

`@buildingai/http` is the HTTP client utility module in the BuildingAI project, providing unified
HTTP request encapsulation based on `ofetch`. It supports request interception, response handling,
error handling, streaming, and more.

### Core Responsibilities

1. **HTTP Request Encapsulation**: Unified HTTP request interface
2. **Interceptor Management**: Request and response interceptors
3. **Error Handling**: Unified error handling mechanism
4. **Special Features**: File upload, streaming, etc.

---

## 📁 Directory Structure

```
src/
├── builders/
│   └── http-client-builder.ts    # HTTP client builder
├── core/
│   ├── http-client-impl.ts      # HTTP client implementation
│   ├── interceptor-manager.ts   # Interceptor manager
│   └── request-executor.ts      # Request executor
├── features/
│   ├── chat-stream.ts           # Chat streaming
│   └── file-upload.ts           # File upload
├── handlers/
│   ├── error-handler.ts         # Error handler
│   └── response-handler.ts      # Response handler
├── hooks/
│   └── use-request.ts           # Request composable
├── utils/
│   ├── params-processor.ts      # Parameter processor
│   └── request-cache.ts        # Request cache
└── index.ts                     # Module export entry
```

---

## 🧩 Core Modules

### Core Implementation

- **HttpClientImpl**: HTTP client core implementation
- **InterceptorManager**: Interceptor manager
- **RequestExecutor**: Request executor

### Feature Modules

- **ChatStream**: Chat streaming functionality
- **FileUpload**: File upload functionality

### Utility Classes

- **ParamsProcessor**: Parameter processing and conversion
- **RequestCache**: Request cache management

### Handlers

- **ErrorHandler**: Error handling logic
- **ResponseHandler**: Response handling logic

### Builder

- **HttpClientBuilder**: Build HTTP client using builder pattern

---

## 🚀 Usage

### Create HTTP Client

```typescript
import { createHttpClient } from "@buildingai/http";

// Create custom client
const client = createHttpClient({
    baseURL: "https://api.example.com",
    timeout: 30000,
    dedupe: true,
});

// Make request
const data = await client.get("/users");
```

### Use Composable Function

```typescript
import { useRequest } from "@buildingai/http/hooks/use-request";

const { request, get, post, put, del } = useRequest({
    apiPrefix: "/api/v1",
    requireAuth: true,
});

// Make GET request
const users = await get("/users");
```

---

## 📝 Tech Stack

- **ofetch**: Fetch-based HTTP library
- **Vue 3**: Vue framework
- **TypeScript**: Type support
- **@buildingai/stores**: State management

---

## 📄 License

Copyright © BuildingAI Teams - Private License
