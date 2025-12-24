# @buildingai/layouts

BuildingAI Layout Components Module - Reusable Frontend and Backend Layout Components

## 📄 Module Overview

`@buildingai/layouts` is the layout components module in the BuildingAI project, providing frontend
and backend layout components. It supports multiple frontend layout styles and backend console
layouts with responsive design, full-screen mode, and more.

### Core Responsibilities

1. **Frontend Layout**: Provides multiple website frontend layout styles (style1-5)
2. **Backend Layout**: Provides backend console layouts (sidebar/mixed mode)
3. **Responsive Design**: Supports mobile, tablet, and desktop
4. **Full-Screen Mode**: Supports full-screen layout
5. **Reusable Components**: Provides common layout components and utilities

---

## 📁 Directory Structure

```
src/
├── console/             # Backend Console Layout
│   ├── components/     # Common components
│   │   ├── button-full-screen.vue    # Full-screen button
│   │   ├── button-go-home.vue        # Go home button
│   │   ├── button-reload.vue         # Reload button
│   │   ├── button-search-input.vue  # Search input
│   │   ├── main-page.vue            # Main page
│   │   ├── search-modal.vue         # Search modal
│   │   ├── site-logo.vue           # Site Logo
│   │   └── user-menu.vue           # User menu
│   ├── mixture/        # Mixed mode layout
│   │   ├── header.vue  # Header
│   │   ├── sidebar.vue # Sidebar
│   │   └── index.vue   # Main layout
│   ├── plugins/        # Plugin components
│   │   ├── index.vue   # Plugin main component
│   │   ├── menu.ts     # Menu configuration
│   │   └── sidebar.vue # Plugin sidebar
│   ├── sidebar/        # Sidebar layout
│   │   ├── sidebar.vue # Sidebar main component
│   │   ├── sidebar-navbar.vue # Sidebar navigation
│   │   ├── sidebar-trigger.vue # Sidebar trigger
│   │   └── index.vue   # Sidebar layout
│   └── index.ts        # Module export
├── web/                # Frontend User Layout
│   ├── components/     # Common components
│   │   ├── mobile-menu-button.vue # Mobile menu button
│   │   ├── mobile-navigation.vue  # Mobile navigation
│   │   ├── smart-link.vue         # Smart link
│   │   ├── user-profile.vue       # User profile
│   │   └── web-site-logo.vue      # Website Logo
│   ├── hooks/          # Composables
│   │   └── use-navigation-menu.ts # Navigation menu
│   ├── styles/         # Layout styles
│   │   ├── style1.vue  # Layout style 1
│   │   ├── style2.vue  # Layout style 2
│   │   ├── style3.vue  # Layout style 3
│   │   ├── style4.vue  # Layout style 4
│   │   └── style5.vue  # Layout style 5
│   └── index.ts        # Module export
└── menu-helper.ts      # Menu helper utility
```

---

## 🧩 Layout Types

### Frontend Layout (web)

Provides 5 preset layout styles with customization support:

- **style1**: Classic layout
- **style2**: Modern layout
- **style3**: Minimal layout
- **style4**: Business layout
- **style5**: Innovative layout

### Backend Layout (console)

Provides two backend layout modes:

- **Sidebar Mode**: Traditional sidebar navigation layout
- **Mixed Mode**: Mixed layout combining header and sidebar

---

Copyright © BuildingAI Teams - Private License
