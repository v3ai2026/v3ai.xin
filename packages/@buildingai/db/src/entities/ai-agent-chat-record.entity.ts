import { AppEntity } from "../decorators/app-entity.decorator";
import { Column, Index, JoinColumn, ManyToOne, OneToMany, type Relation } from "../typeorm";
import { Agent } from "./ai-agent.entity";
import { AgentChatMessage } from "./ai-agent-chat-message.entity";
import { BaseEntity } from "./base";
import { User } from "./user.entity";

/**
 * 智能体对话记录实体
 * 记录用户与智能体的对话会话信息
 */
@AppEntity({ name: "ai_agent_chat_record", comment: "智能体对话记录" })
@Index(["userId", "createdAt"])
@Index(["isDeleted", "createdAt"])
@Index(["agentId", "createdAt"])
export class AgentChatRecord extends BaseEntity {
    /**
     * 对话标题
     */
    @Column({
        type: "varchar",
        length: 200,
        comment: "对话标题",
        nullable: true,
    })
    title: string;

    /**
     * 用户ID (注册用户时使用)
     */
    @Column({
        type: "uuid",
        comment: "用户ID，匿名用户时为空",
        nullable: true,
    })
    @Index()
    userId?: string;

    /**
     * 匿名用户标识 (匿名用户时使用)
     */
    @Column({
        type: "varchar",
        length: 128,
        comment: "匿名用户标识，如设备ID或访问令牌的hash",
        nullable: true,
    })
    @Index()
    anonymousIdentifier?: string;

    /**
     * 智能体ID
     */
    @Column({
        type: "uuid",
        comment: "关联的智能体ID",
    })
    @Index()
    agentId: string;

    /**
     * 对话摘要
     */
    @Column({
        type: "text",
        nullable: true,
        comment: "对话摘要",
    })
    summary?: string;

    /**
     * 消息总数
     */
    @Column({
        type: "int",
        default: 0,
        comment: "对话中的消息总数",
    })
    messageCount: number;

    /**
     * 总Token消耗
     */
    @Column({
        type: "int",
        default: 0,
        comment: "本次对话消耗的总Token数",
    })
    totalTokens: number;

    /**
     * 累计消耗积分
     */
    @Column({
        type: "int",
        default: 0,
        comment: "本次对话累计消耗的积分",
    })
    consumedPower: number;

    /**
     * 对话配置
     */
    @Column({
        type: "jsonb",
        nullable: true,
        comment: "对话相关配置，如温度、最大令牌数等",
    })
    config?: Record<string, any>;

    /**
     * 是否删除（软删除）
     */
    @Column({
        type: "boolean",
        default: false,
        comment: "是否已删除",
    })
    @Index()
    isDeleted: boolean;

    /**
     * 扩展数据
     */
    @Column({
        type: "jsonb",
        nullable: true,
        comment: "扩展数据字段",
    })
    metadata?: Record<string, any>;

    /**
     * 关联的用户 (注册用户时使用)
     */
    @ManyToOne(() => User, {
        onDelete: "CASCADE",
        nullable: true,
    })
    @JoinColumn({ name: "user_id" })
    user?: User;

    /**
     * 关联的智能体
     */
    @ManyToOne(() => Agent, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "agent_id" })
    agent: Agent;

    /**
     * 对话中的消息列表
     */
    @OneToMany(() => AgentChatMessage, (message) => message.conversation, {
        cascade: true,
    })
    messages?: Relation<AgentChatMessage[]>;
}
