# Vercel 自动部署配置说明

本仓库已配置自动部署到 Vercel。当代码推送到 `main` 或 `master` 分支时，GitHub Actions 会自动构建并部署到 Vercel。

## 配置步骤

### 1. 获取 Vercel Token

1. 访问 [Vercel Token 设置页面](https://vercel.com/account/tokens)
2. 创建一个新的 Token，命名为 `GitHub Actions` 或其他你喜欢的名称
3. 复制生成的 Token（只显示一次，请妥善保存）

### 2. 获取 Vercel Project ID 和 Organization ID

1. 在 Vercel 中打开你的项目
2. 进入项目设置 (Settings)
3. 在 General 选项卡中找到：
   - **Project ID**: 项目的唯一标识符
   - **Organization ID**: 组织的唯一标识符

或者通过命令行获取：

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 链接项目（在项目根目录执行）
vercel link

# 查看项目信息
cat .vercel/project.json
```

### 3. 配置 GitHub Secrets

在 GitHub 仓库中配置以下 Secrets：

1. 进入仓库的 `Settings` > `Secrets and variables` > `Actions`
2. 点击 `New repository secret` 添加以下三个 secrets：

   - **VERCEL_TOKEN**: 在步骤 1 中获取的 Vercel Token
   - **VERCEL_ORG_ID**: 在步骤 2 中获取的 Organization ID
   - **VERCEL_PROJECT_ID**: 在步骤 2 中获取的 Project ID

### 4. 配置 .npmrc（可选）

如果你需要使用特定的 npm registry，确保 `.npmrc` 文件已正确配置。

### 5. 触发部署

配置完成后，只需将代码推送到 `main` 或 `master` 分支：

```bash
git add .
git commit -m "feat: trigger deployment"
git push origin main
```

GitHub Actions 会自动：
1. 检出代码
2. 安装依赖
3. 构建项目
4. 部署到 Vercel

### 6. 查看部署状态

- 在 GitHub 仓库的 `Actions` 标签页查看工作流运行状态
- 在 Vercel 控制台查看部署详情

## 文件说明

- **`.github/workflows/deploy.yml`**: GitHub Actions 工作流配置文件
- **`vercel.json`**: Vercel 项目配置文件
- **`package.json`**: 包含构建脚本 `build:web`

## 故障排除

### 问题：部署失败，提示找不到输出目录

确保 `vercel.json` 中的 `outputDirectory` 配置正确，应该指向 `public/web`。

### 问题：构建失败，依赖安装错误

1. 检查 Node.js 版本是否匹配（需要 22.x）
2. 确认 pnpm 版本为 10.20.0
3. 检查 `.npmrc` 配置是否正确

### 问题：Vercel Token 无效

重新生成 Vercel Token 并更新 GitHub Secret。

## 手动部署（可选）

如果需要手动部署到 Vercel：

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm run build:web

# 部署到 Vercel
vercel --prod
```

## 注意事项

- 确保 Vercel 项目已正确配置
- 构建命令：`pnpm run build:web`
- 输出目录：`public/web`
- Node.js 版本：22.x
- 包管理器：pnpm 10.20.0
