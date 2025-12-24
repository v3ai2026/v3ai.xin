import type { _LinkType } from "~/components/console/page-link-picker/layout.d";

// Designer types
import type * as _DesignerTypes from "../../../@buildingai/designer/src/types/index";

declare module "#app" {
    interface RuntimeNuxtHooks {
        "chat:run:html": (html: string) => void | Promise<void>;
    }
}

declare global {
    /** Link item interface */
    type LinkItem = {
        /** Link type */
        type?: _LinkType;
        /** Display name */
        name?: string;
        /** Link path */
        path?: string;
        /** Additional data */
        query?: Record<string, unknown>;
    };

    /** Icon type definition */
    type IconType =
        | string
        | {
              type: "svg";
              content: string;
          };

    /** Decoration terminal creation web / mobile */
    type DecorateScene = "web" | "mobile";
}
export {};
