<script lang="ts" setup>
/**
 * 音频组件
 * @description 支持音频播放、控制条、信息显示的音频播放器组件
 */
import { computed, ref, onMounted, watch, type CSSProperties } from "vue";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = defineProps<Props>();

/**
 * 音频元素引用
 */
const audioRef = ref<HTMLAudioElement>();

/**
 * 播放状态
 */
const isPlaying = ref(false);

/**
 * 当前播放时间
 */
const currentTime = ref(0);

/**
 * 总时长
 */
const duration = ref(0);

/**
 * 音频容器样式计算
 */
const audioStyle = computed<CSSProperties>(() => ({
    backgroundColor: props.style.bgColor,
    borderRadius: `${props.borderRadius}px`,
    border: `1px solid ${props.style.borderColor}`,
    padding: `${props.style.paddingTop}px ${props.style.paddingRight}px ${props.style.paddingBottom}px ${props.style.paddingLeft}px`,
    width: "100%",
    overflow: "hidden",
}));

/**
 * 播放器高度映射
 */
const playerHeights = {
    small: "60px",
    medium: "80px",
    large: "100px",
};

/**
 * 播放器样式
 */
const playerStyle = computed<CSSProperties>(() => ({
    height: playerHeights[props.playerSize],
    display: "flex",
    alignItems: "center",
    gap: "12px",
}));

/**
 * 播放/暂停按钮样式
 */
const playButtonStyle = computed<CSSProperties>(() => ({
    backgroundColor: props.themeColor,
    color: "#ffffff",
    borderRadius: "50%",
    width: props.playerSize === "small" ? "36px" : props.playerSize === "medium" ? "40px" : "44px",
    height: props.playerSize === "small" ? "36px" : props.playerSize === "medium" ? "40px" : "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexShrink: 0,
}));

/**
 * 进度条样式
 */
const progressStyle = computed<CSSProperties>(() => ({
    flex: 1,
    height: "4px",
    backgroundColor: "#e5e7eb",
    borderRadius: "2px",
    overflow: "hidden",
    cursor: "pointer",
}));

/**
 * 进度条填充样式
 */
const progressFillStyle = computed<CSSProperties>(() => ({
    height: "100%",
    backgroundColor: props.themeColor,
    width: `${duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0}%`,
    transition: "width 0.1s ease",
}));

/**
 * 时间显示样式
 */
const timeStyle = computed<CSSProperties>(() => ({
    fontSize: "12px",
    color: "#64748b",
    minWidth: "40px",
    textAlign: "center",
}));

/**
 * 音频信息区域样式
 */
const infoStyle = computed<CSSProperties>(() => ({
    flex: 1,
    minWidth: 0,
    paddingLeft: "8px",
}));

/**
 * 标题样式
 */
const titleStyle = computed<CSSProperties>(() => ({
    fontSize: props.playerSize === "small" ? "12px" : "14px",
    fontWeight: "600",
    color: "#1f2937",
    lineHeight: "1.4",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginBottom: "2px",
}));

/**
 * 艺术家样式
 */
const artistStyle = computed<CSSProperties>(() => ({
    fontSize: props.playerSize === "small" ? "10px" : "12px",
    color: "#64748b",
    lineHeight: "1.3",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
}));

/**
 * 格式化时间
 */
const formatTime = (time: number): string => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * 播放/暂停切换
 */
const togglePlayPause = async () => {
    if (!audioRef.value) return;

    try {
        if (isPlaying.value) {
            audioRef.value.pause();
        } else {
            await audioRef.value.play();
        }
    } catch (error) {
        console.warn("Audio play failed:", error);
    }
};

/**
 * 处理进度条点击
 */
const handleProgressClick = (event: MouseEvent) => {
    if (!audioRef.value || duration.value === 0) return;

    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const newTime = percent * duration.value;

    audioRef.value.currentTime = newTime;
    currentTime.value = newTime;
};

/**
 * 监听音频事件
 */
