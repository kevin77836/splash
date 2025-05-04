<template>
    <div class="main-container">
        <div class="main-section">
            <div v-if="loadComplete && !isStarted" class="startButton" @click="clickStart">
                Start
            </div>
      
            <h1 :class="{'hidden': isHidden}" class="company-name">
            <span class="front-name">
            Splash
            </span>
            <span class="back-name">
            DigiLab
                </span>
            </h1>
        </div>
        <div v-if="isStarted" class="section section2">
        </div>
        <div v-if="isStarted" class="section section3">
        </div>
        <div v-if="isStarted" class="section section4">
        </div>
        <div v-if="isStarted" class="section section5">
        </div>
        <div v-if="isStarted" class="section section6">
        </div>
        <div v-if="isStarted" class="section section7">
        </div>
        <div v-if="isStarted" class="section section8">
        </div>
        <div v-if="isStarted" class="section section9">
        </div>
        <div v-if="isStarted" class="section section10">
        </div>
        <div v-if="isStarted" class="section section11">
        </div>
        <div v-if="isStarted" class="section section12">
        </div>
        <div v-if="isStarted" class="section section13">
        </div>
        <div v-if="isStarted" class="section section14">
        </div>
        <div v-if="isStarted" class="section section15">
        </div>
        <div v-if="isStarted" class="section section16">
        </div>
    </div>
    <Splash
    ref="splashRef" 
    @resourcesLoaded="handleResourcesLoaded"
    @stateChange="handleStateChange"
    @animationComplete="handleAnimationComplete"
    />
    <div :class="{'active': isStarted}" class="l-header">
        <div class="desktop-group">
            <div class="header-link">
                About Us
            </div>
            <div class="header-saparator"></div>
            <div class="header-link">
                Our Works
            </div>
            <div class="header-saparator"></div>
            <div class="header-link">
                Contact Us
            </div>
        </div>

        <!-- 漢堡選單按鈕 -->
        <div class="mobile-group">
            <div>Splash DigiLab</div>
            <div class="header-saparator"></div>
            <div class="hamburger-menu" @click="toggleMenu">
                <div :class="{'open': isMenuOpen}" class="hamburger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
        <!-- 行動裝置選單 -->
        <div :class="{'active': isMenuOpen}" class="mobile-menu">
            <div class="menu-item" @click="toggleMenu">
                About Us
            </div>
            <div class="menu-item" @click="toggleMenu">
                Our Works
            </div>
            <div class="menu-item" @click="toggleMenu">
                Contact Us
            </div>
        </div>
    </div>
    

    <div :class="{'active': isStarted}" class="l-footer">
        <div class="footer-saparator"></div>
        <div class="footer-link">
            Let's Make a Splash
        </div>
        <div class="footer-saparator"></div>
    </div>
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
    import { useWindowSize } from '@vueuse/core'
    const { width, height } = useWindowSize();
    
    // 註冊 ScrollTrigger 插件
    if (process.client) {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    const splashRef = ref(null);
    const loadComplete = ref(false);
    const currentState = ref('idle');
    const isAutoPlaying = ref(false);
    const isStarted = ref(false);
    const isHidden = ref(true);
    const isMenuOpen = ref(false);
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
                        onEnter: () => {
                            stopAutoPlay();
                            isHidden.value = true;
                        },
                        onLeaveBack: () => {
                            startAutoPlay();
                            isHidden.value = false;
                        },
                    },
                    {
                        trigger: '.section3',
                        start: 'center center',
                        endTrigger: '.section6',
                        end: 'center center',
                        markers: false,
                        scrub: 2,
                        onUpdate: (self) => {
                            updatePosition(0, 0, 0, 0, -5, 0, self.progress);
                        }
                    },
                    {
                        trigger: '.section6',
                        start: 'center center',
                        end: 'center center',
                        markers: false,
                        onEnter: () => growingFunction(),
                        onLeaveBack: () => shrinkingFunction(),
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

    const updatePosition = (fromX, fromY, fromZ, toX, toY, toZ, progress) => {
        if (splashRef.value) {
            const x = (toX - fromX) * progress;
            const y = (toY - fromY) * progress;
            const z = (toZ - fromZ) * progress;
            const offsetX = fromX + x;
            const offsetY = fromY + y;
            const offsetZ = fromZ + z;
            splashRef.value.updatePosition(offsetX, offsetY, offsetZ);
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
        isHidden.value = false;
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
    
    // 切換漢堡選單
    const toggleMenu = () => {
        isMenuOpen.value = !isMenuOpen.value;
        // 當選單打開時禁止滾動
        if (isMenuOpen.value) {
            document.body.style.overflow = 'hidden';
        } else {
            // 如果已經開始，則恢復滾動
            if (isStarted.value) {
                document.body.style.overflow = 'auto';
            }
        }
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