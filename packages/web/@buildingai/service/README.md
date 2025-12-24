# @buildingai/service

BuildingAI Service Layer Module - API Interface Encapsulation and Type Definitions

## 📄 Module Overview

`@buildingai/service` is the service layer module in the BuildingAI project, responsible for
encapsulating all API interface calls, request handling, and response type definitions. This module
provides a unified API calling method, supporting both frontend user APIs and backend management
APIs.

### Core Responsibilities

1. **API Encapsulation**: Unified encapsulation of all API interface calls
2. **Type Definitions**: Complete TypeScript type support
3. **Request Handling**: Unified request and response handling
4. **Interface Management**: Separation of frontend user APIs and backend management APIs

---

## 📁 Directory Structure

```
src/
├── common.ts           # Common APIs (site config, login settings, etc.)
├── consoleapi/        # Backend Management APIs
│   ├── common.ts      # Common interfaces
│   ├── user.ts        # User management
│   ├── role.ts        # Role management
│   ├── permission.ts  # Permission management
│   ├── menu.ts        # Menu management
│   ├── system.ts      # System configuration
│   ├── website.ts     # Website configuration
│   ├── ai-model.ts    # AI Model management
│   ├── ai-agent.ts    # AI Agent management
│   ├── ai-conversation.ts # AI Conversation management
│   ├── ai-datasets.ts # AI Datasets management
│   ├── ai-provider.ts # AI Provider management
│   ├── mcp-server.ts  # MCP Server management
│   ├── extensions.ts  # Extensions management
│   ├── secret-list.ts # Secret management
│   ├── secret-template.ts # Secret template
│   ├── financial-center.ts # Financial center
│   ├── account-balance.ts # Account balance
│   ├── order-recharge.ts # Order recharge
│   ├── payconfig.ts   # Payment config
│   ├── oaconfig.ts    # OA config
│   ├── package-management.ts # Package management
│   └── decorate.ts    # Decorate management
├── webapi/            # Frontend User APIs
│   ├── user.ts        # User information
│   ├── ai-conversation.ts # AI Conversation
│   ├── ai-agent.ts    # AI Agent
│   ├── ai-agent-publish.ts # AI Agent publish
│   ├── mcp-server.ts # MCP Server
│   ├── recharge-center.ts # Recharge center
│   ├── purchase-record.ts # Purchase record
│   ├── power-detail.ts # Power detail
│   └── decorate.ts    # Decorate
└── models/            # Type definitions
    ├── globals.d.ts   # Global types
    └── message.d.ts    # Message types
```

---

## 🚀 Usage

### Import API Functions

```typescript
// Common APIs
import { apiGetSiteConfig, apiGetLoginSettings } from "@buildingai/service/common";

// Backend Management APIs
import { apiGetUserList, apiUpdateUser } from "@buildingai/service/consoleapi/user";
import { apiGetRoleList } from "@buildingai/service/consoleapi/role";

// Frontend User APIs
import { apiGetCurrentUserInfo } from "@buildingai/service/webapi/user";
import { apiCreateConversation } from "@buildingai/service/webapi/ai-conversation";
```

### Usage Examples

```typescript
// Get site configuration
const config = await apiGetSiteConfig();

// Get user list
const users = await apiGetUserList({ page: 1, pageSize: 10 });

// Get current user information
const userInfo = await apiGetCurrentUserInfo();
```

---

## 📝 Tech Stack

- **TypeScript**: Complete type support
- **@buildingai/constants**: Constant definitions
- **@buildingai/types**: Type definitions

---

## 📄 License

Copyright © BuildingAI Teams - Private License
