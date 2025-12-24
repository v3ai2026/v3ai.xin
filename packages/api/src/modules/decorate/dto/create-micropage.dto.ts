import {
    TERMINAL_TYPE_VALUES,
    type TerminalType,
} from "@buildingai/constants/shared/terminal.constants";
import { IsArray, IsIn, IsObject, IsOptional, IsString, Length } from "class-validator";

/**
 * 创建微页面DTO
 */
export class CreateMicropageDto {
    @IsString({ message: "名称必须是字符串" })
    @Length(1, 32, { message: "页面名称长度必须在1-32个字符之间" })
    name?: string;

    /**
     * 终端类型 web/mobile
     */
    @IsOptional()
    @IsString({ message: "终端类型必须是字符串" })
    @IsIn(TERMINAL_TYPE_VALUES, { message: "终端类型只能是 web 或 mobile" })
    terminal?: TerminalType;

    @IsArray({ message: "数据必须是数组格式" })
    content: any[];

    @IsObject({ message: "页面配置必须是对象格式" })
    configs: any;
}
