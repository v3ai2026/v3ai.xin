export type ErrorLevel = "fatal" | "error" | "warn" | "log" | "debug";

export type ErrorTags = Record<string, string | number | boolean>;

export type ReportingOptions = {
    level?: ErrorLevel;
    tags?: ErrorTags;
    extra?: Record<string, any>;
};
