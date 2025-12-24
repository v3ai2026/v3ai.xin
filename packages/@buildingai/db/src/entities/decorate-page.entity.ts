import { AppEntity } from "../decorators/app-entity.decorator";
import { Column } from "../typeorm";
import { BaseEntity } from "./base";

@AppEntity({ name: "decorate_page", comment: "布局配置" })
export class DecoratePageEntity extends BaseEntity {
    /**
     * 页面名称/类型标识
     */
    @Column({ type: "varchar" })
    name: string;

    /**
     * 布局数据
     */
    @Column({ type: "jsonb", nullable: true })
    data: any;
}
