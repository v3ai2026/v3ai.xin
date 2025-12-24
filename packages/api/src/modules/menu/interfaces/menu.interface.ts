export interface initJsonMenu {
    name: string;
    path: string;
    icon: string;
    component: string;
    permissionCode: string | null;
    sort: number;
    isHidden: 0 | 1;
    type: number; // 例如：1 = 分类菜单，2 = 页面菜单
    sourceType: number; // 例如：1 = 系统菜单，2 = 插件菜单
    code?: string; // 仅部分菜单项拥有唯一标识 code
    children?: initJsonMenu[]; // 嵌套子菜单
}

export interface installJsonConfig {
    menus: initJsonMenu[];
}
