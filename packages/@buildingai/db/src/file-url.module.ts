import { Global, Module } from "@nestjs/common";

import { TypeOrmModule } from "./@nestjs/typeorm";
import { Dict } from "./entities/dict.entity";
import { FileUrlService } from "./utils/file-url.service";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Dict])],
    providers: [FileUrlService],
    exports: [FileUrlService],
})
export class FileUrlModule {}
