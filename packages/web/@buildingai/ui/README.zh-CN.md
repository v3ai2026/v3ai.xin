# @buildingai/ui

BuildingAI UI 组件库 - BuildingAI 项目的核心 Vue 3 组件模块

## 📄 模块概述

`@buildingai/ui` 是 BuildingAI 项目中的核心 UI 组件库模块，位于 monorepo 的
`packages/web/@buildingai/ui` 目录下。该模块负责提供一套功能完整、类型安全的 Vue
3 组件集合，用于构建 BuildingAI 平台的前端界面。

### 核心职责

1. **组件封装**: 将常用的 UI 操作封装成可复用的 Vue 组件
2. **富文本编辑**: 提供基于 TipTap 的富文本编辑器，支持 Markdown 语法
3. **数据可视化**: 基于 ECharts 的图表组件，支持多种图表类型
4. **文件处理**: 文件上传、预览、管理等功能
5. **日期时间处理**: 完整的日期/时间选择器组件
6. **样式系统**: 统一的 Tailwind CSS 样式和主题系统

### 技术特点

- **基于 Vue 3 Composition API**
- **完整的 TypeScript 支持**
- **与 Nuxt UI 深度集成**
- **响应式设计，支持暗黑模式**
- **基于 Storybook 的组件文档**

---

## 📁 完整目录结构

```
@buildingai/ui/
├── src/                           # 源代码目录
│   ├── components/               # 组件目录（20+ 个组件）
│   │   ├── bd-aspect-ratio/      # 宽高比容器组件
│   │   │   ├── index.vue         # 组件实现
│   │   │   ├── types.d.ts       # TypeScript 类型定义
│   │   │   └── index.stories.ts # Storybook 文档
│   │   ├── bd-button-copy/      # 复制按钮组件
│   │   ├── bd-card/             # 卡片组件
│   │   ├── bd-chat-scroll/      # 聊天滚动组件
│   │   ├── bd-color-picker/     # 颜色选择器
│   │   ├── bd-date-picker/      # 日期选择器
│   │   ├── bd-date-range-picker/ # 日期范围选择器
│   │   ├── bd-echarts/          # ECharts 图表组件
│   │   ├── bd-editor/           # 富文本编辑器
│   │   ├── bd-infinite-scroll/  # 无限滚动组件
│   │   ├── bd-input-password/  # 密码输入框
│   │   ├── bd-markdown/         # Markdown 渲染组件
│   │   │   ├── composables/    # 组合式函数目录
│   │   │   │   └── useMarkdown.ts # Markdown 渲染核心逻辑
│   │   │   ├── plugins/        # Markdown 插件目录
│   │   │   │   ├── index.ts    # 插件统一导出
│   │   │   │   ├── copy.ts    # 代码复制插件
│   │   │   │   ├── github-alerts.ts # GitHub 提醒框插件
│   │   │   │   ├── highlight.ts # 代码高亮插件
│   │   │   │   ├── katex.ts   # 数学公式插件
│   │   │   │   └── mermaid.ts # 流程图插件
│   │   │   ├── styles/         # 样式目录
│   │   │   │   └── markdown.css # Markdown 专用样式
│   │   │   ├── index.vue       # 组件入口
│   │   │   ├── types.d.ts     # 类型定义
│   │   │   └── index.stories.ts # Storybook
│   │   ├── bd-modal/           # 模态框组件
│   │   ├── bd-modal-use/      # 模态框组合式用法
│   │   ├── bd-pagination/     # 分页组件
│   │   ├── bd-placeholder/    # 占位符组件
│   │   ├── bd-scroll-area/    # 滚动区域组件
│   │   ├── bd-slider/         # 滑块组件
│   │   ├── bd-theme-toggle/  # 主题切换组件
│   │   ├── bd-time-picker/   # 时间选择器
│   │   └── bd-uploader/      # 文件上传组件
│   │       └── constants.ts  # 上传状态常量
│   ├── images/                # 图片资源目录
│   │   ├── csv.png           # CSV 文件图标
│   │   ├── doc.png           # Word 文档图标
│   │   ├── files.png         # 通用文件图标
│   │   ├── markdown.png      # Markdown 图标
│   │   ├── pdf.png          # PDF 图标
│   │   ├── txt.png          # 文本文件图标
│   │   ├── xlsx.png         # Excel 图标
│   │   ├── zip.png         # 压缩包图标
│   │   └── index.ts         # 图标导出和映射
│   ├── styles/                # 全局样式目录
│   │   ├── globals.css       # 全局样式入口（导入所有样式）
│   │   ├── tailwind.css     # Tailwind CSS 配置
│   │   ├── variable.css     # CSS 变量定义（主题变量）
│   │   └── ripples.css      # 波纹效果样式
│   ├── utils/                 # 工具函数目录
│   │   └── date-format.ts   # 日期格式化工具函数
│   └── index.ts              # 模块统一导出入口
├── node_modules/              # 依赖包目录
├── package.json              # 包配置文件
├── tsconfig.json             # TypeScript 配置
├── eslint.config.mjs        # ESLint 配置
└── env.d.ts                 # 环境类型声明文件
```

