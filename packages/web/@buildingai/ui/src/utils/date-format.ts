import { CalendarDate, DateFormatter } from "@internationalized/date";

/**
 * 将任意日期值解析为JavaScript Date对象
 * @param value 输入值（Date对象、时间戳、日期字符串）
 * @returns Date对象或null
 */
export function parseToDate(value: Date | string | number | null): Date | null {
    if (!value) return null;

    // 已经是Date对象
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

    // 处理时间字符串
    if (typeof value === "string" && /^\d{1,2}:\d{1,2}(:\d{1,2})?$/.test(value)) {
        const now = new Date();
        const [hours, minutes, seconds = "0"] = value.split(":").map((v) => parseInt(v, 10));
        return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hours,
            minutes,
            parseInt(seconds.toString()),
        );
    }

    // 处理日期字符串
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}(:\d{2})?)?$/.test(value)) {
        const [datePart, timePart = "00:00:00"] = value.split(" ");
        if (!datePart) return null;

        const [year, month, day] = datePart.split("-").map((v) => parseInt(v, 10));
        const [hours, minutes, seconds = "0"] = timePart.split(":").map((v) => parseInt(v, 10));

        if (year === undefined || month === undefined || day === undefined) return null;

        return new Date(
            year,
            month - 1,
            day,
            hours || 0,
            minutes || 0,
            parseInt(seconds.toString()),
        );
    }

    // 其他情况使用标准Date构造函数
    try {
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
    } catch (e) {
        console.error("Error parsing to Date:", e);
        return null;
    }
}

/**
 * 解析日期值为CalendarDate对象
 */
export function parseDateValue(value: Date | string | number | null): CalendarDate | null {
    if (!value) return null;

    try {
        const date = parseToDate(value);
        if (!date) return null;
        return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    } catch (e) {
        console.error("Error parsing date value:", e);
        return null;
    }
}

/**
 * 合并时间到日期对象
 */
export function mergeTimeToDate(date: Date, timeDate: Date | null): Date {
    if (!date) return date;
    try {
        if (timeDate instanceof Date && !isNaN(timeDate.getTime())) {
            date.setHours(
                timeDate.getHours(),
                timeDate.getMinutes(),
                timeDate.getSeconds(),
                timeDate.getMilliseconds(),
            );
        } else {
            date.setHours(0, 0, 0, 0);
        }
        return date;
    } catch (e) {
        console.error("Error applying time to date:", e);
        return date;
    }
}

/**
 * 格式化日期显示
 */
export function formatDate(
    value: Date | string | number | null,
    locale: string = "zh-CN",
    dateStyle: "full" | "long" | "medium" | "short" = "medium",
    timeStyle?: "full" | "long" | "medium" | "short",
    showTime: boolean = false,
): string {
    if (!value) return "";

    try {
        const date = parseToDate(value);
        if (!date) return "";

        const formatter = new DateFormatter(locale, {
            dateStyle,
            timeStyle: showTime ? timeStyle : undefined,
        });

        return formatter.format(date);
    } catch (e) {
        console.error("Error formatting date:", e);
        return "";
    }
}
