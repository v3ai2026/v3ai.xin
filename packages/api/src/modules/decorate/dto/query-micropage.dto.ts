import {
    TERMINAL_TYPE_VALUES,
    type TerminalType,
} from "@buildingai/constants/shared/terminal.constants";
import { IsIn, IsOptional, IsString } from "class-validator";

/**
 * 微页面查询DTO
 */
export class QueryMicropageDto {
    /**
     * 页面名称（模糊查询）
     */
    @IsOptional()
    @IsString()
    name?: string;

    /**
     * 终端类型 web/mobile
     */
    @IsOptional()
    @IsString()
    @IsIn(TERMINAL_TYPE_VALUES, { message: "终端类型只能是 web 或 mobile" })
    terminal?: TerminalType;
}
