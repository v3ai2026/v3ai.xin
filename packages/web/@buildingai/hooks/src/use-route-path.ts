/**
 * 根据权限码获取已注册路由，并支持动态参数替换与查询参数拼接。
 *
 * 典型用法：
 * - 仅获取路径（可能包含 :id）
 *   const path = useRoutePath('ai-datasets-documents:list')
 * - 传入参数完成占位符替换
 *   const path = useRoutePath('ai-datasets-documents:list', { id: datasetId })
 * - 同时附加查询参数
 *   const path = useRoutePath('ai-datasets-documents:list', { id }, { tab: 'doc', q: 'xxx' })
 */
export type RouteParams = Record<string, string | number>;
export type Primitive = string | number | boolean;
export type RouteQuery = Record<string, Primitive | Primitive[]>;

/**
 * 根据权限码优雅地构建已注册路由的完整路径。
 * - 自动匹配由动态菜单注册的路由（meta.permissionCode）
 * - 安全替换动态段（:id 等），未提供的占位符将保留原样
 * - 自动 URL 编码并拼接查询参数
 *
 * 用法示例：
 * const path = useRoutePath('ai-datasets-documents:list', { id: datasetId }, { tab: 'doc' })
 */
export const useRoutePath = (
    permissionCode: string,
    params?: RouteParams,
    query?: RouteQuery,
): string => {
    const router = useRouter();

    const matched = router
        .getRoutes()
        .find((route) => (route.meta as any)?.permissionCode === permissionCode);

    if (!matched) return "";

    // 构建路径：替换 :param 占位符并进行编码
    const compiledPath = compilePath(matched.path || "", params);

    // 拼接查询字符串
    const fullPath = appendQuery(compiledPath, query);
    return fullPath;
};

/** 构建路径：将 path 中的 :param 占位符替换为 params 对应值（自动编码） */
function compilePath(template: string, params?: RouteParams): string {
    if (!params) return template;
    return template.replace(/:([A-Za-z0-9_]+)/g, (placeholder, key: string) => {
        const value = params[key];
        if (value === undefined || value === null) return placeholder;
        return encodeURIComponent(String(value));
    });
}

/** 将 query 参数优雅地拼接到 path 后面（自动编码，支持数组） */
function appendQuery(path: string, query?: RouteQuery): string {
    if (!query || !Object.keys(query).length) return path;
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (Array.isArray(value)) {
            for (const v of value) searchParams.append(key, String(v));
        } else if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    }
    const qs = searchParams.toString();
    return qs ? `${path}${path.includes("?") ? "&" : "?"}${qs}` : path;
}
