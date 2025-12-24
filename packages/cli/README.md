# BuildingAI CLI

BuildingAI 项目的命令行工具,提供项目初始化、数据库管理和 PM2 进程管理功能。

## 安装

```bash
pnpm install
```

## 命令列表

### 项目设置

#### `buildingai setup`

设置 BuildingAI 项目环境,包括:

- 检查并创建 `.env` 文件
- 安装项目依赖
- 构建项目
- 初始化数据库
- 启动 API 服务

```bash
buildingai setup
```

### 数据库管理

#### `buildingai db:init`

初始化数据库,创建必要的表结构和初始数据。

```bash
buildingai db:init
```

### PM2 进程管理

#### `buildingai pm2:start`

使用 PM2 启动 API 服务。会自动检查 `packages/api/dist` 目录是否存在。

```bash
buildingai pm2:start
```

#### `buildingai pm2:stop`

停止 API 服务。

```bash
buildingai pm2:stop
```

#### `buildingai pm2:restart`

重启 API 服务。

```bash
buildingai pm2:restart
```

#### `buildingai pm2:reload`

重载 API 服务(零停机时间重启),适用于生产环境更新。

```bash
buildingai pm2:reload
```

#### `buildingai pm2:delete`

删除 PM2 进程。

```bash
buildingai pm2:delete
```

#### `buildingai pm2:status`

查看所有 PM2 进程的状态。

```bash
buildingai pm2:status
```

#### `buildingai pm2:logs`

查看 API 服务日志。

```bash
# 查看最近 100 行日志(默认)
buildingai pm2:logs

# 查看最近 200 行日志
buildingai pm2:logs --lines 200
```

#### `buildingai pm2:monitor`

打开 PM2 监控面板,实时查看 CPU、内存等资源使用情况。

```bash
buildingai pm2:monitor
```

#### `buildingai pm2:save`

保存当前 PM2 进程列表,系统重启后可使用 `pm2 resurrect` 恢复。

```bash
buildingai pm2:save
```

#### `buildingai pm2:flush`

清空所有 PM2 日志文件。

```bash
buildingai pm2:flush
```

## PM2 配置

PM2 配置文件位于 `packages/cli/ecosystem.config.js`,主要配置包括:

- **应用名称**: `buildingai-api`
- **入口文件**: `./packages/api/dist/main.js`
- **实例数量**: 1 (cluster 模式)
- **自动重启**: 启用
- **内存限制**: 1GB
- **日志目录**: `./logs/pm2/`

## 使用流程

### 首次部署

```bash
# 1. 设置项目环境
buildingai setup

# 2. 使用 PM2 启动服务
buildingai pm2:start

# 3. 查看服务状态
buildingai pm2:status
```

### 日常维护

```bash
# 查看服务状态
buildingai pm2:status

# 查看日志
buildingai pm2:logs

# 重启服务
buildingai pm2:restart

# 零停机更新
buildingai pm2:reload
```

## 注意事项

1. **构建要求**: 使用 PM2 命令前,请确保已运行 `pnpm build` 构建项目
2. **日志管理**: 日志文件存储在 `logs/pm2/` 目录,建议定期清理
3. **进程保存**: 使用 `pm2:save` 保存进程列表后,系统重启时可自动恢复服务
4. **环境变量**: PM2 会读取项目根目录的 `.env` 文件

## 开发与生产环境

### 开发环境

开发环境推荐使用热重载模式:

```bash
cd packages/api
pnpm dev
```

如果需要测试 PM2,CLI 会自动使用项目本地的 PM2(无需全局安装):

```bash
buildingai pm2:start
```

### 生产环境

生产环境推荐全局安装 PM2:

```bash
# 全局安装 PM2
pnpm add -g pm2

# 启动服务
buildingai pm2:start

# 保存进程列表
buildingai pm2:save

# 设置开机自启动
pm2 startup
pm2 save
```

### PM2 自动检测逻辑

CLI 工具会自动检测并使用合适的 PM2:

1. **优先使用全局 PM2**(生产环境推荐)
2. **如果没有全局 PM2**,则使用项目本地的 PM2(开发环境)
3. **如果都没有**,会提示安装

这样设计的好处:

- ✅ 开发环境无需全局安装 PM2
- ✅ 生产环境使用全局 PM2,更稳定
- ✅ 自动适配,无需手动配置
