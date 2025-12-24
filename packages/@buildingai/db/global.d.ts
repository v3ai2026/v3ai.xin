declare module "body-parser" {
    interface BodyParser {
        xml: (options?: any) => import("express").RequestHandler;
    }
}

declare module "express" {
    interface Request {
        user?: import("./src/interfaces/context.interface").UserPlayground;
        accessToken?: string;
    }
}
