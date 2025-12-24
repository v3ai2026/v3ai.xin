/**
 * 解析包名
 * 提取 @server/xxx、@web/xxx、@mobile/xxx 的格式，提取后面的 xxx
 * @param name 包名
 * @returns 提取后的包名
 */
export const parsePackageName = (name: string): string => {
    const prefixs = ["@api/", "@api-dev/", "@web/", "@web-dev/", "@mobile/", "@mobile-dev/"];
    if (!prefixs.some((prefix) => name.startsWith(prefix))) {
        return name;
    }

    const regex = /^@(api|api-dev|web|web-dev|mobile|mobile-dev)\/(.+)$/;
    const match = name.match(regex);
    return match?.[2] ?? name;
};
