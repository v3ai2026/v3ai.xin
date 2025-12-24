import csv from "./csv.png";
import doc from "./doc.png";
import files from "./files.png";
import markdown from "./markdown.png";
import pdf from "./pdf.png";
import txt from "./txt.png";
import xlsx from "./xlsx.png";
import zip from "./zip.png";

const suffixIconMap: Record<string, string> = {
    doc: doc,
    docx: doc,
    pdf: pdf,
    txt: txt,
    xlsx: xlsx,
    csv: csv,
    mark: markdown,
    md: markdown,
    markdown: markdown,
    file: files,
    zip: zip,
    rar: zip,
};

/**
 * 根据文件名获取对应文件图标
 * @param name 文件名（如 abc.docx）
 * @returns 对应图片路径（默认 files）
 */
export const getFileIcon = (name: string): string => {
    const suffix = name.split(".").pop()?.toLowerCase();

    if (!suffix) return files;

    return suffixIconMap[suffix] ?? files;
};
