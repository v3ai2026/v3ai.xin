/**
 * ECharts component types
 * @description Type definitions for BdEcharts component
 */

export interface BdEchartsProps {
    /** ECharts configuration options */
    options: EChartsOption;
    /** Theme, optional */
    theme?: string;
    /** Chart height, default is '100%' */
    height?: string;
    /** Whether to automatically adjust size, default is true */
    autoResize?: boolean;
    /** Whether to enable animation, default is true */
    animation?: boolean;
    /** Rendering mode, optional 'canvas' or 'svg', default is 'canvas' */
    renderer?: "canvas" | "svg";
    /** Loading state, default is false */
    loading?: boolean;
    /** Loading text, default is 'Loading...' */
    loadingText?: string;
}
