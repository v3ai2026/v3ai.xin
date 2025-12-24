import { AppEntity } from "../decorators/app-entity.decorator";
import { Column, JoinColumn, ManyToOne, type Relation } from "../typeorm";
import { AiMcpServer } from "./ai-mcp-server.entity";
import { BaseEntity } from "./base";

/**
 * MCP工具实体
 *
 * 定义MCP服务提供的工具，一个MCP服务可以有多个工具
 */
@AppEntity({ name: "ai_mcp_tool", comment: "MCP工具" })
export class AiMcpTool extends BaseEntity {
    /**
     * 工具名称
     */
    @Column({
        type: "varchar",
        length: 100,
        comment: "工具名称",
    })
    name: string;

    /**
     * 工具描述
     */
    @Column({
        type: "text",
        nullable: true,
        comment: "工具描述",
    })
    description?: string;

    /**
     * 工具参数定义
     *
     * JSON格式，定义工具的参数结构
     */
    @Column({
        type: "jsonb",
        nullable: true,
        comment: "工具参数定义",
        default: {},
    })
    inputSchema?: Record<string, any>;

    /**
     * 关联的MCP服务ID
     */
    @Column({
        type: "uuid",
        comment: "MCP服务ID",
    })
    mcpServerId: string;

    /**
     * 关联的MCP服务
     *
     * 多对一关系，一个工具只能属于一个MCP服务，一个MCP服务可以有多个工具
     */
    @ManyToOne(() => AiMcpServer, (mcpServer) => mcpServer.tools, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "mcp_server_id" })
    mcpServer: Relation<AiMcpServer>;
}