---

## 📂 目录详解

### src/components/ - 组件目录

包含 22 个功能组件，每个组件遵循统一的目录结构：

```
组件名/
├── index.vue       # 组件主文件，实现具体功能
├── types.d.ts      # TypeScript 类型定义（Props、Emits 等）
└── index.stories.ts # Storybook 文档，用于组件文档和开发
```

### src/images/ - 图片资源

- **作用**: 存储文件类型图标
- **文件**: 8 种文件格式的图标 (csv, doc, files, markdown, pdf, txt, xlsx, zip)
- **index.ts**: 导出 `getFileIcon()` 函数，根据文件扩展名返回对应图标

### src/styles/ - 样式文件

#### globals.css

- **作用**: 全局样式入口文件
- **内容**:
    - 导入所有样式文件（tailwind, variable, ripples）
    - 全局滚动条样式
    - Roboto 字体定义
    - 阴影工具类

#### tailwind.css

- **作用**: Tailwind CSS 配置
- **内容**: 配置 Tailwind 扫描路径，包含多个项目的 Vue 文件

#### variable.css

- **作用**: CSS 变量定义，实现主题系统
- **内容**:
    - 亮色/暗色主题变量
    - 颜色系统（primary, secondary, muted, accent）
    - 滚动条颜色
    - 边框颜色

#### ripples.css

- **作用**: 波纹点击效果样式

### src/utils/ - 工具函数

#### date-format.ts

提供日期处理相关的工具函数：

- `parseToDate()` - 解析任意日期值为 Date 对象
- `parseDateValue()` - 解析为 CalendarDate 对象
- `mergeTimeToDate()` - 合并时间到日期
- `formatDate()` - 格式化日期显示

### src/index.ts - 导出入口

统一导出所有组件和类型，包括：

- 22 个组件的异步导入
- 工具函数导出
- TypeScript 类型导出

---

## 🧩 组件功能详解

### 1. BdAspectRatio - 宽高比容器

**功能**: 保持固定宽高比的容器组件

**用途**:

- 图片比例固定展示
- 视频播放器容器
- 卡片布局保持比例

**特点**:

- 支持自定义宽高比（16:9, 4:3 等）
- 响应式适配
- 完美裁剪内容

---

### 2. BdButtonCopy - 复制按钮

**功能**: 一键复制文本内容

**用途**:

- 复制代码块
- 复制链接
- 复制配置信息

**特点**:

- 点击后复制文本到剪贴板
- 复制成功提示
- 支持图标自定义

---

### 3. BdCard - 卡片组件

**功能**: 多功能卡片容器

**用途**:

- 内容展示卡片
- 数据统计卡片
- 可选的卡片列表

**特点**:

- ✅ 可选中状态
- ✅ 可点击操作
- ✅ 操作菜单支持
- ✅ 多种尺寸（sm, md, lg, xl）
- ✅ 多种变体（default, outlined, elevated, flat）
- ✅ 加载状态

---

### 4. BdChatScroll - 聊天滚动

**功能**: 专为聊天场景优化的滚动组件

**用途**:

- 即时聊天界面
- 消息流展示
- 评论列表

**特点**:

- 自动滚动到底部
- 平滑滚动动画
- 新消息自动加载

---

### 5. BdColorPicker - 颜色选择器

**功能**: 颜色选择和展示

