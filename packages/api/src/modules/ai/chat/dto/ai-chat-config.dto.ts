import { Type } from "class-transformer";
import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";

/**
 * 聊天建议选项DTO
 */
class SuggestionDto {
    @IsNotEmpty({ message: "建议图标不能为空" })
    @IsString({ message: "建议图标必须是字符串" })
    icon: string;

    @IsNotEmpty({ message: "建议文本不能为空" })
    @IsString({ message: "建议文本必须是字符串" })
    text: string;
}

/**
 * 欢迎信息DTO
 */
class WelcomeInfoDto {
    @IsOptional()
    @IsString({ message: "欢迎标题必须是字符串" })
    title: string;

    @IsOptional()
    @IsString({ message: "欢迎描述必须是字符串" })
    description: string;

    @IsOptional()
    @IsString({ message: "页脚信息必须是字符串" })
    footer?: string;
}

/**
 * 更新对话配置DTO
 */
export class UpdateChatConfigDto {
    /**
     * 聊天建议选项
     */
    @IsOptional()
    @IsArray({ message: "建议选项必须是数组格式" })
    @ValidateNested({ each: true })
    @Type(() => SuggestionDto)
    suggestions?: SuggestionDto[];

    /**
     * 是否启用建议选项
     */
    @IsOptional()
    @IsBoolean({ message: "建议选项启用状态必须是布尔值" })
    suggestionsEnabled?: boolean;

    /**
     * 附件大小限制
     */
    @IsOptional()
    @IsNumber({}, { message: "附件大小限制必须是数字" })
    attachmentSizeLimit?: number;

    /**
     * 欢迎信息
     */
    @IsOptional()
    @IsObject({ message: "欢迎信息必须是对象格式" })
    @ValidateNested()
    @Type(() => WelcomeInfoDto)
    welcomeInfo?: WelcomeInfoDto;
}
