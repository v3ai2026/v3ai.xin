import { TypeOrmModule } from "@buildingai/db/@nestjs/typeorm";
import { Dict } from "@buildingai/db/entities";
import { DictCacheService } from "@buildingai/dict";
import { DictService } from "@buildingai/dict";
import { WxOaConfigConsoleController } from "@modules/channel/controller/console/wxoaconfig.controller";
import { WxOaConfigService } from "@modules/channel/services/wxoaconfig.service";
import { Module } from "@nestjs/common";
@Module({
    imports: [TypeOrmModule.forFeature([Dict])],
    controllers: [WxOaConfigConsoleController],
    providers: [WxOaConfigService, DictService, DictCacheService],
    exports: [WxOaConfigService],
})
export class ChannelModule {}
