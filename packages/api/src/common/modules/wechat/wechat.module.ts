import { AuthService } from "@common/modules/auth/services/auth.service";
import { ChannelModule } from "@modules/channel/channel.module";
import { WxOaConfigService } from "@modules/channel/services/wxoaconfig.service";
import { Module } from "@nestjs/common";

import { WechatOaService } from "./services/wechatoa.service";

@Module({
    imports: [ChannelModule],
    providers: [WechatOaService, WxOaConfigService, AuthService],
    exports: [WechatOaService],
})
export class WechatModule {}
