import { type UserPlayground } from "@buildingai/db/interfaces/context.interface";

declare module "body-parser" {
    interface BodyParser {
        xml: (options?: any) => import("express").RequestHandler;
    }
}

declare module "express" {
    interface Request {
        user?: UserPlayground; // 或者 any，自定义类型也可以
        accessToken?: string;
    }
}
