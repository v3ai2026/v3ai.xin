export const messageEncryptType = {
    plain: "plain",
    compatible: "compatible",
    safe: "safe",
} as const;
export type MessageEncryptType = (typeof messageEncryptType)[keyof typeof messageEncryptType];
