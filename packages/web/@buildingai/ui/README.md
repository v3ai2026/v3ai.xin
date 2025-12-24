# @buildingai/ui

BuildingAI UI Component Library - Core Vue 3 Component Module for BuildingAI Project

## 📄 Module Overview

`@buildingai/ui` is the core UI component library module in the BuildingAI project, located in the
`packages/web/@buildingai/ui` directory of the monorepo. This module provides a comprehensive
collection of type-safe Vue 3 components for building the BuildingAI platform's frontend interface.

### Core Responsibilities

1. **Component Encapsulation**: Wrap common UI operations into reusable Vue components
2. **Rich Text Editing**: Provide TipTap-based rich text editor with Markdown syntax support
3. **Data Visualization**: ECharts-based chart components supporting multiple chart types
4. **File Management**: File upload, preview, and management functionalities
5. **Date/Time Processing**: Complete date/time picker components
6. **Styling System**: Unified Tailwind CSS styles and theming system

### Technical Features

- **Vue 3 Composition API** based
- **Complete TypeScript** support
- **Deep integration** with Nuxt UI
- **Responsive design** with dark mode support
- **Storybook-based** component documentation

---

## 📁 Complete Directory Structure

```
@buildingai/ui/
├── src/                           # Source code directory
│   ├── components/               # Components directory (20+ components)
│   │   ├── bd-aspect-ratio/      # Aspect ratio container component
│   │   │   ├── index.vue         # Component implementation
│   │   │   ├── types.d.ts       # TypeScript type definitions
│   │   │   └── index.stories.ts # Storybook documentation
│   │   ├── bd-button-copy/      # Copy button component
│   │   ├── bd-card/             # Card component
│   │   ├── bd-chat-scroll/      # Chat scroll component
│   │   ├── bd-color-picker/     # Color picker component
│   │   ├── bd-date-picker/      # Date picker component
│   │   ├── bd-date-range-picker/ # Date range picker component
│   │   ├── bd-echarts/          # ECharts chart component
│   │   ├── bd-editor/           # Rich text editor component
│   │   ├── bd-infinite-scroll/  # Infinite scroll component
│   │   ├── bd-input-password/  # Password input component
│   │   ├── bd-markdown/         # Markdown renderer component
│   │   │   ├── composables/    # Composables directory
│   │   │   │   └── useMarkdown.ts # Markdown rendering core logic
│   │   │   ├── plugins/        # Markdown plugins directory
│   │   │   │   ├── index.ts    # Unified plugin exports
│   │   │   │   ├── copy.ts    # Code copy plugin
│   │   │   │   ├── github-alerts.ts # GitHub alerts plugin
│   │   │   │   ├── highlight.ts # Code syntax highlighting plugin
│   │   │   │   ├── katex.ts   # Mathematical formula plugin
│   │   │   │   └── mermaid.ts # Flowchart plugin
│   │   │   ├── styles/         # Styles directory
│   │   │   │   └── markdown.css # Markdown-specific styles
│   │   │   ├── index.vue       # Component entry
│   │   │   ├── types.d.ts     # Type definitions
│   │   │   └── index.stories.ts # Storybook
│   │   ├── bd-modal/           # Modal dialog component
│   │   ├── bd-modal-use/      # Composable modal usage
│   │   ├── bd-pagination/     # Pagination component
│   │   ├── bd-placeholder/    # Placeholder component
│   │   ├── bd-scroll-area/    # Scroll area component
│   │   ├── bd-slider/         # Slider component
│   │   ├── bd-theme-toggle/  # Theme toggle component
│   │   ├── bd-time-picker/   # Time picker component
│   │   └── bd-uploader/      # File upload component
│   │       └── constants.ts  # Upload status constants
│   ├── images/                # Image assets directory
│   │   ├── csv.png           # CSV file icon
│   │   ├── doc.png           # Word document icon
│   │   ├── files.png         # Generic file icon
│   │   ├── markdown.png      # Markdown icon
│   │   ├── pdf.png          # PDF icon
│   │   ├── txt.png          # Text file icon
│   │   ├── xlsx.png         # Excel icon
│   │   ├── zip.png         # Archive icon
│   │   └── index.ts         # Icon exports and mapping
│   ├── styles/                # Global styles directory
│   │   ├── globals.css       # Global styles entry (imports all styles)
│   │   ├── tailwind.css     # Tailwind CSS configuration
│   │   ├── variable.css     # CSS variable definitions (theme variables)
│   │   └── ripples.css      # Ripple effect styles
│   ├── utils/                 # Utility functions directory
│   │   └── date-format.ts   # Date formatting utilities
│   └── index.ts              # Module unified export entry
├── node_modules/              # Dependencies directory
├── package.json              # Package configuration
├── tsconfig.json             # TypeScript configuration
├── eslint.config.mjs        # ESLint configuration
└── env.d.ts                 # Environment type declarations
```