**用途**:

- 主题颜色选择
- 标签颜色设置
- 图表配色

**特点**:

- 支持多种颜色格式（hex, rgb, hsl）
- 预定义调色板
- 实时预览

---

### 6. BdDatePicker - 日期选择器

**功能**: 日期选择组件

**用途**:

- 表单日期输入
- 日程安排
- 日期筛选

**特点**:

- 基于 `@internationalized/date`
- 完整的本地化支持
- 国际化日期格式
- 键盘导航支持

---

### 7. BdDateRangePicker - 日期范围选择器

**功能**: 选择开始和结束日期

**用途**:

- 数据报表日期范围
- 任务时间段
- 预订日期选择

**特点**:

- 自动验证日期范围
- 开始日期不能晚于结束日期
- 日历视图展示

---

### 8. BdEcharts - 图表组件

**功能**: 基于 ECharts 的数据可视化

**用途**:

- 数据报表
- 统计分析
- 趋势展示

**特点**:

- 支持多种图表类型（柱状图、折线图、饼图、雷达图等）
- 自动响应式调整
- 主题定制
- 动态数据更新
- Canvas/SVG 双渲染引擎

---

### 9. BdEditor - 富文本编辑器

**功能**: 基于 TipTap 的强大编辑器

**用途**:

- 文章编辑
- 邮件撰写
- 笔记记录
- Markdown 编辑

**特点**:

- 🎨 工具栏：粗体、斜体、下划线、删除线
- 📝 标题：H1-H6
- 📋 列表：有序列表、无序列表
- 💬 引用块和代码块
- 🖼️ 图片插入和上传
- 🔗 链接插入
- 🔄 撤销/重做
- ⚡ Markdown 双向转换
- 🎨 语法高亮

**配置项**:

- `enableMarkdown`: 启用 Markdown 模式
- `outputFormat`: 输出格式（html/markdown）
- `placeholder`: 占位提示文本

---

### 10. BdInfiniteScroll - 无限滚动

**功能**: 无限加载内容

**用途**:

- 分页数据加载
- 社交媒体动态流
- 商品列表

**特点**:

- 滚动到底部自动加载
- 加载状态提示
- 防止重复请求
- 滚动位置保持

---

### 11. BdInputPassword - 密码输入框

**功能**: 密码输入组件

**用途**:

- 登录表单
- 密码设置
- 密码修改

**特点**:

- 显示/隐藏密码切换
- 密码强度指示
- 输入验证

---

### 12. BdMarkdown - Markdown 渲染

**功能**: 强大的 Markdown 渲染引擎

**用途**:

- 文档展示
- 博客文章
- README 渲染
- 评论系统

**插件功能**:

- 📝 **基础 Markdown**: 标题、段落、列表、链接等
- 💻 **代码高亮**: 语法高亮显示（highlight.js）
- 📊 **Mermaid 图表**:
    - 流程图（flowchart）
    - 序列图（sequence diagram）
    - 状态图（state diagram）
    - 类图（class diagram）
    - 实体关系图（er diagram）
    - 甘特图（gantt）
    - 饼图（pie）
    - 等等
- 🔬 **KaTeX 数学公式**: LaTeX 数学公式渲染
- 📋 **代码复制**: 一键复制代码块
- ⚠️ **GitHub 提醒框**:
    - 注意（Note）
    - 提示（Tip）
    - 重要（Important）
    - 警告（Warning）
    - 危险（Caution）

**特性**:

- SSR 优化支持
- 实例缓存机制
- 主题自适应（亮色/暗色）
- 代码高亮主题可配置

---

### 13. BdModal - 模态框

**功能**: 对话框/弹窗组件

**用途**:

- 确认对话框
- 表单弹窗
- 详细信息展示

**特点**:

- 多种尺寸
- 自定义标题和内容
- 插槽支持
- 动画过渡

---

### 14. BdModalUse - 组合式模态框

**功能**: 使用 Composition API 的模态框用法

**特点**:

- 组合式 API 风格
- 更灵活的配置
- 编程式控制

---

### 15. BdPagination - 分页

**功能**: 分页导航组件

**用途**:

- 列表分页
- 数据分页显示
- 跳转到指定页

**特点**:

