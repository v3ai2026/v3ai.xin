import {
    type BooleanNumberType,
    type UserTerminalType,
} from "@buildingai/constants/shared/status-codes.constant";

import { Role } from "../entities/role.entity";

/**
 * Login User Playground
 */
export interface LoginUserPlayground {
    id: string;
    username: string;
    isRoot: BooleanNumberType;
    iat?: number;
    exp?: number;
    terminal?: UserTerminalType;
}

/**
 * User Playground
 */
export interface UserPlayground extends LoginUserPlayground {
    permissions: string[];
    role: Role | null;
}
