import { IsArray, IsString } from "class-validator";

export class LayoutConfigDto {
    @IsString({ message: "布局ID必须是字符串" })
    layout: string;

    @IsArray({ message: "菜单数据必须是数组" })
    menus: any[];
}
