import { UserTerminal, type UserTerminalType } from "@buildingai/constants";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

/**
 * 管理员登录DTO
 */
export class LoginDto {
    /**
     * 用户名
     */
    @IsNotEmpty({ message: "用户名不能为空" })
    @IsString({ message: "用户名必须是字符串" })
    username: string;

    /**
     * 密码
     */
    @IsNotEmpty({ message: "密码不能为空" })
    @IsString({ message: "密码必须是字符串" })
    password: string;

    /**
     * 用户终端类型
     */
    @IsNotEmpty({ message: "用户终端类型不能为空" })
    @Type(() => Number) // 自动把字符串转换为数字
    @IsNumber({}, { message: "用户终端类型必须是数字" })
    @IsEnum(UserTerminal, {
        message: ({ value }) =>
            `用户终端类型不合法：收到 "${value}"，应为 ${Object.values(UserTerminal).join(", ")}`,
    })
    terminal: UserTerminalType;
}
