# GitHub Pages 自动部署配置说明

本仓库已配置自动部署到 GitHub Pages。当代码推送到 `main` 或 `master` 分支时，GitHub Actions 会自动构建并部署到 GitHub Pages。

## 配置步骤

### 1. 启用 GitHub Pages

1. 访问仓库的 `Settings` > `Pages`
2. 在 "Build and deployment" 部分：
   - **Source**: 选择 `GitHub Actions`
3. 保存设置

### 2. 推送代码触发部署

配置完成后，只需将代码推送到 `main` 或 `master` 分支：

```bash
git add .
git commit -m "feat: trigger deployment"
git push origin main
```

GitHub Actions 会自动：
1. 检出代码
2. 安装依赖（使用缓存加速）
3. 构建项目（`pnpm run build:web`）
4. 部署到 GitHub Pages

### 3. 查看部署状态

- 在 GitHub 仓库的 `Actions` 标签页查看工作流运行状态
- 在 `Settings` > `Pages` 查看部署的 URL

### 4. 访问网站

部署成功后，网站会在以下地址可访问：
```
https://<username>.github.io/<repository>/
```

例如：`https://v3ai2026.github.io/v3ai.xin/`

## 文件说明

- **`.github/workflows/deploy.yml`**: GitHub Actions 工作流配置文件
- **`package.json`**: 包含构建脚本 `build:web`

## 工作流程

1. 代码推送到 `main` 或 `master` 分支
2. GitHub Actions 触发工作流
3. 安装依赖并构建项目
4. 构建产物上传到 GitHub Pages
5. 自动部署并可访问

## 优势

✅ **无需配置 Secrets** - 使用 GitHub 内置的权限系统
✅ **完全免费** - GitHub Pages 对公开仓库免费
✅ **自动 HTTPS** - GitHub Pages 自动提供 SSL 证书
✅ **简单易用** - 只需启用 GitHub Pages 功能
✅ **快速部署** - 平均 2-5 分钟完成部署

## 故障排除

### 问题：部署失败，提示权限错误

确保在仓库设置中启用了 GitHub Pages，并选择了 `GitHub Actions` 作为部署源。

### 问题：构建失败，依赖安装错误

1. 检查 Node.js 版本是否匹配（需要 22.x）
2. 确认 pnpm 版本为 10.20.0
3. 检查 `.npmrc` 配置是否正确

### 问题：页面显示 404

1. 确认 GitHub Pages 已启用
2. 检查仓库设置中的部署分支
3. 等待几分钟让部署完成

## 自定义域名（可选）

如果想使用自定义域名：

1. 在仓库 `Settings` > `Pages` 中配置 Custom domain
2. 在 DNS 提供商处添加 CNAME 记录指向 `<username>.github.io`
3. 等待 DNS 传播（通常几分钟到几小时）

## 注意事项

- 构建命令：`pnpm run build:web`
- 输出目录：`public/web`
- Node.js 版本：22.x
- 包管理器：pnpm 10.20.0
- 部署时间：约 2-5 分钟
- 适用于静态网站（Nuxt.js 生成模式）
