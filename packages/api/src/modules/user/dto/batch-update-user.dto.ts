import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsOptional, IsUUID, ValidateNested } from "class-validator";

import { UpdateUserDto } from "./update-user.dto";

/**
 * 批量更新用户项DTO
 */
export class BatchUpdateUserItemDto extends UpdateUserDto {
    /**
     * 用户ID
     */
    @IsUUID(4, { message: "用户ID必须是有效的UUID格式" })
    id: string;
}

/**
 * 批量更新用户DTO
 */
export class BatchUpdateUserDto {
    /**
     * 用户列表
     *
     * 每个元素包含用户ID和需要更新的字段
     */
    @IsArray({ message: "用户列表必须是数组" })
    @ArrayMinSize(1, { message: "用户列表至少需要包含一个用户" })
    @ValidateNested({ each: true })
    @Type(() => BatchUpdateUserItemDto)
    users: BatchUpdateUserItemDto[];

    /**
     * 是否跳过错误继续执行
     *
     * 如果为true，则在处理某个用户出错时会继续处理其他用户
     * 如果为false，则在处理某个用户出错时会立即终止并返回错误
     */
    @IsOptional()
    skipErrors?: boolean = false;
}
