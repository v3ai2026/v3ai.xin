/**
 * 支付配置实体
 */
import {
    Merchant,
    type MerchantType,
    PayConfigPayType,
    type PayConfigType,
    PayVersion,
    type PayVersionType,
} from "@buildingai/constants/shared/payconfig.constant";
/**
 * 支付配置实体
 */
import {
    BooleanNumber,
    type BooleanNumberType,
} from "@buildingai/constants/shared/status-codes.constant";

import { Column } from "../typeorm";
import { AppEntity } from "./../decorators/app-entity.decorator";
import { BaseEntity } from "./base";

@AppEntity({ name: "payconfig", comment: "支付配置" })
export class Payconfig extends BaseEntity {
    /**
     * 支付配置图标
     */
    @Column()
    logo: string;

    /**
     * 是否启用
     */
    @Column({
        type: "enum",
        enum: BooleanNumber,
        comment: "是否启用",
    })
    isEnable: BooleanNumberType;

    /**
     * 是否默认
     */
    @Column({
        type: "enum",
        enum: BooleanNumber,
        comment: "是否默认",
    })
    isDefault: BooleanNumberType;

    /**
     * 支付配置名称
     */
    @Column()
    name: string;

    /**
     * 支付方式
     */
    @Column({
        type: "enum",
        enum: PayConfigPayType,
        comment: "支付方式",
    })
    payType: PayConfigType;

    /**
     * 排序
     */
    @Column({ default: 0 })
    sort: number;

    /**
     * 支付版本
     */
    @Column({
        type: "enum",
        enum: PayVersion,
        comment: "支付版本",
    })
    payVersion: PayVersionType;

    /**
     * 商户类型
     */
    @Column({
        type: "enum",
        enum: Merchant,
        comment: "商户类型",
    })
    merchantType: MerchantType;

    /**
     * 商户号
     */
    @Column({ nullable: true })
    mchId: string;

    /**
     * 商户api密钥
     */
    @Column({ nullable: true })
    apiKey: string;

    /**
     * 微信支付密钥
     */
    @Column({ nullable: true })
    paySignKey: string;

    /**
     * 微信支付证书
     */
    @Column({ nullable: true })
    cert: string;

    /**
     * 支付授权目录
     */
    @Column({ nullable: true })
    payAuthDir: string;

    /**
     * appid
     */
    @Column({ nullable: true })
    appId: string;
}