onMounted(() => {
    if (!audioRef.value) return;

    const audio = audioRef.value;

    // 播放状态改变
    const handlePlay = () => {
        isPlaying.value = true;
    };
    const handlePause = () => {
        isPlaying.value = false;
    };

    // 时间更新
    const handleTimeUpdate = () => {
        currentTime.value = audio.currentTime;
    };

    // 加载元数据
    const handleLoadedMetadata = () => {
        duration.value = audio.duration;
    };

    // 播放结束
    const handleEnded = () => {
        isPlaying.value = false;
        currentTime.value = 0;
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    // 设置音量
    audio.volume = props.volume;
});

/**
 * 监听音量变化
 */
watch(
    () => props.volume,
    (newVolume) => {
        if (audioRef.value) {
            audioRef.value.volume = newVolume;
        }
    },
);

/**
 * 播放图标名称
 */
const playIconName = computed(() => {
    return isPlaying.value ? "i-heroicons-pause" : "i-heroicons-play";
});
</script>

<template>
    <WidgetsBaseContent :style="props.style" :override-bg-color="true" custom-class="audio-content">
        <template #default="{ style }">
            <div :style="audioStyle" class="audio-wrapper">
                <!-- 隐藏的原生音频元素 -->
                <audio
                    ref="audioRef"
                    :src="props.src"
                    :controls="false"
                    :autoplay="props.autoplay"
                    :loop="props.loop"
                    :muted="props.muted"
                    :preload="props.preload"
                    style="display: none"
                />

                <!-- 音频播放器UI -->
                <div v-if="props.src" :style="playerStyle" class="audio-player">
                    <!-- 播放/暂停按钮 -->
                    <div
                        :style="playButtonStyle"
                        class="play-button"
                        @click="togglePlayPause"
                        @mouseover="
                            (e) => {
                                const target = e.target as HTMLElement;
                                if (target) {
                                    target.style.opacity = '0.9';
                                }
                            }
                        "
                        @mouseleave="
                            (e) => {
                                const target = e.target as HTMLElement;
                                if (target) {
                                    target.style.opacity = '1';
                                }
                            }
                        "
                    >
                        <UIcon :name="playIconName" class="h-5 w-5" />
                    </div>

                    <!-- 音频信息 -->
                    <div v-if="props.showInfo" :style="infoStyle" class="audio-info">
                        <div v-if="props.title" :style="titleStyle" class="audio-title">
                            {{ props.title }}
                        </div>
                        <div v-if="props.artist" :style="artistStyle" class="audio-artist">
                            {{ props.artist }}
                        </div>
                    </div>

                    <!-- 进度条和时间 -->
                    <div
                        class="audio-controls"
                        style="flex: 1; display: flex; align-items: center; gap: 8px"
                    >
                        <!-- 当前时间 -->
                        <div :style="timeStyle" class="current-time">
                            {{ formatTime(currentTime) }}
                        </div>

                        <!-- 进度条 -->
                        <div
                            :style="progressStyle"
                            class="progress-bar"
                            @click="handleProgressClick"
                        >
                            <div :style="progressFillStyle" class="progress-fill" />
                        </div>

                        <!-- 总时长 -->
                        <div :style="timeStyle" class="duration">
                            {{ formatTime(duration) }}
                        </div>
                    </div>
                </div>

                <!-- 无音频占位 -->
                <div
                    v-else
                    class="audio-placeholder"
                    style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 80px;
                        color: #9ca3af;
                    "
                >
                    <div style="text-align: center">
                        <UIcon name="i-heroicons-musical-note" class="mx-auto mb-2 h-8 w-8" />
                        <div style="font-size: 12px">请选择音频文件</div>
                    </div>
                </div>
            </div>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.audio-content {
    .audio-wrapper {
        transition: all 0.2s ease;
        width: 100%;
        box-sizing: border-box;
    }

    .audio-player {
        width: 100%;
    }

    .play-button {
        &:hover {
            transform: scale(1.05);
        }

        &:active {
            transform: scale(0.95);
        }
    }

    .progress-bar {
        &:hover {
            .progress-fill {
                opacity: 0.8;
            }
        }
    }

    .audio-info {
        overflow: hidden;
    }

    .audio-title,
    .audio-artist {
        margin: 0;
    }
}
</style>
