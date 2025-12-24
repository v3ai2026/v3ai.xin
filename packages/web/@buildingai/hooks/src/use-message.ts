import type { ButtonProps } from "@nuxt/ui";

/**
 * Message type enumeration
 * @description Available message types for different notification styles
 */
export type MessageType = "success" | "info" | "warning" | "error";

/**
 * Message options interface
 * @description Configuration options for message display and behavior
 */
export interface MessageOptions {
    title?: string;
    description?: string;
    icon?: string;
    duration?: number;
    actions?: Array<ButtonProps & { click?: (...args: any[]) => void }>;
    click?: (...args: any[]) => void;
    color?: MessageType;
    closable?: boolean;
    hook?: (...args: any[]) => void;
}

/**
 * Message instance interface
 * @description Represents a single message instance with update and close capabilities
 */
export interface MessageInstance {
    id: string;
    update: (msg: string, opt?: MessageOptions) => void;
    close: () => void;
}

/**
 * Message service interface
 * @description Service interface for managing different types of messages
 */
export interface MessageService {
    success: (msg: string, opt?: MessageOptions) => MessageInstance;
    info: (msg: string, opt?: MessageOptions) => MessageInstance;
    warning: (msg: string, opt?: MessageOptions) => MessageInstance;
    error: (msg: string, opt?: MessageOptions) => MessageInstance;
    clear: () => void;
    update: (msg: string, opt: MessageOptions) => void;
}

const DEFAULT_OPTIONS: MessageOptions = {
    duration: 3000,
    closable: true,
};

const ICONS: Record<MessageType, string> = {
    success: "tabler:circle-check",
    info: "tabler:info-circle",
    warning: "tabler:alert-circle",
    error: "tabler:alert-triangle",
};

/** 消息提示服务 */
export function useMessage(): MessageService {
    const toast = useToast();

    const createMessage = (
        type: MessageType,
        msg: string,
        opt?: MessageOptions,
    ): MessageInstance => {
        const toastId = toast.add({
            ...DEFAULT_OPTIONS,
            ...opt,
            description: msg,
            icon: opt?.icon ?? ICONS[type],
            color: type,
        });

        if (!toastId) {
            console.error("创建消息失败");
            return {
                id: "",
                update: () => {},
                close: () => {},
            };
        }

        opt?.hook?.();

        return {
            id: String(toastId.id),
            update: (newMsg: string, newOpt?: MessageOptions) => {
                toast.update(toastId.id, {
                    ...newOpt,
                    description: newMsg,
                });
            },
            close: () => toast.remove(toastId.id),
        };
    };

    const service: MessageService = {
        success: (msg, opt) => createMessage("success", msg, opt),
        info: (msg, opt) => createMessage("info", msg, opt),
        warning: (msg, opt) => createMessage("warning", msg, opt),
        error: (msg, opt) => createMessage("error", msg, opt),
        clear: () => toast.clear(),
        update: (msg, opt) => {
            const lastToast = toast.toasts.value.at(-1);
            if (lastToast?.id) {
                toast.update(lastToast.id, {
                    ...opt,
                    description: msg,
                });
            }
        },
    };

    return service;
}
