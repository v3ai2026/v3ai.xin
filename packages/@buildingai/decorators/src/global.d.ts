import { type UserPlayground } from "@buildingai/db/interfaces/context.interface";

declare module "express" {
    interface Request {
        user?: UserPlayground;
        accessToken?: string;
    }
}