---

## 📂 Directory Explanation

### src/components/ - Components Directory

Contains 22 functional components, each following a unified directory structure:

```
component-name/
├── index.vue       # Main component file with specific functionality
├── types.d.ts      # TypeScript type definitions (Props, Emits, etc.)
└── index.stories.ts # Storybook documentation for development
```

### src/images/ - Image Assets

- **Purpose**: Store file type icons
- **Files**: 8 file format icons (csv, doc, files, markdown, pdf, txt, xlsx, zip)
- **index.ts**: Exports `getFileIcon()` function that returns corresponding icon based on file
  extension

### src/styles/ - Style Files

#### globals.css

- **Purpose**: Global styles entry file
- **Content**:
    - Imports all style files (tailwind, variable, ripples)
    - Global scrollbar styles
    - Roboto font definitions
    - Shadow utility classes

#### tailwind.css

- **Purpose**: Tailwind CSS configuration
- **Content**: Configures Tailwind scan paths for multiple project Vue files

#### variable.css

- **Purpose**: CSS variable definitions for theme system
- **Content**:
    - Light/dark theme variables
    - Color system (primary, secondary, muted, accent)
    - Scrollbar colors
    - Border colors

#### ripples.css

- **Purpose**: Ripple click effect styles

### src/utils/ - Utility Functions

#### date-format.ts

Provides date handling utility functions:

- `parseToDate()` - Parse any date value to Date object
- `parseDateValue()` - Parse to CalendarDate object
- `mergeTimeToDate()` - Merge time to date
- `formatDate()` - Format date display

### src/index.ts - Export Entry

Unified export of all components and types including:

- Async imports of 22 components
- Utility function exports
- TypeScript type exports

---

## 🧩 Component Functions Explained

### 1. BdAspectRatio - Aspect Ratio Container

**Function**: Container component that maintains fixed aspect ratio

**Use Cases**:

- Fixed ratio image display
- Video player container
- Proportional card layout

**Features**:

- Custom aspect ratio support (16:9, 4:3, etc.)
- Responsive adaptation
- Perfect content cropping

---

### 2. BdButtonCopy - Copy Button

**Function**: One-click copy text content

**Use Cases**:

- Copy code blocks
- Copy links
- Copy configuration information

**Features**:

- Copy text to clipboard on click
- Copy success notification
- Custom icon support

---

### 3. BdCard - Card Component

**Function**: Multi-functional card container

**Use Cases**:

- Content display cards
- Data statistics cards
- Selectable card lists

**Features**:

- ✅ Selectable state
- ✅ Clickable actions
- ✅ Action menu support
- ✅ Multiple sizes (sm, md, lg, xl)
- ✅ Multiple variants (default, outlined, elevated, flat)
- ✅ Loading state

---

### 4. BdChatScroll - Chat Scroll

**Function**: Scroll component optimized for chat scenarios

**Use Cases**:

- Instant messaging interface
- Message stream display
- Comment lists

**Features**:

- Auto-scroll to bottom
- Smooth scroll animation
- Auto-load new messages

---

### 5. BdColorPicker - Color Picker

**Function**: Color selection and display

**Use Cases**:

