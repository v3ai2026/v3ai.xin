import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

/**
 * 批量删除用户DTO
 *
 */
export class BatchDeleteUserDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("all", { each: true })
    ids: string[];
}

/**
 * 删除用户DTO
 *
 */
export class DeleteUserDto {
    @IsUUID()
    id: string;
}
