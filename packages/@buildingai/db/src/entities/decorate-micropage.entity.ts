import { TERMINAL_TYPES, type TerminalType } from "@buildingai/constants/shared/terminal.constants";

import { AppEntity } from "../decorators/app-entity.decorator";
import { Column } from "../typeorm";
import { SoftDeleteBaseEntity } from "./base";

@AppEntity({ name: "decorate_micropage", comment: "装修微页面配置" })
export class DecorateMicropageEntity extends SoftDeleteBaseEntity {
    /**
     * 页面名称
     */
    @Column({ type: "varchar" })
    name: string;

    /**
     * 终端类型 web/mobile
     */
    @Column({
        type: "varchar",
        length: 10,
        default: TERMINAL_TYPES.WEB,
        comment: "终端类型：web(网页端) 或 mobile(移动端)",
    })
    terminal: TerminalType;

    /**
     * 内容
     */
    @Column({ type: "jsonb", nullable: true }) // 存储 JSON 数据，允许为空
    content: any[];

    /**
     * 页面配置
     */
    @Column({ type: "jsonb", nullable: true }) // 存储 JSON 数据，允许为空
    configs: any;
}
