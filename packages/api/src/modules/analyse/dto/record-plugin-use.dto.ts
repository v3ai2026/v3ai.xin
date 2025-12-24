import { IsNotEmpty, IsOptional, IsString } from "class-validator";

/**
 * 记录插件使用DTO
 */
export class RecordPluginUseDto {
    /**
     * 插件名称
     */
    @IsString({ message: "插件名称必须是字符串" })
    @IsNotEmpty({ message: "插件名称不能为空" })
    extensionName: string;

    /**
     * 额外信息（可选）
     */
    @IsOptional()
    extraData?: Record<string, any>;
}
