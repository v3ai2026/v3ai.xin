import { BaseController } from "@buildingai/base";
import { type UserPlayground } from "@buildingai/db";
import { Playground } from "@buildingai/decorators/playground.decorator";
import { Public } from "@buildingai/decorators/public.decorator";
import { WechatPayNotifyParams } from "@buildingai/wechat-sdk/interfaces/pay";
import { WebController } from "@common/decorators/controller.decorator";
import { PrepayDto } from "@modules/pay/dto/prepay.dto";
import { PayService } from "@modules/pay/services/pay.service";
import { Body, Get, Headers, Post, Query, Res } from "@nestjs/common";
import type { Response } from "express";

@WebController("pay")
export class PayWebController extends BaseController {
    constructor(private readonly payService: PayService) {
        super();
    }

    @Post("prepay")
    async prepay(@Body() prepayDto: PrepayDto, @Playground() user: UserPlayground) {
        return this.payService.prepay(prepayDto, user.id);
    }

    @Get("getPayResult")
    async getPayResult(
        @Query("orderId") orderId: string,
        @Query("from") from: string,
        @Playground() user: UserPlayground,
    ) {
        return this.payService.getPayResult(orderId, from, user.id);
    }

    /**
     * 微信回调
     * @param headers
     * @param body
     * @param res
     */
    @Public()
    @Post("notifyWxPay")
    async notifyWxPay(
        @Headers() headers: Headers,
        @Body() body: Record<string, any>,
        @Res() res: Response,
    ) {
        const playload: WechatPayNotifyParams = {
            timestamp: headers["wechatpay-timestamp"],
            nonce: headers["wechatpay-nonce"],
            body,
            serial: headers["wechatpay-serial"],
            signature: headers["wechatpay-signature"],
        };
        console.log("回调开始");
        await this.payService.notifyWxPay(playload, body);
        //商户需告知微信支付接收回调成功，HTTP应答状态码需返回200或204，无需返回应答报文
        res.status(200).send("");
    }
}
