import { BaseController } from "@buildingai/base";
import { BuildFileUrl } from "@buildingai/decorators/file-url.decorator";
import { PaginationDto } from "@buildingai/dto/pagination.dto";
import { ConsoleController } from "@common/decorators/controller.decorator";
import { Permissions } from "@common/decorators/permissions.decorator";
import { Body, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";

import { UpdateChatConfigDto } from "../../dto/ai-chat-config.dto";
import {
    BatchDeleteConversationDto,
    CreateAIChatRecordDto,
    QueryAIChatRecordDto,
    UpdateAIChatRecordDto,
} from "../../dto/ai-chat-record.dto";
import { AiChatRecordService } from "../../services/ai-chat-record.service";
import { ChatConfigService } from "../../services/chat-config.service";

/**
 * AI对话记录后台管理控制器
 * 提供对话记录的完整管理功能
 */
@ConsoleController("ai-conversations", "对话记录")
export class AiChatRecordConsoleController extends BaseController {
    constructor(
        private readonly AiChatRecordService: AiChatRecordService,
        private readonly chatConfigService: ChatConfigService,
    ) {
        super();
    }

    /**
     * 分页查询对话记录
     */
    @Get()
    @BuildFileUrl(["**.avatar"])
    @Permissions({
        code: "list",
        name: "查询AI对话记录",
    })
    async findAll(@Query() queryDto: QueryAIChatRecordDto) {
        return await this.AiChatRecordService.findUserConversations(
            "", // 后台管理可以查看所有用户对话
            queryDto,
            true, // 后台管理需要包含用户信息
        );
    }

    /**
     * 获取对话配置
     */
    @Get("config")
    @Permissions({
        code: "get-config",
        name: "查询对话配置",
    })
    async getChatConfig() {
        return await this.chatConfigService.getChatConfig();
    }

    /**
     * 设置对话配置
     */
    @Put("config")
    @Permissions({
        code: "update-config",
        name: "更新对话配置",
    })
    async setChatConfig(@Body() updateChatConfigDto: UpdateChatConfigDto) {
        return await this.chatConfigService.setChatConfig(updateChatConfigDto);
    }

    /**
     * 批量删除对话
     */
    @Post("batch-delete")
    @Permissions({
        code: "batch-delete",
        name: "批量删除AI对话",
    })
    async batchRemove(@Body() batchDeleteDto: BatchDeleteConversationDto) {
        await this.AiChatRecordService.batchDeleteConversations(batchDeleteDto.ids, "");
        return {
            success: true,
            message: `成功删除 ${batchDeleteDto.ids.length} 个对话记录`,
        };
    }

    /**
     * 根据ID获取对话详情
     */
    @Get(":id")
    @Permissions({
        code: "detail",
        name: "查看AI对话详情",
    })
    async findOne(@Param("id") id: string) {
        // 管理员查看对话时不受用户限制
        return await this.AiChatRecordService.getConversationWithMessages(id);
    }

    /**
     * 创建对话（管理员代创建）
     */
    @Post()
    @Permissions({
        code: "create",
        name: "创建AI对话",
    })
    async create(@Body() createDto: CreateAIChatRecordDto & { userId: string }) {
        const { userId, ...conversationDto } = createDto;
        return await this.AiChatRecordService.createConversation(userId, conversationDto);
    }

    /**
     * 更新对话信息
     */
    @Put(":id")
    @Permissions({
        code: "update",
        name: "更新AI对话",
    })
    async update(@Param("id") id: string, @Body() updateDto: UpdateAIChatRecordDto) {
        // 管理员更新时不受用户限制
        return await this.AiChatRecordService.updateConversation(
            id,
            "", // 空字符串表示管理员操作
            updateDto,
        );
    }

    /**
     * 删除对话
     */
    @Delete(":id")
    @Permissions({
        code: "delete",
        name: "删除AI对话",
    })
    async remove(@Param("id") id: string) {
        await this.AiChatRecordService.deleteConversation(id, "");
        return { message: "对话删除成功" };
    }

    /**
     * 置顶/取消置顶对话
     */
    @Put(":id/pin")
    @Permissions({
        code: "pin",
        name: "置顶AI对话",
    })
    async pinConversation(@Param("id") id: string, @Body() body: { isPinned: boolean }) {
        await this.AiChatRecordService.pinConversation(id, "", body.isPinned);
        return { message: body.isPinned ? "对话置顶成功" : "对话取消置顶成功" };
    }

    /**
     * 获取对话的消息列表
     */
    @Get(":id/messages")
    @Permissions({
        code: "get-messages",
        name: "查看对话消息",
    })
    async getMessages(@Param("id") conversationId: string, @Query() paginationDto: PaginationDto) {
        return await this.AiChatRecordService.getConversationMessages(
            conversationId,
            paginationDto,
        );
    }
}
