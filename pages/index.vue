<template>
    <div class="main-container">
        <div class="main-section">
            <div v-if="loadComplete && !isStarted" class="startButton" @click="clickStart">
                Start
            </div>
      
            <h1 :class="{'start': isStarted}" class="company-name">
            <span class="front-name">
            Splash
            </span>
            <span class="back-name">
            DigiLab
                </span>
            </h1>
        </div>
        <div v-if="isStarted" class="section section2">
            <h2>section2</h2>
        </div>
        <div v-if="isStarted" class="section section3">
            <h2>section3</h2>
        </div>
        <div v-if="isStarted" class="section section4">
            <h2>section4</h2>
        </div>
        <div v-if="isStarted" class="section section5">
            <h2>section5</h2>
        </div>
        <div v-if="isStarted" class="section section6">
            <h2>section6</h2>
        </div>
        <div v-if="isStarted" class="section section7">
            <h2>section7</h2>
        </div>
        <div v-if="isStarted" class="section section8">
            <h2>section8</h2>
        </div>
        <div v-if="isStarted" class="section section9">
            <h2>section9</h2>
        </div>
        <div v-if="isStarted" class="section section10">
            <h2>section10</h2>
        </div>
        <div v-if="isStarted" class="section section11">
            <h2>section11</h2>
        </div>
        <div v-if="isStarted" class="section section12">
            <h2>section12</h2>
        </div>
        <div v-if="isStarted" class="section section13">
            <h2>section13</h2>
        </div>
        <div v-if="isStarted" class="section section14">
            <h2>section14</h2>
        </div>
        <div v-if="isStarted" class="section section15">
            <h2>section15</h2>
        </div>
        <div v-if="isStarted" class="section section16">
            <h2>section16</h2>
        </div>
    </div>
    <Splash
    ref="splashRef" 
    :isStarted="isStarted"
    @resourcesLoaded="handleResourcesLoaded"
    @stateChange="handleStateChange"
    @animationComplete="handleAnimationComplete"
    />
        <!-- <div class="button-group">
        <button @click="growingFunction">開始生長</button>
        <button @click="shrinkingFunction">開始收合</button>
        <button @click="startAutoPlay">開始自動播放</button>
        <button @click="stopAutoPlay">停止自動播放</button>
        <div class="status">狀態: {{ currentState }}</div>
        <div class="status">資源狀態: {{ loadComplete ? '已載入' : '載入中' }}</div>
        <div class="status">自動播放: {{ isAutoPlaying ? '進行中' : '停止' }}</div>
        </div> -->
