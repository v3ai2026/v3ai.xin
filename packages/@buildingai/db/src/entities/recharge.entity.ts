import { AppEntity } from "../decorators/app-entity.decorator";
import { Column } from "../typeorm";
import { BaseEntity } from "./base";

@AppEntity({ name: "recharge", comment: "充值配置" })
export class Recharge extends BaseEntity {
    @Column({
        type: "integer",
        comment: "充值的数量",
    })
    power: number;

    @Column({
        type: "integer",
        comment: "赠送的数量",
    })
    givePower: number;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        comment: "售价",
    })
    sellPrice: number;

    @Column({
        type: "varchar",
        length: 64,
        comment: "标签",
    })
    label: string;
}
