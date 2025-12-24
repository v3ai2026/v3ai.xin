import "@fancyapps/ui/dist/fancybox/fancybox.css";

import { Fancybox } from "@fancyapps/ui";
import { useColorMode } from "@vueuse/core";

/**
 * 打开 FancyBox 图片预览
 *
 * @param {string[]} urls - 图片或内容的 URL 数组。每个 URL 会被作为图片的源地址和缩略图。
 * @param {number} index - 当前展示的图片索引，决定从哪一张图片开始展示。
 *
 * @example
 * // 打开包含多张图片的 FancyBox，起始显示第二张图片
 * openPreview(["image1.jpg", "image2.jpg", "image3.jpg"], 1);
 */
export function useImagePreview(urls: string[], index: number) {
    const { store } = useColorMode();
    Fancybox.show(
        urls.map((url) => ({
            src: url,
            thumb: url,
        })),
        {
            startIndex: index,
            theme: store.value,
            Carousel: {
                Toolbar: {
                    display: {
                        right: [
                            "zoomIn",
                            "zoomOut",
                            "toggle1to1",
                            "rotateCCW",
                            "rotateCW",
                            "flipX",
                            "flipY",
                            "close",
                        ],
                    },
                },
                Zoomable: {
                    Panzoom: {
                        panMode: "mousemove",
                        mouseMoveFactor: 1.1,
                    },
                },
            },
        },
    );
}
