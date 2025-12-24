import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

/**
 * 批量删除菜单DTO
 */
export class BatchDeleteMenuDto {
    /**
     * 菜单ID数组
     */
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("all", { each: true })
    ids: string[];
}
