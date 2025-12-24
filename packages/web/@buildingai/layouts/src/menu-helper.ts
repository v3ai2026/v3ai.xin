/**
 * Menu Helper Utilities
 * @description Helper functions for building console navigation menus
 */

import { MENU_TYPE, ROUTES } from "@buildingai/constants/web";
import type { MenuFormData } from "@buildingai/service/consoleapi/menu";
// Import permission store (available in all apps using this package)
import { usePermissionStore } from "@buildingai/stores/permission";
import type { Composer } from "vue-i18n";

/**
 * Breadcrumb item interface
 */
export interface BreadcrumbItem {
    label: string;
    to?: string;
    active?: boolean;
}

/**
 * Navigation menu item interface
 */
export interface NavigationMenuItem {
    label: string;
    icon?: string;
    to?: string;
    active?: boolean;
    defaultOpen?: boolean;
    children?: NavigationMenuItem[];
}

/**
 * Search menu item interface
 */
export interface SearchMenuItem {
    id: string;
    name: string;
    icon: string;
    iconClass: string;
    type: string;
    path: string;
    parentName: string;
}

/**
 * Transformed menu item with match path
 */
export interface TransformedMenuItem extends NavigationMenuItem {
    matchPath: string;
    children?: TransformedMenuItem[];
}

interface TransformOptions {
    directoryToEmpty?: boolean;
    currentPath?: string;
}

// -------------------- 基础工具 --------------------

/**
 * Normalize path by combining parent and child
 */
function normalizePath(parent: string, child?: string): string {
    return parent + (child?.startsWith("/") ? child : `/${child || ""}`);
}

/**
 * Filter visible menus
 */
function filterVisibleMenus(menus: MenuFormData[], visible: boolean): MenuFormData[] {
    return menus
        .filter((m) => m.type !== MENU_TYPE.BUTTON && (visible || !m.isHidden))
        .sort((a, b) => (a.sort || 0) - (b.sort || 0));
}

/**
 * Get match path for menu item
 */
function getMatchPath(menu: MenuFormData, parentPath = ""): string {
    const currentPath = menu.path ? `/${menu.path}` : "";
    const basePath = `${parentPath}${currentPath}`;
    return `${ROUTES.CONSOLE}${basePath}`.replace(/\/+/g, "/").replace(/\/$/, "");
}

/**
 * Get navigation path for menu item
 */
function getToPath(menu: MenuFormData, parentPath = ""): string {
    const currentPath = normalizePath(parentPath, menu.path);

    if (menu.type === MENU_TYPE.MENU && !menu.isHidden && menu.component) {
        return `${ROUTES.CONSOLE}${currentPath}`.replace(/\/+/g, "/");
    }

    if (menu.children?.length) {
        const validChild = menu.children.find(
            (child) => !child.isHidden && (child.component || child.children?.length),
        );
        if (validChild) {
            return getToPath(validChild, currentPath);
        }
    }
    return `${ROUTES.CONSOLE}${currentPath}`.replace(/\/+/g, "/");
}

/**
 * Transform menus to navigation items
 */
export function transformMenus(
    menus: MenuFormData[],
    parentPath = "",
    options: TransformOptions = {},
): TransformedMenuItem[] {
    const { $i18n } = useNuxtApp();
    const { t } = $i18n as Composer;

    let result: TransformedMenuItem[] = [];

    filterVisibleMenus(menus, false).forEach((menu) => {
        const matchPath = getMatchPath(menu, parentPath);
        const fullPath = normalizePath(parentPath, menu.path);
        const to =
            (options.directoryToEmpty && menu.type === MENU_TYPE.DIRECTORY) ||
            menu.type === MENU_TYPE.GROUP
                ? undefined
                : getToPath(menu, parentPath);

        const children = menu.children?.length
            ? transformMenus(menu.children, fullPath, options)
            : [];

        const isCurrentPathMatch = options.currentPath
            ? options.currentPath.startsWith(matchPath)
            : false;
        const hasExpandedChildren = children.some((child) => child.defaultOpen || child.active);
        const defaultOpen = isCurrentPathMatch || hasExpandedChildren;

        // Handle GROUP type menus
        if (menu.type === MENU_TYPE.GROUP) {
            // 1. Add label item
            result.push({
                label: t(menu.name) || menu.name,
                type: "label",
                matchPath,
                children: [],
            } as TransformedMenuItem);

            // 2. Add children at same level
            if (menu.children?.length) {
                result = result.concat(children);
            }
        } else {
            // Handle other menu types
            result.push({
                label: t(menu.name) || menu.name,
                icon: menu.icon || "",
                to,
                matchPath,
                active: !!to && isCurrentPathMatch,
                defaultOpen,
                children,
            });
        }
    });

    return result;
}

/**
 * Build top navigation items for mixture layout
 */
export function buildTopNavItems(): TransformedMenuItem[] {
    const menus = usePermissionStore().menus;
    return transformMenus(menus, "", { directoryToEmpty: false });
}

/**
 * Build sidebar navigation items
 */
export function buildSidebarItems(path: string): TransformedMenuItem[] {
    const menus = usePermissionStore().menus;
    return transformMenus(menus, "", { directoryToEmpty: true, currentPath: path });
}

/**
 * Build search menu items
 */
export function buildSearchItems(): SearchMenuItem[] {
    return walkFlat(usePermissionStore().menus, (menu, path, parent) => {
        if (menu.type === MENU_TYPE.MENU) {
            return {
                id: String(menu.id),
                name: menu.name,
                icon: menu.icon || "i-heroicons-squares-2x2-20-solid",
                iconClass: "bg-blue-100",
                type: "menu",
                path,
                parentName: parent,
            };
        }
        return [];
    });
}

/**
 * Build breadcrumbs navigation
 */
export function buildBreadcrumbs(
    currentPath = useRoute().path,
    homePath = "/",
    homeLabel = "后台管理",
): BreadcrumbItem[] {
    if (!currentPath || currentPath === homePath) {
        return [{ label: homeLabel, to: homePath, active: true }];
    }

    const { $i18n } = useNuxtApp();
    const { t } = $i18n as Composer;

    const trail: { name: string; path: string }[] = [];

    walkFlat(usePermissionStore().menus, (menu, path) => {
        if (currentPath === path || currentPath.startsWith(path + "/")) {
            if (menu.type === 1) {
                trail.push({ name: menu.name, path: "" });
                return;
            }
            trail.push({ name: menu.name, path });
        }
        return [];
    });

    trail.sort((a, b) => a.path.length - b.path.length);

    return [
        { label: homeLabel, to: homePath },
        ...trail.map((item, i, arr) => ({
            label: t(item.name),
            to: item.path,
            active: i === arr.length - 1,
        })),
    ];
}

// -------------------- Helper Functions --------------------

/**
 * Walk through menus and flatten
 */
function walkFlat<T>(
    menus: MenuFormData[],
    visitor: (menu: MenuFormData, path: string, parent: string) => T | T[],
    parent: string = ROUTES.CONSOLE,
): T[] {
    return filterVisibleMenus(menus, true).flatMap((menu) => {
        let path = normalizePath(parent, menu.path);
        path = path.replace(/\/+/g, "/");

        const result = visitor(menu, path, parent);
        const children = menu.children?.length ? walkFlat(menu.children, visitor, path) : [];
        return ([] as T[]).concat(result, children);
    });
}
