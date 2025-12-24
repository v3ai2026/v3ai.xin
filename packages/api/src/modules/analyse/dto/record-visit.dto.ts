import { IsNotEmpty, IsOptional, IsString } from "class-validator";

/**
 * 记录页面访问DTO
 */
export class RecordVisitDto {
    /**
     * 访问来源（页面路径）
     */
    @IsString({ message: "访问来源必须是字符串" })
    @IsNotEmpty({ message: "访问来源不能为空" })
    source: string;

    /**
     * 额外信息（可选）
     */
    @IsOptional()
    extraData?: Record<string, any>;
}
