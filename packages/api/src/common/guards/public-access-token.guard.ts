import { HttpErrorFactory } from "@buildingai/errors";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import type { Request } from "express";

/**
 * 公开智能体访问令牌守卫
 * 验证请求头中的 Bearer Token (API Key 或 Access Token)
 */
@Injectable()
export class PublicAccessTokenGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        // 从请求头中获取 token
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw HttpErrorFactory.unauthorized("缺少访问令牌");
        }

        // 验证 token 格式
        if (!this.isValidToken(token)) {
            throw HttpErrorFactory.unauthorized("无效的访问令牌格式");
        }

        // 将 token 附加到请求对象上，供控制器使用
        request.accessToken = token;

        return true;
    }

    /**
     * 从请求头中提取访问令牌
     */
    private extractTokenFromHeader(request: Request): string | undefined {
        // 优先从 Authorization Bearer 头获取
        const authorization = request.headers.authorization;
        if (authorization && authorization.startsWith("Bearer ")) {
            return authorization.substring(7);
        }

        // 备用：从自定义头获取（向后兼容）
        const publicAccessTokenHeader = request.headers["x-public-access-token"] as string;
        if (publicAccessTokenHeader) {
            return publicAccessTokenHeader;
        }

        // 备用：从 x-access-token 头获取（向后兼容）
        const accessTokenHeader = request.headers["x-access-token"] as string;
        if (accessTokenHeader) {
            return accessTokenHeader;
        }

        // 备用：从查询参数获取（不推荐，但为了兼容性）
        const accessTokenQuery = request.query.accessToken as string;
        if (accessTokenQuery) {
            return accessTokenQuery;
        }

        return undefined;
    }

    /**
     * 验证访问令牌格式
     */
    private isValidToken(token: string): boolean {
        // 支持两种格式：
        // 1. 64个十六进制字符的 accessToken
        // 2. API Key 格式（更灵活的验证）
        return /^[a-f0-9]{64}$/i.test(token) || token.length >= 32;
    }
}