- 页码显示
- 跳转输入框
- 上一页/下一页
- 总条数显示

---

### 16. BdPlaceholder - 占位符

**功能**: 加载/空状态占位

**用途**:

- 骨架屏加载
- 空状态提示
- 加载占位

**特点**:

- 多种预设样式
- 可自定义内容
- 动画效果

---

### 17. BdScrollArea - 滚动区域

**功能**: 自定义滚动条样式

**特点**:

- 隐藏默认滚动条
- 自定义滚动样式
- 跨浏览器兼容

---

### 18. BdSlider - 滑块

**功能**: 数值范围选择

**用途**:

- 音量控制
- 数值范围选择
- 过滤条件设置

**特点**:

- 单值/双值滑块
- 自定义刻度
- 实时反馈

---

### 19. BdThemeToggle - 主题切换

**功能**: 亮色/暗色主题切换

**特点**:

- 一键切换主题
- 记住用户偏好
- 图标动画

---

### 20. BdTimePicker - 时间选择器

**功能**: 时间选择组件

**用途**:

- 时间设置
- 时间范围选择
- 表单时间输入

**特点**:

- 12/24 小时制
- 精确到秒级
- 直观的时钟界面

---

### 21. BdUploader - 文件上传

**功能**: 完整的文件上传解决方案

**用途**:

- 图片上传
- 文件上传
- 批量上传

**状态管理**:

- `INITIAL (0)`: 初始状态
- `UPLOADING (1)`: 上传中
- `SUCCESS (2)`: 上传成功
- `FAIL (3)`: 上传失败

**特点**:

- ✅ 单文件/多文件上传
- ✅ 拖拽上传
- ✅ 上传进度显示
- ✅ 文件类型校验
- ✅ 文件大小限制
- ✅ 图片预览
- ✅ 已上传文件列表展示
- ✅ 重试失败上传
- ✅ 移除文件
- ✅ 自定义上传接口

**支持的文件类型**:

- 图片：jpg, png, gif, webp, svg
- 文档：doc, docx, pdf, txt
- 表格：xlsx, csv
- 压缩包：zip, rar
- 其他类型

**功能详解**:

- `single`: 单文件模式
- `multiple`: 多文件模式
- `maxCount`: 最大文件数限制
- `maxSize`: 最大文件大小（字节）
- `accept`: 文件类型限制
- `customClass`: 自定义样式类

---

## 🚀 使用方式

### 安装

```json
{
    "dependencies": {
        "@buildingai/ui": "workspace:*"
    }
}
```

### 导入组件

```vue
<script setup lang="ts">
import { BdEditor, BdMarkdown, BdCard } from "@buildingai/ui";
</script>

<template>
    <BdEditor v-model="content" />
</template>
```

### 导入样式

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
    css: ["@buildingai/ui/styles/globals.css"],
});
```

### 导入工具函数

```typescript
import { formatDate, getFileIcon } from "@buildingai/ui";

const date = formatDate(new Date(), "zh-CN");
const icon = getFileIcon("document.pdf"); // 返回 pdf.png
```

---

## 🛠️ 开发指南

### 项目依赖

**核心依赖**:

- vue: ^3.x
- nuxt ui
- @tiptap/vue-3: 编辑器核心
- echarts: 图表库
- markdown-it: Markdown 解析
- katex: 数学公式
- mermaid: 图表渲染

**开发依赖**:

- typescript
- eslint
- @storybook/vue3

### 开发命令

```bash
# 类型检查
pnpm check-types

# 代码格式化
pnpm format
pnpm format:check

# ESLint
pnpm lint
pnpm lint:fix

# 监听模式
pnpm watch
```

### 添加新组件

1. 在 `src/components/` 创建组件目录
2. 创建 `index.vue`、`types.d.ts`、`index.stories.ts`
3. 在 `src/index.ts` 导出
4. 编写 Storybook 文档

---

## 📝 技术栈

- **Vue 3** - 渐进式框架
- **TypeScript** - 类型系统
- **Nuxt UI** - 组件基础库
- **TipTap** - 富文本编辑器
- **ECharts** - 图表库
- **Tailwind CSS** - 原子化 CSS
- **Storybook** - 组件文档

---

## 📄 License

Copyright © BuildingAI Teams - Private License
