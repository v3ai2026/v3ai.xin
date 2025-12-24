/**
 * Menu Helper Utilities (Main App Only)
 * @description Route building utilities for main app
 *
 * For menu building functions (buildSidebarItems, buildTopNavItems, etc.),
 * import from: @buildingai/layouts/utils/menu-helper
 */

import { MENU_TYPE, ROUTES } from "@buildingai/constants/web";
import type { MenuFormData } from "@buildingai/service/consoleapi/menu";
import type { Component } from "vue";
import type { Composer } from "vue-i18n";
import type { RouteRecordRaw } from "vue-router";

// -------------------- Main App Specific Functions --------------------

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

/**
 * Load component from loader
 */
function loadComponent(
    component: string,
    loader: Record<string, Component>,
): Component | undefined {
    try {
        const key = Object.keys(loader).find((k) => k.includes(`${component}.vue`));

        if (!key) {
            throw new Error(`未找到组件：${component}`);
        }
        return loader[key];
    } catch (error) {
        console.error(`组件加载失败 ${component}:`, error);
        return () => Promise.resolve({ render: () => null });
    }
}

/**
 * Process nested route structure
 */
function processNestedStructure(
    routes: RouteRecordRaw[],
    componentLoader: Record<string, Component>,
    _t: (key: string) => string,
): RouteRecordRaw[] {
    const NESTED_MATCH_RE = /^\/console\/([^/]+)\/(::?[^/]+)\/(.+)$/;

    const groupedByLayout = new Map<string, RouteRecordRaw[]>();
    const flatRoutes: RouteRecordRaw[] = [];

    for (const route of routes) {
        const path = route.path as string;
        const match = path.match(NESTED_MATCH_RE);

        if (!match) {
            flatRoutes.push(route);
            continue;
        }

        const moduleName = match[1] || "";
        let idParam = match[2] || "";
        const subpageRaw = match[3] || "";

        if (!idParam.startsWith(":")) idParam = ":" + idParam.replace(/^:+/, "");
        else idParam = ":" + idParam.replace(/^:+/, "");

        const subpage = subpageRaw.replace(/^\/+/, "");

        const layoutPath = `/console/${moduleName}/${idParam}`;
        const group = groupedByLayout.get(layoutPath) || [];

        group.push({
            ...route,
            path: subpage,
        });

        groupedByLayout.set(layoutPath, group);
    }

    if (groupedByLayout.size === 0) return routes;

    const nestedRoutes: RouteRecordRaw[] = [];

    for (const [layoutPath, children] of groupedByLayout.entries()) {
        const moduleName = (layoutPath.match(/^\/console\/([^/]+)\//)?.[1] || "").trim();
        const layoutComponent = moduleName
            ? loadComponent(`${moduleName}/[id]`, componentLoader)
            : undefined;

        if (layoutComponent) {
            nestedRoutes.push({
                name: `layout-${moduleName}-detail`,
                path: layoutPath,
                component: layoutComponent,
                meta: {
                    layout: "console",
                },
                children: children,
            });
        } else {
            for (const child of children) {
                nestedRoutes.push({
                    ...child,
                    path: `${layoutPath}/${(child.path as string).replace(/^\/+/, "")}`,
                });
            }
        }
    }

    return flatRoutes.concat(nestedRoutes);
}

/**
 * Build routes from menu data
 * @param menus Menu data array
 * @param isRoot Whether current user is root admin
 * @param componentLoader Component loader map
 * @returns Built route records
 */
export function buildRoutes(
    menus: MenuFormData[],
    isRoot = false,
    componentLoader: Record<string, Component>,
): RouteRecordRaw[] {
    const { $i18n } = useNuxtApp();
    const { t } = $i18n as Composer;

    const allRoutes = walkFlat(menus, (menu, path) => {
        const allowed =
            isRoot ||
            !menu.permissionCode ||
            usePermissionStore().hasPermission(menu.permissionCode);

        if (menu.type === MENU_TYPE.MENU && menu.component && allowed) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const layout = (useNuxtApp() as any).$getConsoleLayout(menu.component);

            const normalizedPath = path.replace(/\/+/g, "/");

            const component = loadComponent(menu.component, componentLoader);
            if (!component) {
                return [];
            }

            return {
                name: `menu-${menu.id}`,
                path: normalizedPath,
                component,
                meta: {
                    title: t(menu.name),
                    permissionCode: menu.permissionCode,
                    layout,
                },
            } as RouteRecordRaw;
        }

        return [];
    });

    return processNestedStructure(allRoutes, componentLoader, t);
}
