/**
 * 数据看板相关类型定义
 *
 * @fileoverview 统一管理数据分析模块的所有类型定义
 */

/**
 * 用户统计信息
 */
export interface UserStats {
    /** 总用户数 */
    totalUsers: number;
    /** 活跃用户数（最近30天有对话记录的用户） */
    activeUsers: number;
    /** 今日新增用户 */
    newUsersToday: number;
    /** 同比变化（与昨天对比，百分比） */
    userChange?: number;
}

/**
 * 对话统计信息
 */
export interface ChatStats {
    /** 总对话数 */
    totalConversations: number;
    /** 总Token数 */
    totalTokens: number;
    /** 今日对话数 */
    conversationsToday: number;
    /** 同比变化（与昨天对比，百分比） */
    chatChange?: number;
}

/**
 * 订单统计信息
 */
export interface OrderStats {
    /** 总订单数 */
    totalOrders: number;
    /** 总订单金额 */
    totalAmount: number;
    /** 今日订单数 */
    ordersToday: number;
    /** 同比变化（与昨天对比，百分比） */
    orderChange?: number;
}

/**
 * 用户详细数据 - 近15天数据
 */
export interface UserDetailLast15Days {
    /** 总访问数 */
    totalVisit: number;
    /** 总注册数 */
    totalRegister: number;
}

/**
 * 用户详细数据 - 同比数据
 */
export interface UserDetailCompareLast15Days {
    /** 访问变化率（百分比） */
    visitChange: number;
    /** 注册变化率（百分比） */
    registerChange: number;
}

/**
 * 用户详细数据 - 图表数据项
 */
export interface UserDetailChartDataItem {
    /** 日期（YYYY-MM-DD格式） */
    date: string;
    /** 访问数 */
    visit: number;
    /** 注册数 */
    register: number;
}

/**
 * 用户详细数据
 */
export interface UserDetail {
    /** 今日访问数 */
    todayVisit: number;
    /** 今日注册数 */
    todayRegister: number;
    /** 近15天数据 */
    last15Days: UserDetailLast15Days;
    /** 同比近15天数据 */
    compareLast15Days: UserDetailCompareLast15Days;
    /** 图表数据 */
    chartData: UserDetailChartDataItem[];
}

/**
 * 收入详细数据 - 近15天数据
 */
export interface RevenueDetailLast15Days {
    /** 总收入 */
    totalRevenue: number;
    /** 总订单数 */
    totalOrders: number;
}

/**
 * 收入详细数据 - 同比数据
 */
export interface RevenueDetailCompareLast15Days {
    /** 收入变化率（百分比） */
    revenueChange: number;
    /** 订单变化率（百分比） */
    ordersChange: number;
}

/**
 * 收入详细数据 - 图表数据项
 */
export interface RevenueDetailChartDataItem {
    /** 日期（YYYY-MM-DD格式） */
    date: string;
    /** 收入 */
    revenue: number;
    /** 订单数 */
    orders: number;
}

/**
 * 收入详细数据
 */
export interface RevenueDetail {
    /** 今日收入 */
    todayRevenue: number;
    /** 今日订单数 */
    todayOrders: number;
    /** 近15天数据 */
    last15Days: RevenueDetailLast15Days;
    /** 同比近15天数据 */
    compareLast15Days: RevenueDetailCompareLast15Days;
    /** 图表数据 */
    chartData: RevenueDetailChartDataItem[];
}

/**
 * Token使用数据 - 按模型统计项
 */
export interface TokenUsageByModelItem {
    /** 模型ID */
    modelId: string;
    /** 模型名称 */
    modelName: string;
    /** 供应商名称 */
    providerName: string;
    /** 供应商图标URL */
    iconUrl?: string;
    /** 对话数 */
    conversations: number;
    /** Token数 */
    tokens: number;
}

/**
 * Token使用数据 - 按供应商统计项
 */
export interface TokenUsageByProviderItem {
    /** 供应商ID */
    providerId: string;
    /** 供应商标识 */
    provider: string;
    /** 供应商名称 */
    providerName: string;
    /** 供应商图标URL */
    iconUrl?: string;
    /** 对话数 */
    conversations: number;
    /** Token数 */
    tokens: number;
}

/**
 * Token使用数据
 */
export interface TokenUsage {
    /** 按模型统计 */
    byModel: TokenUsageByModelItem[];
    /** 按供应商统计 */
    byProvider: TokenUsageByProviderItem[];
}

/**
 * 插件使用排行项
 */
export interface ExtensionUsageRankingItem {
    /** 插件ID */
    extensionId: string;
    /** 插件名称 */
    extensionName: string;
    /** 使用次数 */
    usageCount: number;
}

/**
 * 插件数据
 */
export interface ExtensionData {
    /** 插件总数 */
    totalCount: number;
    /** 已启用插件数 */
    enabledCount: number;
    /** 使用排行 */
    usageRanking: ExtensionUsageRankingItem[];
}

/**
 * 数据看板完整数据
 */
export interface DashboardData {
    /** 用户统计 */
    user: UserStats;
    /** 对话统计 */
    chat: ChatStats;
    /** 订单统计 */
    order: OrderStats;
    /** 用户详细数据 */
    userDetail: UserDetail;
    /** 收入详细数据 */
    revenueDetail: RevenueDetail;
    /** Token使用数据 */
    tokenUsage: TokenUsage;
    /** 插件数据 */
    extension: ExtensionData;
}
