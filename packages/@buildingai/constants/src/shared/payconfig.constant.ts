export const PayConfigPayType = {
    WECHAT: 1, //微信支付
    ALIPAY: 2, //支付宝支付
} as const;
export type PayConfigType = (typeof PayConfigPayType)[keyof typeof PayConfigPayType];
export type PayConfigTypeKey = keyof typeof PayConfigPayType;

/**
 * 商户类型
 */
export const Merchant = {
    ORDINARY: "ordinary",
    CHILD: "child",
} as const;
export type MerchantType = (typeof Merchant)[keyof typeof Merchant];
export type MerchantTypeKey = keyof typeof Merchant;

/**
 * 支付版本
 */
export const PayVersion = {
    V2: "V2",
    V3: "V3",
} as const;
export type PayVersionType = (typeof PayVersion)[keyof typeof PayVersion];
export type PayVersionTypeKey = keyof typeof PayVersion;