- Theme color selection
- Tag color settings
- Chart color schemes

**Features**:

- Multiple color format support (hex, rgb, hsl)
- Predefined color palettes
- Real-time preview

---

### 6. BdDatePicker - Date Picker

**Function**: Date selection component

**Use Cases**:

- Form date input
- Schedule arrangements
- Date filtering

**Features**:

- Based on `@internationalized/date`
- Complete localization support
- International date formats
- Keyboard navigation support

---

### 7. BdDateRangePicker - Date Range Picker

**Function**: Select start and end dates

**Use Cases**:

- Date range for data reports
- Task time periods
- Booking date selection

**Features**:

- Automatic date range validation
- Start date cannot be later than end date
- Calendar view display

---

### 8. BdEcharts - Chart Component

**Function**: Data visualization based on ECharts

**Use Cases**:

- Data reports
- Statistical analysis
- Trend display

**Features**:

- Multiple chart type support (bar, line, pie, radar, etc.)
- Automatic responsive adjustment
- Theme customization
- Dynamic data update
- Canvas/SVG dual rendering engines

---

### 9. BdEditor - Rich Text Editor

**Function**: Powerful editor based on TipTap

**Use Cases**:

- Article editing
- Email composition
- Note taking
- Markdown editing

**Features**:

- 🎨 Toolbar: Bold, italic, underline, strikethrough
- 📝 Headings: H1-H6
- 📋 Lists: Ordered and unordered lists
- 💬 Blockquotes and code blocks
- 🖼️ Image insertion and upload
- 🔗 Link insertion
- 🔄 Undo/redo
- ⚡ Markdown bidirectional conversion
- 🎨 Syntax highlighting

**Configuration**:

- `enableMarkdown`: Enable Markdown mode
- `outputFormat`: Output format (html/markdown)
- `placeholder`: Placeholder text

---

### 10. BdInfiniteScroll - Infinite Scroll

**Function**: Infinite content loading

**Use Cases**:

- Paginated data loading
- Social media feed
- Product lists

**Features**:

- Auto-load when scrolling to bottom
- Loading state indicator
- Prevent duplicate requests
- Scroll position preservation

---

### 11. BdInputPassword - Password Input

**Function**: Password input component

**Use Cases**:

- Login forms
- Password settings
- Password modification

**Features**:

- Show/hide password toggle
- Password strength indicator
- Input validation

---

### 12. BdMarkdown - Markdown Renderer

**Function**: Powerful Markdown rendering engine

**Use Cases**:

- Document display
- Blog articles
- README rendering
- Comment systems

**Plugin Features**:

- 📝 **Basic Markdown**: Headings, paragraphs, lists, links, etc.
- 💻 **Code Highlighting**: Syntax highlighting (highlight.js)
- 📊 **Mermaid Charts**:
    - Flowcharts
    - Sequence diagrams
    - State diagrams
    - Class diagrams
    - ER diagrams
    - Gantt charts
    - Pie charts
    - And more
- 🔬 **KaTeX Math**: LaTeX math formula rendering
- 📋 **Code Copy**: One-click copy code blocks
- ⚠️ **GitHub Alerts**:
    - Note
    - Tip
    - Important
    - Warning
    - Caution

**Features**:

- SSR optimization support
- Instance caching mechanism
- Theme adaptation (light/dark)
- Configurable code highlight themes

---

### 13. BdModal - Modal Dialog

**Function**: Dialog/popup component

**Use Cases**:

- Confirmation dialogs
- Form popups
- Detailed information display

**Features**:

- Multiple sizes
- Custom title and content
- Slot support
- Animation transitions

---

### 14. BdModalUse - Composable Modal

**Function**: Modal using Composition API

**Features**:

- Composition API style
- More flexible configuration
- Programmatic control

---

### 15. BdPagination - Pagination

**Function**: Pagination navigation component

**Use Cases**:

- List pagination
- Data paginated display
- Jump to specific page

**Features**:

- Page number display
- Jump input box
- Previous/next navigation
- Total count display

---

