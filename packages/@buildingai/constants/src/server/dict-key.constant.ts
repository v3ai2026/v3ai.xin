export const DICT_KEYS = {
    PLATFORM_SECRET: "dict:platform-secret",
};

export type DictKeyType = (typeof DICT_KEYS)[keyof typeof DICT_KEYS];

export const DICT_GROUP_KEYS = {
    APPLICATION: "dict:buildingai-application",
};

export type DictGroupKeyType = (typeof DICT_GROUP_KEYS)[keyof typeof DICT_GROUP_KEYS];
