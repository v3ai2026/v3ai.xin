import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

/**
 * 批量删除微页面DTO
 */
export class BatchDeleteMicropageDto {
    /**
     * 微页面ID数组
     */
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("all", { each: true })
    ids: string[];
}
