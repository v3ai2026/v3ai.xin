# @buildingai/utils

BuildingAI 项目的通用工具库。

## HTTP 客户端

基于 Axios 封装的类型安全的 HTTP 请求工具,专为后端服务调用外部 API 设计。

### 特性

- ✅ 完整的 TypeScript 类型支持
- ✅ 自动重试机制
- ✅ 请求/响应日志记录
- ✅ 统一的错误处理
- ✅ 支持拦截器
- ✅ 超时控制
- ✅ 请求取消支持
- ✅ 灵活的配置选项

### 基础使用

```typescript
import { createHttpClient } from "@buildingai/utils";

// 创建客户端实例
const client = createHttpClient({
    baseURL: "https://api.example.com",
    timeout: 10000,
});

// 发起 GET 请求
const user = await client.get<UserData>("/users/123");

// 发起 POST 请求
const result = await client.post<CreateResult>("/users", {
    name: "John Doe",
    email: "john@example.com",
});
```

### 配置选项

```typescript
const client = createHttpClient({
    // 基础 URL
    baseURL: "https://api.example.com",

    // 超时时间(毫秒)
    timeout: 10000,

    // 请求头
    headers: {
        Authorization: "Bearer token",
        "Content-Type": "application/json",
    },

    // 重试配置
    retryConfig: {
        retries: 3, // 最大重试次数
        retryDelay: 1000, // 重试延迟(毫秒)
        retryStatusCodes: [408, 429, 500, 502, 503, 504],
        shouldRetry: (error) => true, // 自定义重试条件
    },

    // 日志配置
    logConfig: {
        enableRequestLog: true, // 启用请求日志
        enableResponseLog: true, // 启用响应日志
        enableErrorLog: true, // 启用错误日志
    },

    // 是否自动转换响应数据
    autoTransformResponse: true, // true: 返回 data, false: 返回完整 response
});
```

### 使用拦截器

```typescript
const client = createHttpClient({
    baseURL: "https://api.example.com",
});

// 请求拦截器 - 添加认证 token
client.interceptors.request.use(
    (config) => {
        config.headers.Authorization = `Bearer ${getToken()}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// 响应拦截器 - 处理业务错误
client.interceptors.response.use(
    (response) => {
        if (response.data.code !== 0) {
            throw new Error(response.data.message);
        }
        return response;
    },
    (error) => {
        // 处理错误
        return Promise.reject(error);
    },
);
```

### 在 NestJS 服务中使用

```typescript
import { Injectable } from "@nestjs/common";
import { createHttpClient } from "@buildingai/utils";

@Injectable()
export class ExternalApiService {
    private readonly httpClient;

    constructor() {
        this.httpClient = createHttpClient({
            baseURL: process.env.EXTERNAL_API_URL,
            timeout: 10000,
            retryConfig: {
                retries: 3,
                retryDelay: 1000,
            },
            logConfig: {
                enableErrorLog: true,
            },
        });

        // 添加请求拦截器
        this.httpClient.interceptors.request.use((config) => {
            config.headers["X-API-Key"] = process.env.EXTERNAL_API_KEY;
            return config;
        });
    }

    async getUserInfo(userId: string) {
        return this.httpClient.get<UserInfo>(`/users/${userId}`);
    }

    async createOrder(orderData: CreateOrderDto) {
        return this.httpClient.post<OrderResult>("/orders", orderData);
    }
}
```

### 高级用法

#### 跳过重试

```typescript
// 单次请求跳过重试
await client.get("/users", { skipRetry: true });
```

#### 跳过日志

```typescript
// 单次请求跳过日志记录
await client.get("/users", { skipLog: true });
```

#### 自定义日志处理

```typescript
const client = createHttpClient({
    logConfig: {
        enableRequestLog: true,
        customLogger: {
            request: (config) => {
                console.log(`发起请求: ${config.method} ${config.url}`);
            },
            response: (response) => {
                console.log(`收到响应: ${response.status}`);
            },
            error: (error) => {
                console.error(`请求失败: ${error.message}`);
            },
        },
    },
});
```

#### 取消请求

```typescript
// 创建取消令牌
const cancelToken = client.createCancelToken();

// 发起可取消的请求
const promise = client.get("/users", {
    cancelToken: cancelToken.token,
});

// 取消请求
cancelToken.cancel("用户取消了请求");

// 处理取消
try {
    await promise;
} catch (error) {
    if (axios.isCancel(error)) {
        console.log("请求已取消:", error.message);
    }
}
```

#### 使用 AbortController (推荐)

```typescript
// 使用标准的 AbortController API
const controller = new AbortController();

const promise = client.get("/users", {
    signal: controller.signal,
});

// 取消请求
controller.abort();

// 处理取消
try {
    await promise;
} catch (error) {
    if (error.code === "ERR_CANCELED") {
        console.log("请求已取消");
    }
}
```

#### 使用默认客户端

```typescript
import { defaultHttpClient } from "@buildingai/utils";

// 快速使用,无需配置
const data = await defaultHttpClient.get("https://api.example.com/data");
```

### API 参考

#### createHttpClient(config)

创建 HTTP 客户端实例。

**参数:**

- `config`: HttpClientConfig - 客户端配置

**返回:**

- `HttpClientInstance` - 客户端实例

#### HttpClientInstance 方法

- `get<T>(url, config?)`: Promise<T>
- `post<T>(url, data?, config?)`: Promise<T>
- `put<T>(url, data?, config?)`: Promise<T>
- `patch<T>(url, data?, config?)`: Promise<T>
- `delete<T>(url, config?)`: Promise<T>
- `head<T>(url, config?)`: Promise<T>
- `options<T>(url, config?)`: Promise<T>
- `request<T>(config)`: Promise<T>
- `getUri(config?)`: string
- `createCancelToken()`: CancelTokenSource

### 类型定义

所有类型定义都可以从 `@buildingai/utils` 导入:

```typescript
import type {
    HttpClientConfig,
    HttpRequestConfig,
    HttpResponse,
    HttpError,
    RetryConfig,
    LogConfig,
} from "@buildingai/utils";
```
