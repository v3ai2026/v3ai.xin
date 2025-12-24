export interface WechatPayConfig {
    appId: string;
    mchId: string;
    publicKey: string;
    privateKey: string;
    apiSecret: string;
    domain: string;
}
export interface WechatPayNativeOrderParams {
    description: string;
    out_trade_no: string;
    amount: {
        total: number;
        currency?: string; // 可选，默认是CNY
    };
    attach: string;
}
export interface WechatPayNotifyParams {
    timestamp: string | number;
    nonce: string;
    body: Record<string, any> | string;
    serial: string;
    signature: string;
    apiSecret?: string;
}

export interface WechatPayNotifyAnalysisParams {
    outTradeNo: string;
    transactionId: string;
    attach: string;
    payer: Record<string, any>;
    amount: Record<string, any>;
}

export const resStatusCode = {
    SUCCESS: 200,
    FAIL: 400,
} as const;
export type resStatusCodeType = (typeof resStatusCode)[keyof typeof resStatusCode];

export type resourceType = {
    original_type: string;
    algorithm: string;
    ciphertext: string;
    associated_data: string;
    nonce: string;
};

export interface WechatPayRefundParams {
    out_refund_no: string;
    out_trade_no: string;
    reason?: string;
    amount: {
        total: number;
        refund: number;
        currency: "CNY";
    };
}
