import { LOGIN_TYPE, type LoginType } from "@buildingai/constants";
import { IsArray, IsBoolean, IsEnum, IsOptional } from "class-validator";

/**
 * 登录设置配置接口
 */
export interface LoginSettingsConfig {
    /** 允许的登录方式列表 */
    allowedLoginMethods: LoginType[];
    /** 允许的注册方式列表 */
    allowedRegisterMethods: LoginType[];
    /** 默认登录方式 */
    defaultLoginMethod: LoginType;
    /** 是否允许多处登录 */
    allowMultipleLogin: boolean;
    /** 是否显示政策协议勾选栏 */
    showPolicyAgreement: boolean;
}

/**
 * 更新登录设置DTO
 */
export class UpdateLoginSettingsDto {
    /**
     * 允许的登录方式列表
     * @description 用户可以使用的登录方式
     */
    @IsOptional()
    @IsArray()
    @IsEnum(LOGIN_TYPE, { each: true, message: "登录方式必须是有效的类型" })
    allowedLoginMethods?: LoginType[];

    /**
     * 允许的注册方式列表
     * @description 用户可以使用的注册方式
     */
    @IsOptional()
    @IsArray()
    @IsEnum(LOGIN_TYPE, { each: true, message: "注册方式必须是有效的类型" })
    allowedRegisterMethods?: LoginType[];

    /**
     * 默认登录方式
     * @description 登录页面默认选中的登录方式
     */
    @IsOptional()
    @IsEnum(LOGIN_TYPE, { message: "默认登录方式必须是有效的类型" })
    defaultLoginMethod?: LoginType;

    /**
     * 是否允许多处登录
     * @description 控制用户是否可以在多个设备/浏览器同时登录
     */
    @IsOptional()
    @IsBoolean({ message: "多处登录设置必须是布尔值" })
    allowMultipleLogin?: boolean;

    /**
     * 是否显示政策协议勾选栏
     * @description 控制登录/注册页面是否显示用户协议和隐私政策勾选框
     */
    @IsOptional()
    @IsBoolean({ message: "政策协议显示设置必须是布尔值" })
    showPolicyAgreement?: boolean;
}