</template>
<script setup>
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    
    // 註冊 ScrollTrigger 插件
    if (process.client) {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    const splashRef = ref(null);
    const loadComplete = ref(false);
    const currentState = ref('idle');
    const isAutoPlaying = ref(false);
    const isStarted = ref(false);
    let autoPlayTimer = null;
    
    
    // 設置 ScrollTrigger 動畫
    const setupScrollAnimations = () => {
        // 確保所有區塊已經渲染
        if (process.client) {
            nextTick(() => {
                // 定義所有區塊的配置
                const sectionConfigs = [
                    {
                        trigger: '.section2',
                        start: 'top 80%',
                        markers: false,
                        onEnter: () => stopAutoPlay(),
                        onLeaveBack: () => startAutoPlay(),
                    },
                    {
                        trigger: '.section2',
                        start: 'top 80%',
                        endTrigger: '.section5',
                        end: 'bottom 80%',
                        markers: true,
                        scrub: 2,
                        onEnter: () => stopAutoPlay(),
                        onLeaveBack: () => startAutoPlay(),
                        onUpdate: (self) => {
                            updatePositionFromScroll(0, 0, 0, 0, -5, 0, self.progress);
                        }
                    },
                    {
                        trigger: '.section6',
                        start: 'center 80%',
                        end: 'bottom top',
                        markers: false,
                        scrub: 2,
                        onEnter: () => growingFunction(),
                        onLeaveBack: () => shrinkingFunction(),
                        onUpdate: (self) => {
                            updatePositionFromScroll(0, -5, 0, 20, 0, -30, self.progress);
                        }
                    },
                    {
                        trigger: '.section10',
                        start: 'center center',
                        markers: false,
                        onEnter: () => shrinkingFunction(),
                        onLeaveBack: () => growingFunction()
                    },
                    {
                        trigger: '.section11',
                        start: 'center center',
                        markers: false,
                        onEnter: () => growingFunction(),
                        onLeaveBack: () => shrinkingFunction()
                    },
                    {
                        trigger: '.section12',
                        start: 'center center',
                        markers: false,
                        onEnter: () => shrinkingFunction(),
                        onLeaveBack: () => growingFunction()
                    },
                    {
                        trigger: '.section13',
                        start: 'center center',
                        end: 'bottom top',
                        scrub: 1,
                        markers: false,
                        onEnter: () => growingFunction(),
                        onLeaveBack: () => shrinkingFunction(),
                    },
                    {
                        trigger: '.section14',
                        start: 'center center',
                        end: 'bottom top',
                        scrub: 1,
                        markers: false,
                        onEnter: () => shrinkingFunction(),
                        onLeaveBack: () => growingFunction(),
                    },
                    {
                        trigger: '.section15',
                        start: 'center center',
                        markers: false,
                        onEnter: () => growingFunction(),
                        onLeaveBack: () => shrinkingFunction()
                    }
                ];
                
                // 為每個配置創建相應的 ScrollTrigger
                sectionConfigs.forEach(config => {
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: config.trigger,
                            start: config.start,
                            end: config.end,
                            endTrigger: config.endTrigger,
                            scrub: config.scrub,
                            markers: config.markers,
                            onEnter: config.onEnter,
                            onLeaveBack: config.onLeaveBack,
                            onUpdate: config.onUpdate
                        }
                    });
                });
            });
        
        }

    };

    const updatePositionFromScroll = (fromX, fromY, fromZ, toX, toY, toZ, progress) => {
        if (splashRef.value) {
            const x = (toX - fromX) * progress;
            const y = (toY - fromY) * progress;
            const z = (toZ - fromZ) * progress;
            const offsetX = fromX + x;
            const offsetY = fromY + y;
            const offsetZ = fromZ + z;
            splashRef.value.updatePositionFromScroll(offsetX, offsetY, offsetZ);
        }
    }
    
    // 基本動畫控制函數
    const growingFunction = () => {
        if (splashRef.value) {
        splashRef.value.startGrowingAnimation();
        }
    }
    
    const shrinkingFunction = () => {
        if (splashRef.value) {
        splashRef.value.startShrinkingAnimation();
        }
    }
    
    // 處理資源載入完成事件
    const handleResourcesLoaded = () => {
        loadComplete.value = true;
    }
    
    // 處理狀態變化
    const handleStateChange = (state) => {
        currentState.value = state;
    }
    
    // 處理動畫完成事件
    const handleAnimationComplete = (animationType) => {
        if (!isAutoPlaying.value) return;
        
        if (animationType === 'growing') {
        // 生長動畫完成，等待1秒後開始收縮
        autoPlayTimer = setTimeout(() => {
            shrinkingFunction();
        }, 1000);
        } else if (animationType === 'shrinking') {
        // 收縮動畫完成，等待2秒後開始生長
        autoPlayTimer = setTimeout(() => {
            growingFunction();
        }, 2000);
        }
    }
    
    const clickStart = () => {
        isStarted.value = true;
        startAutoPlay();
        splashRef.value.addMouseControlEvents();
        
        // 設置滾動動畫
        setupScrollAnimations();
        
        // 啟用頁面滾動
        document.body.style.overflow = 'auto';
    }
    
    // 開始自動播放
    const startAutoPlay = () => {
        if (isAutoPlaying.value) return; // 如果已經在播放則不執行
        isAutoPlaying.value = true;
        
        // 從生長動畫開始
        growingFunction();
    }
    
    // 停止自動播放
    const stopAutoPlay = () => {
        isAutoPlaying.value = false;
        
        // 清除任何待執行的定時器
        if (autoPlayTimer) {
            clearTimeout(autoPlayTimer);
            autoPlayTimer = null;
        }
        
        // 執行收合動畫，使其回到起點
        shrinkingFunction();
    }
    
    onMounted(() => {
        document.body.style.overflow = 'hidden';
    });
    // 組件卸載時清理
    onUnmounted(() => {
        if (autoPlayTimer) {
            clearTimeout(autoPlayTimer);
        }
        isAutoPlaying.value = false;
        
        // 清理所有 ScrollTrigger 實例
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    });
</script>