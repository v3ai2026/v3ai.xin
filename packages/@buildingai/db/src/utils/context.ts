import { ExecutionContext } from "@nestjs/common";
import type { Request } from "express";

import { LoginUserPlayground, UserPlayground } from "../interfaces/context.interface";

export const checkUserLoginPlayground = (playground: LoginUserPlayground) => {
    return playground;
};

/**
 * 从上下文中获取Playground信息
 * @param context 上下文
 */
export const getContextPlayground = (
    context: ExecutionContext,
): {
    user: UserPlayground | undefined;
    request: Request;
} => {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    return {
        user: user ?? undefined,
        request,
    };
};
