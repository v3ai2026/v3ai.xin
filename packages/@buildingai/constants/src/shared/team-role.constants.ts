/**
 * 团队角色常量对象
 */
export const TEAM_ROLE = {
    /**
     * 所有者 - 知识库创建者，拥有最高权限
     */
    OWNER: "owner",

    /**
     * 管理者 - 可管理团队成员和整个知识库项目
     */
    MANAGER: "manager",

    /**
     * 编辑者 - 可上传和编辑自己的知识库数据，其他人的数据不允许编辑
     */
    EDITOR: "editor",

    /**
     * 查看者 - 仅能查看知识库所有的数据，增删改不能操作
     */
    VIEWER: "viewer",
} as const;

/**
 * 团队角色类型
 */
export type TeamRoleType = (typeof TEAM_ROLE)[keyof typeof TEAM_ROLE];

/**
 * 团队角色权限矩阵
 */
export const TEAM_ROLE_PERMISSIONS = {
    [TEAM_ROLE.OWNER]: {
        // 所有者权限
        canManageTeam: true,
        canManageDataset: true,
        canManageDocuments: true,
        canManageSegments: true,
        canManageOwnDocuments: true,
        canViewAll: true,
        canDelete: true,
        canTransferOwnership: true,
        canRemoveMembers: true,
        canAddMembers: true,
        canModifyPermissions: true,
    },
    [TEAM_ROLE.MANAGER]: {
        // 管理者权限
        canManageTeam: true,
        canManageDataset: true,
        canManageDocuments: true,
        canManageSegments: true,
        canManageOwnDocuments: true,
        canViewAll: true,
        canDelete: false,
        canTransferOwnership: false,
        canRemoveMembers: true,
        canAddMembers: true,
        canModifyPermissions: true,
    },
    [TEAM_ROLE.EDITOR]: {
        // 编辑者权限
        canManageTeam: false,
        canManageDataset: false,
        canManageDocuments: true,
        canManageSegments: true,
        canManageOwnDocuments: true,
        canViewAll: true,
        canDelete: false,
        canTransferOwnership: false,
        canRemoveMembers: false,
        canAddMembers: false,
        canModifyPermissions: false,
    },
    [TEAM_ROLE.VIEWER]: {
        // 查看者权限
        canManageTeam: false,
        canManageDataset: false,
        canManageDocuments: false,
        canManageSegments: false,
        canManageOwnDocuments: false,
        canViewAll: true,
        canDelete: false,
        canTransferOwnership: false,
        canRemoveMembers: false,
        canAddMembers: false,
        canModifyPermissions: false,
    },
} as const;

/**
 * 团队角色显示名称
 */
export const TEAM_ROLE_NAMES = {
    [TEAM_ROLE.OWNER]: "所有者",
    [TEAM_ROLE.MANAGER]: "管理者",
    [TEAM_ROLE.EDITOR]: "编辑者",
    [TEAM_ROLE.VIEWER]: "查看者",
} as const;

/**
 * 团队角色描述
 */
export const TEAM_ROLE_DESCRIPTIONS = {
    [TEAM_ROLE.OWNER]: "知识库的创建者，拥有最高权限",
    [TEAM_ROLE.MANAGER]: "可管理团队成员和整个知识库项目",
    [TEAM_ROLE.EDITOR]: "可上传和编辑自己的知识库数据，其他人的数据不允许编辑",
    [TEAM_ROLE.VIEWER]: "仅能查看知识库所有的数据，增删改不能操作",
} as const;
