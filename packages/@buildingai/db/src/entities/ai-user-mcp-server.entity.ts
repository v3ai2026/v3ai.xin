import { AppEntity } from "../decorators/app-entity.decorator";
import { Column, JoinColumn, ManyToOne, type Relation } from "../typeorm";
import { AiMcpServer } from "./ai-mcp-server.entity";
import { BaseEntity } from "./base";
import { User } from "./user.entity";

/**
 * 用户与MCP服务的关联实体
 *
 * 定义用户与MCP服务的多对多关系
 */
@AppEntity({ name: "ai_user_mcp_server", comment: "用户&MCP" })
export class AiUserMcpServer extends BaseEntity {
    /**
     * 用户ID
     */
    @Column({
        type: "uuid",
        comment: "用户ID",
    })
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
     * MCP服务ID
     */
    @Column({
        type: "uuid",
        comment: "MCP服务ID",
    })
    mcpServerId: string;

    /**
     * 关联的MCP服务
     */
    @ManyToOne(() => AiMcpServer, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "mcp_server_id" })
    mcpServer: Relation<AiMcpServer>;

    /**
     * 是否禁用该服务
     */
    @Column({
        type: "boolean",
        default: false,
        comment: "是否禁用该服务",
    })
    isDisabled: boolean;
}
