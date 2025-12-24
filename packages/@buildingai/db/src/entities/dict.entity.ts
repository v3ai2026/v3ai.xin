import { AppEntity } from "../decorators/app-entity.decorator";
import { Column, Index } from "../typeorm";
import { BaseEntity } from "./base";

/**
 * 字典配置实体
 */
@AppEntity({ name: "config", comment: "系统配置字典" })
@Index("UQ_dict_key_group", ["key", "group"], { unique: true })
export class Dict extends BaseEntity {
    /**
     * 配置键
     * 用于标识配置项的唯一键名
     */
    @Column({ length: 100, comment: "配置键" })
    key: string;

    /**
     * 配置值
     * 存储配置项的值，使用JSON格式
     */
    @Column({ type: "text", comment: "配置值(JSON格式)" })
    value: string;

    /**
     * 配置分组
     * 用于对配置进行分类管理
     */
    @Column({ length: 50, default: "default", comment: "配置分组" })
    group: string;

    /**
     * 配置描述
     * 对配置项的说明
     */
    @Column({ length: 255, nullable: true, comment: "配置描述" })
    description: string;

    /**
     * 排序
     */
    @Column({ type: "int", default: 0, comment: "排序" })
    sort: number;

    /**
     * 是否启用
     */
    @Column({ type: "boolean", default: true, comment: "是否启用" })
    isEnabled: boolean;
}
