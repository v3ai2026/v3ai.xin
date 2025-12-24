import { IsOptional, IsString, IsUrl } from "class-validator";

/**
 * 远程文件上传DTO
 */
export class RemoteUploadDto {
    /**
     * 远程文件URL
     */
    @IsUrl({}, { message: "请输入有效的URL" })
    url: string;

    /**
     * 文件描述
     */
    @IsOptional()
    @IsString()
    description?: string;

    /**
     * 文件扩展名ID
     */
    @IsOptional()
    @IsString({ message: "拓展ID必须是字符串" })
    extensionId?: string;
}