### 16. BdPlaceholder - Placeholder

**Function**: Loading/empty state placeholder

**Use Cases**:

- Skeleton screen loading
- Empty state hints
- Loading placeholder

**Features**:

- Multiple preset styles
- Customizable content
- Animation effects

---

### 17. BdScrollArea - Scroll Area

**Function**: Custom scrollbar styling

**Features**:

- Hide default scrollbar
- Custom scroll styles
- Cross-browser compatibility

---

### 18. BdSlider - Slider

**Function**: Numeric range selection

**Use Cases**:

- Volume control
- Numeric range selection
- Filter condition settings

**Features**:

- Single/dual value slider
- Custom scales
- Real-time feedback

---

### 19. BdThemeToggle - Theme Toggle

**Function**: Light/dark theme switching

**Features**:

- One-click theme switch
- Remember user preference
- Icon animation

---

### 20. BdTimePicker - Time Picker

**Function**: Time selection component

**Use Cases**:

- Time settings
- Time range selection
- Form time input

**Features**:

- 12/24 hour format
- Precision to seconds
- Intuitive clock interface

---

### 21. BdUploader - File Upload

**Function**: Complete file upload solution

**Use Cases**:

- Image upload
- File upload
- Batch upload

**Status Management**:

- `INITIAL (0)`: Initial state
- `UPLOADING (1)`: Uploading
- `SUCCESS (2)`: Upload successful
- `FAIL (3)`: Upload failed

**Features**:

- ✅ Single/multiple file upload
- ✅ Drag and drop upload
- ✅ Upload progress display
- ✅ File type validation
- ✅ File size limit
- ✅ Image preview
- ✅ Uploaded file list display
- ✅ Retry failed uploads
- ✅ Remove files
- ✅ Custom upload interface

**Supported File Types**:

- Images: jpg, png, gif, webp, svg
- Documents: doc, docx, pdf, txt
- Spreadsheets: xlsx, csv
- Archives: zip, rar
- Other types

**Feature Details**:

- `single`: Single file mode
- `multiple`: Multiple file mode
- `maxCount`: Maximum file count limit
- `maxSize`: Maximum file size (bytes)
- `accept`: File type restrictions
- `customClass`: Custom style class

---

## 🚀 Usage

### Installation

```json
{
    "dependencies": {
        "@buildingai/ui": "workspace:*"
    }
}
```

### Import Components

```vue
<script setup lang="ts">
import { BdEditor, BdMarkdown, BdCard } from "@buildingai/ui";
</script>

<template>
    <BdEditor v-model="content" />
</template>
```

### Import Styles

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
    css: ["@buildingai/ui/styles/globals.css"],
});
```

### Import Utilities

```typescript
import { formatDate, getFileIcon } from "@buildingai/ui";

const date = formatDate(new Date(), "en-US");
const icon = getFileIcon("document.pdf"); // Returns pdf.png
```

---

## 🛠️ Development Guide

### Project Dependencies

**Core Dependencies**:

- vue: ^3.x
- nuxt ui
- @tiptap/vue-3: Editor core
- echarts: Chart library
- markdown-it: Markdown parser
- katex: Math formulas
- mermaid: Chart rendering

**Development Dependencies**:

- typescript
- eslint
- @storybook/vue3

### Development Commands

```bash
# Type checking
pnpm check-types

# Code formatting
pnpm format
pnpm format:check

# ESLint
pnpm lint
pnpm lint:fix

# Watch mode
pnpm watch
```

### Adding New Components

1. Create component directory in `src/components/`
2. Create `index.vue`, `types.d.ts`, `index.stories.ts`
3. Export in `src/index.ts`
4. Write Storybook documentation

---

## 📝 Tech Stack

- **Vue 3** - Progressive framework
- **TypeScript** - Type system
- **Nuxt UI** - Component base library
- **TipTap** - Rich text editor
- **ECharts** - Chart library
- **Tailwind CSS** - Atomic CSS
- **Storybook** - Component documentation

---

## 📄 License

Copyright © BuildingAI Teams - Private License
