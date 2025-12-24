# @buildingai/service

BuildingAI 服务层模块 - API 接口封装和类型定义

## 📄 模块概述

`@buildingai/service`
是 BuildingAI 项目中的服务层模块，负责封装所有的 API 接口调用、请求处理和响应类型定义。该模块提供了统一的 API 调用方式，支持前台用户 API 和后台管理 API。

### 核心职责

1. **API 封装**: 统一封装所有 API 接口调用
2. **类型定义**: 提供完整的 TypeScript 类型支持
3. **请求处理**: 统一的请求和响应处理
4. **接口管理**: 前台用户 API 和后台管理 API 分离

---

## 📁 目录结构

```
src/
├── common.ts           # 通用 API（站点配置、登录设置等）
├── consoleapi/        # 后台管理 API
│   ├── common.ts      # 通用接口
│   ├── user.ts        # 用户管理
│   ├── role.ts        # 角色管理
│   ├── permission.ts   # 权限管理
│   ├── menu.ts        # 菜单管理
│   ├── system.ts      # 系统配置
│   ├── website.ts     # 网站配置
│   ├── ai-model.ts    # AI 模型管理
│   ├── ai-agent.ts    # AI 智能体管理
│   ├── ai-conversation.ts # AI 对话管理
│   ├── ai-datasets.ts # AI 数据集管理
│   ├── ai-provider.ts # AI 提供商管理
│   ├── mcp-server.ts  # MCP 服务器管理
│   ├── extensions.ts  # 扩展管理
│   ├── secret-list.ts # 密钥管理
│   ├── secret-template.ts # 密钥模板
│   ├── financial-center.ts # 财务中心
│   ├── account-balance.ts # 账户余额
│   ├── order-recharge.ts # 订单充值
│   ├── payconfig.ts # 支付配置
│   ├── oaconfig.ts # OA 配置
│   ├── package-management.ts # 套餐管理
│   └── decorate.ts # 装饰管理
├── webapi/            # 前台用户 API
│   ├── user.ts        # 用户信息
│   ├── ai-conversation.ts # AI 对话
│   ├── ai-agent.ts    # AI 智能体
│   ├── ai-agent-publish.ts # AI 智能体发布
│   ├── mcp-server.ts # MCP 服务器
│   ├── recharge-center.ts # 充值中心
│   ├── purchase-record.ts # 购买记录
│   ├── power-detail.ts # 权益详情
│   └── decorate.ts    # 装饰
└── models/            # 类型定义
    ├── globals.d.ts  # 全局类型
    └── message.d.ts   # 消息类型
```

---

## 🚀 使用方式

### 导入 API 函数

```typescript
// 通用 API
import { apiGetSiteConfig, apiGetLoginSettings } from "@buildingai/service/common";

// 后台管理 API
import { apiGetUserList, apiUpdateUser } from "@buildingai/service/consoleapi/user";
import { apiGetRoleList } from "@buildingai/service/consoleapi/role";

// 前台用户 API
import { apiGetCurrentUserInfo } from "@buildingai/service/webapi/user";
import { apiCreateConversation } from "@buildingai/service/webapi/ai-conversation";
```

### 使用示例

```typescript
// 获取站点配置
const config = await apiGetSiteConfig();

// 获取用户列表
const users = await apiGetUserList({ page: 1, pageSize: 10 });

// 获取当前用户信息
const userInfo = await apiGetCurrentUserInfo();
```

---

## 📝 技术栈

- **TypeScript**: 完整类型支持
- **@buildingai/constants**: 常量定义
- **@buildingai/types**: 类型定义

---

## 📄 License

Copyright © BuildingAI Teams - Private License
