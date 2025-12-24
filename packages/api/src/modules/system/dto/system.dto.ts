import { RegisterDto } from "@common/modules/auth/dto/register.dto";
import { OmitType } from "@nestjs/mapped-types";
import { IsOptional, IsString } from "class-validator";

export class initializeDto extends OmitType(RegisterDto, ["terminal"]) {
    /**
     * 用户头像
     */
    @IsOptional()
    @IsString({ message: "头像必须是字符串" })
    avatar?: string;

    /**
     * 网站名称
     */
    @IsOptional()
    @IsString({ message: "网站名称必须是字符串" })
    websiteName?: string;

    /**
     * 网站描述
     */
    @IsOptional()
    @IsString({ message: "网站描述必须是字符串" })
    websiteDescription?: string;

    /**
     * 网站Logo
     */
    @IsOptional()
    @IsString({ message: "网站Logo必须是字符串" })
    websiteLogo?: string;

    /**
     * 网站图标
     */
    @IsOptional()
    @IsString({ message: "网站图标必须是字符串" })
    websiteIcon?: string;
}
