/**
 * Upload status constants
 */
export const UPLOAD_STATUS = {
    INITIAL: 0,
    UPLOADING: 1,
    SUCCESS: 2,
    FAIL: 3,
} as const;

export type UploadStatus = (typeof UPLOAD_STATUS)[keyof typeof UPLOAD_STATUS];
