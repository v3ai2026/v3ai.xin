import colors from "tailwindcss/colors";

/** 颜色名称类型 */
export type ColorName =
    | "red"
    | "orange"
    | "yellow"
    | "lime"
    | "green"
    | "teal"
    | "cyan"
    | "blue"
    | "indigo"
    | "violet"
    | "purple"
    | "fuchsia"
    | "pink"
    | "black";

/** 中性颜色名称类型 */
export type NeutralColorName = "slate" | "gray" | "zinc" | "neutral" | "stone";

/** 可用的颜色列表 */
export const colorList: ColorName[] = [
    "red",
    "orange",
    "yellow",
    "lime",
    "green",
    "teal",
    "cyan",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "black",
];

/** 可用的中性颜色列表 */
export const neutralColorList: NeutralColorName[] = ["slate", "gray", "zinc", "neutral", "stone"];

/** 颜色中文名称映射 */
export const colorListMap: Record<ColorName, string> = {
    red: "common.theme.red",
    orange: "common.theme.orange",
    yellow: "common.theme.yellow",
    lime: "common.theme.lime",
    green: "common.theme.green",
    teal: "common.theme.teal",
    cyan: "common.theme.cyan",
    blue: "common.theme.blue",
    indigo: "common.theme.indigo",
    violet: "common.theme.violet",
    purple: "common.theme.purple",
    fuchsia: "common.theme.fuchsia",
    pink: "common.theme.pink",
    black: "common.theme.black",
};

/** 中性颜色中文名称映射 */
export const neutralColorMap: Record<NeutralColorName, string> = {
    slate: "common.theme.slate",
    gray: "common.theme.gray",
    zinc: "common.theme.zinc",
    neutral: "common.theme.neutral",
    stone: "common.theme.stone",
};

/** 可用的色调数组 */
export const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

/**
 * 从tailwind颜色中获取指定颜色和色调的值
 * @param color 颜色名称
 * @param shade 色调值
 * @returns 颜色值
 */
export function getColor(color: keyof typeof colors, shade: (typeof shades)[number]): string {
    return (colors[color] as Record<number, string> | undefined)?.[shade] ?? "#181818";
}
