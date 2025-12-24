import {
    Merchant,
    type MerchantType,
    PayVersion,
    type PayVersionType,
} from "@buildingai/constants/shared/payconfig.constant";
import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { IsIn } from "class-validator";

/**
 * 更新支付配置数据传输对象
 * 用于验证和传输更新支付配置时的数据
 */
export class UpdatePayconfigDto {
    /**
     * 支付配置ID
     * 必填字段，用于标识要更新的支付配置
     */
    @IsNotEmpty()
    @IsString()
    id: string;

    /**
     * 支付配置名称
     * 必填字段，支付方式的显示名称
     */
    @IsNotEmpty()
    @IsString()
    name: string;

    /**
     * 支付配置Logo
     * 必填字段，支付方式的图标URL或路径
     */
    @IsNotEmpty()
    @IsString()
    logo: string;

    /**
     * 启用状态
     * 必填字段，0表示禁用，1表示启用
     */
    @IsNotEmpty()
    @IsInt({ message: "状态必须是整数" })
    @IsIn([0, 1], { message: "状态只能是0(禁用)或1(启用)" })
    isEnable: number;

    /**
     * 默认支付方式
     * 必填字段，0表示非默认，1表示默认支付方式
     */
    @IsNotEmpty()
    @IsInt({ message: "默认必须是整数" })
    @IsIn([0, 1], { message: "默认只能是0或1" })
    isDefault: number;

    /**
     * 排序权重
     * 必填字段，用于控制支付方式的显示顺序
     * 数值越小排序越靠前
     */
    @IsNotEmpty()
    @IsInt({ message: "排序必须是整数" })
    sort: number;

    /**
     * 支付版本
     * 必填字段，支持V2和V3版本
     * V2: 旧版本支付接口
     * V3: 新版本支付接口
     */
    @IsNotEmpty()
    @IsString()
    @IsIn([PayVersion.V2, PayVersion.V3], {
        message: "支付版本参数错误",
    })
    payVersion: PayVersionType;

    /**
     * 商户类型
     * 必填字段，标识商户类型
     * ordinary: 普通商户
     * child: 子商户
     */
    @IsNotEmpty()
    @IsString()
    @IsIn([Merchant.ORDINARY, Merchant.CHILD], {
        message: "商户类型参数错误",
    })
    merchantType: MerchantType;

    /**
     * 商户号
     */
    @IsNotEmpty()
    @IsString()
    mchId: string;

    /**
     * 商户api密钥
     */
    @IsNotEmpty()
    @IsString()
    apiKey: string;

    /**
     * 微信支付密钥
     */
    @IsNotEmpty()
    @IsString()
    paySignKey: string;

    /**
     * 微信支付证书
     */
    @IsNotEmpty()
    @IsString()
    cert: string;

    /**
     * appid
     */
    @IsNotEmpty()
    @IsString()
    appId: string;
}
