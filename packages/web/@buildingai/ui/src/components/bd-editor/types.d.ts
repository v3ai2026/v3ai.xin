/**
 * Editor component types
 * @description Type definitions for BdEditor component
 */

export interface BdEditorProps {
    /**
     * Controlled content, HTML string or Markdown string
     */
    modelValue: string;
    /**
     * Custom style class
     */
    customClass?: string;
    /**
     * Placeholder hint
     */
    placeholder?: string;
    /**
     * Whether to enable Markdown mode
     */
    enableMarkdown?: boolean;
    /**
     * Output format: 'html' | 'markdown'
     */
    outputFormat?: "html" | "markdown";
    /**
     * 是否启用导出功能
     */
    enableExport?: boolean;
    /**
     * 是否启用是否自动保存
     */
    enableAutoSave?: boolean;
    /**
     * 是否自动保存
     */
    isAutoSaving?: boolean;
    /**
     * 是否导出中
     */
    isExporting?: boolean;
}

export interface BdEditorEmits {
    (event: "update:modelValue", value: string): void;
    /**
     * 图片点击事件
     * @param imageUrls 所有图片的 URL 数组
     * @param currentIndex 当前点击图片的索引
     */
    (event: "image-click", imageUrls: string[], currentIndex: number): void;
    /**
     * 导出 PDF 事件
     * @param text Markdown 内容
     */
    (event: "export-pdf", text: string): void;
}
