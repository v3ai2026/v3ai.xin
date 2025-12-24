import { IsOptional, IsString } from "class-validator";

/**
 * 文件上传DTO
 *
 * 用于文件上传接口的参数验证
 */
export class UploadFileDto {
    /**
     * 文件描述
     */
    @IsOptional()
    @IsString({ message: "文件描述必须是字符串" })
    description?: string;

    /**
     * 文件扩展名ID
     */
    @IsOptional()
    @IsString({ message: "拓展ID必须是字符串" })
    extensionId?: string;
}
