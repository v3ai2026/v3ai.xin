import { type UserTerminalType } from "@buildingai/constants/shared/status-codes.constant";

import { AppEntity } from "../decorators/app-entity.decorator";
import { Column, JoinColumn, ManyToOne } from "../typeorm";
import { BaseEntity } from "./base";
import { User } from "./user.entity";

/**
 * 用户令牌实体
 *
 * 用于存储用户的登录令牌信息，支持多端登录和令牌管理
 */
@AppEntity({ name: "user_token", comment: "用户令牌" })
export class UserToken extends BaseEntity {
    /**
     * 关联的用户ID
     */
    @Column()
    userId: string;

    /**
     * 关联的用户
     */
    @ManyToOne(() => User, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "user_id" })
    user: User;

    /**
     * JWT令牌
     */
    @Column({ type: "text" })
    token: string;

    /**
     * 令牌过期时间
     */
    @Column({ type: "timestamp with time zone" })
    expiresAt: Date;

    /**
     * 用户登录终端
     *
     * 1: PC, 2: H5, 3: 小程序, 4: APP
     */
    @Column({ type: "int" })
    terminal: UserTerminalType;

    /**
     * 登录IP地址
     */
    @Column({ nullable: true })
    ipAddress: string;

    /**
     * 登录设备信息
     */
    @Column({ nullable: true })
    userAgent: string;

    /**
     * 最后活跃时间
     */
    @Column({ type: "timestamp with time zone", nullable: true })
    lastActiveAt: Date;

    /**
     * 是否已失效
     *
     * 当用户主动登出或管理员强制下线时，令牌会被标记为失效
     */
    @Column({ default: false })
    isRevoked: boolean;
}
