<template>
    <Splash
        ref="splashRef" 
        @resourcesLoaded="handleResourcesLoaded"
        @stateChange="handleStateChange"
        @animationComplete="handleAnimationComplete"
    />
    <div :class="{'active': isStarted}" class="l-header">
        <div class="desktop-group">
            <div class="header-link" :class="{'hidden': isLandingPage}">
                Splash DigiLab
            </div>
            <div class="header-saparator" :class="{'hidden': isLandingPage}">
                <div class="header-saparator-line"></div>
            </div>
            <div class="header-link" @click="scrollToSection('aboutUs-section')">
                About Us
            </div>
            <div class="header-saparator" :class="{'hidden': !isLandingPage}">
                <div class="header-saparator-line"></div>
            </div>
            <div class="header-link" @click="scrollToSection('works-section')">
                Works
            </div>
            <div class="header-saparator" :class="{'hidden': !isLandingPage}">
                <div class="header-saparator-line"></div>
            </div>
            <div class="header-link" @click="scrollToSection('Services-section')">
                Services
            </div>
            <div class="header-saparator" :class="{'hidden': !isLandingPage}">
                <div class="header-saparator-line"></div>
            </div>
            <div class="header-link" @click="scrollToSection('contactUs-section')">
                Contact Us
            </div>
        </div>

        <!-- 漢堡選單按鈕 -->
        <div class="mobile-group">
            <div class="header-link" :class="{'hidden': isLandingPage}">Splash DigiLab</div>
            <div class="header-saparator">
                <div class="header-saparator-line"></div>
            </div>
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
            <div class="menu-item" @click="scrollToSection('aboutUs-section', true)">
                About Us
            </div>
            <div class="menu-item" @click="scrollToSection('works-section', true)">
                Works
            </div>
            <div class="menu-item" @click="scrollToSection('services-section', true)">
                Services
            </div>
            <div class="menu-item" @click="scrollToSection('contactUs-section', true)">
                Contact Us
            </div>
        </div>
    </div>
    <div :class="{'active': isStarted && isLandingPage}" class="l-footer">
        <div class="desktop-group">
            <div class="footer-saparator">
                <div class="footer-saparator-line"></div>
            </div>
            <div class="footer-link">
                Let's Make a Splash
            </div>
            <div class="footer-saparator">
                <div class="footer-saparator-line"></div>
            </div>
        </div>        
    </div>
    <div class="main-container">
        <div class="section main-section">
            <div v-if="loadComplete && !isStarted" class="startButton" @click="clickStart">
                Start
            </div>
      
            <h1 :class="{'hidden': !isLandingPage || (isLandingPage && !isStarted)}" class="company-name">
            <!-- <span class="front-name">
            Splash
            </span>
            <span class="back-name">
            DigiLab
                </span> -->
            </h1>
        </div>
        <div v-if="isStarted" class="section gap-section"></div>
        <div v-if="isStarted" class="section aboutUs-section">
            <div class="aboutUs-marquee">
                <div class="aboutUs-marquee-content-group">
                    <span class="aboutUs-marquee-content-group-item">Splash DigiLab</span>
                    <span class="aboutUs-marquee-content-group-item">斯巴拉系數位互動</span>
                    <span class="aboutUs-marquee-content-group-item">素晴らしいデジタルインタラクション</span>
                </div>
                <div class="aboutUs-marquee-content-group2">
                    <span class="aboutUs-marquee-content-group-item">Splash DigiLab</span>
                    <span class="aboutUs-marquee-content-group-item">斯巴拉系數位互動</span>
                    <span class="aboutUs-marquee-content-group-item">素晴らしいデジタルインタラクション</span>
                </div>
            </div>
            <div class="aboutUs-content-container">
                <div class="aboutUs-content-group">
                    <div class="aboutUs-section-content aboutUs-section-content-1">
                        <span class="aboutUs-section-content-1-1">123</span>
                        <span class="aboutUs-section-content-1-2">456</span>
                    </div>
                    <div class="aboutUs-section-content aboutUs-section-content-2">
                        <span class="aboutUs-section-content-2-1">789</span>
                        <span class="aboutUs-section-content-2-2">012</span>
                    </div>
                    <div class="aboutUs-section-content aboutUs-section-content-3">
                        <span class="aboutUs-section-content-3-1">345</span>
                        <span class="aboutUs-section-content-3-2">678</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isStarted" class="section works-section">
            <div class="works-content-container">
                <a href="#" class="works-content-item works-content-item-15">
                    <img src="/works/works15.png" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-14">
                    <img src="/works/works14.png" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-13">
                    <img src="/works/works13.png" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-12">
                    <img src="/works/works12.jpg" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-11">
                    <img src="/works/works11.png" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-10">
                    <img src="/works/works10.png" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-9">
                    <img src="/works/works9.png" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-8">
                    <img src="/works/works8.jpg" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-7">
                    <img src="/works/works7.png" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-6">
                    <img src="/works/works6.png" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-5">
                    <img src="/works/works5.png" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-4">
                    <img src="/works/works4.jpg" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-3">
                    <img src="/works/works3.jpg" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-2">
                    <img src="/works/works2.png" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-1">
                    <img src="/works/works1.jpg" alt="">
                </a>
            </div> 
        </div>
        <div v-if="isStarted" class="section services-section">
        </div>
        <div v-if="isStarted" class="section contactUs-section">
        </div>
    </div>
    

        <!-- <div class="button-group" style="top: 1rem; position: fixed;">
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
    const isMenuOpen = ref(false);
    const isLandingPage = ref(true);
    let autoPlayTimer = null;

    // 設置 ScrollTrigger 動畫
    const setupScrollAnimations = () => {
        // 確保所有區塊已經渲染
        if (process.client) {
            nextTick(() => {
                // 定義所有區塊的配置
                //         updatePosition(0, 0, 0, 0, -5, 0, self.progress);
                gsap.timeline({
                    scrollTrigger: {
                        trigger: '.gap-section',
                        start: '5% 80%',
                        markers: false,
                        onEnter: () => {
                            stopAutoPlay();
                            animateTextToOrigin();
                            isLandingPage.value = false;
                        },
                        onLeaveBack: () => {
                            startAutoPlay();
                            animateTextToTargetPosition();
                            isLandingPage.value = true;
                        },
                    },              
                });
                gsap.timeline({
                    scrollTrigger: {
                        trigger: '.aboutUs-section',
                        start: 'top bottom',
                        end: 'bottom bottom',
                        scrub: 2,
                        markers: false,
                        onUpdate: (self) => {
                            updatePosition(0, 0, 0, 0, -20, 0, self.progress);
                        },
                    },              
                });
                gsap.timeline({
                    scrollTrigger: {
                        trigger: '.works-section',
                        start: 'top top',
                        onEnter: () => startAutoPlay(),
                        onLeaveBack: () => stopAutoPlay(),
                    },              
                });
                gsap.timeline({
                    scrollTrigger: {
                        trigger: '.works-section',
                        start: 'top bottom',
                        end: '5% center',
                        scrub: 2,
                        markers: false,
                        onUpdate: (self) => {
                            updatePosition(0, -20, 0, 0, 0, 0, self.progress);
                        },
                    },              
                });
                gsap.to('.aboutUs-section-content-1-1', {
                    scrollTrigger: {
                      trigger: '.aboutUs-section',
                      start: '5% 80%',
                      end: '10% 80%',
                      scrub: 2,
                    },
                    opacity: 1,
                    filter: 'blur(0px)',
                    ease: 'none'
                });
                gsap.to('.aboutUs-section-content-1-2', {
                    scrollTrigger: {
                      trigger: '.aboutUs-section',
                      start: '15% 80%',
                      end: '20% 80%',
                      scrub: 2,
                    },
                    opacity: 1,
                    filter: 'blur(0px)',
                    ease: 'none'
                });
                gsap.to('.aboutUs-section-content-2-1', {
                    scrollTrigger: {
                      trigger: '.aboutUs-section',
                      start: '25% 80%',
                      end: '30% 80%',
                      scrub: 2,
                    },
                    opacity: 1,
                    filter: 'blur(0px)',
                    ease: 'none'
                });
                gsap.to('.aboutUs-section-content-2-2', {
                    scrollTrigger: {
                      trigger: '.aboutUs-section',
                      start: '35% 80%',
                      end: '40% 80%',
                      scrub: 2,
                    },
                    opacity: 1,
                    filter: 'blur(0px)',
                    ease: 'none'
                });
                gsap.to('.aboutUs-section-content-3-1', {
                    scrollTrigger: {
                      trigger: '.aboutUs-section',
                      start: '45% 80%',
                      end: '50% 80%',
                      scrub: 2,
                    },
                    opacity: 1,
                    filter: 'blur(0px)',
                    ease: 'none'
                });
                gsap.to('.aboutUs-section-content-3-2', {
                    scrollTrigger: {
                      trigger: '.aboutUs-section',
                      start: '55% 80%',
                      end: '60% 80%',
                      scrub: 2,
                    },
                    opacity: 1,
                    filter: 'blur(0px)',
                    ease: 'none'
                });
                gsap.to('.aboutUs-content-group', {
                    scrollTrigger: {
                      trigger: '.aboutUs-section',
                      start: '80% 80%',
                      end: 'bottom bottom',
                      scrub: 0,
                      markers: false,
                    },
                    transform: 'scale(100)',
                    opacity: 0,
                    ease: 'none'
                });

                const itemCount = 15; // 元素總數
                const totalDistance = 500; // 元素移動的總直線距離
                const zDistance = 6000; // Z軸最大移動距離
                const zVariation = 0.2; // Z軸變化範圍（20%）
                const baseStartPercent = 0; // 起始滾動百分比
                const opacityDuration = 2; // 每個元素透明度動畫的滾動百分比
                const moveDuration = 25; // 每個元素位移動畫的滾動百分比
                const delayBetweenItems = 5; // 元素之間的延遲百分比
                
                // 生成一組隨機角度，但每次頁面加載時保持一致
                // 使用 seedrandom 的概念，基於元素索引生成偽隨機角度
                const generateRandomAngles = (count) => {
                    const angles = [];
                    for (let i = 0; i < count; i++) {
                        // 使用質數乘法和正弦函數創造更隨機的分布
                        // 但對於相同的索引，每次都會產生相同的角度
                        const seed = Math.sin(i * 97.123) * 10000;
                        const random = Math.abs(seed - Math.floor(seed));
                        angles.push(random * 360);
                    }
                    return angles;
                };
                
                // 預先生成所有角度
                const randomAngles = generateRandomAngles(itemCount);
                
                // 為每個元素創建動畫
                for (let i = 1; i <= itemCount; i++) {
                    // 計算此元素的延遲
                    const itemDelay = (i - 1) * delayBetweenItems;
                    // 計算透明度動畫的起始和結束點
                    const opacityStart = `${baseStartPercent + itemDelay}% top`;
                    const opacityEnd = `${baseStartPercent + itemDelay + opacityDuration}% top`;
                    // 計算位移動畫的起始和結束點
                    const moveStart = opacityStart;
                    const moveEnd = `${baseStartPercent + itemDelay + moveDuration}% center`;
                    
                    // 取得此元素的預先生成的隨機角度
                    const randomAngle = randomAngles[i-1];
                    
                    // 將角度轉換為弧度
                    const rad = randomAngle * Math.PI / 180;
                    
                    // 計算 x 和 y 坐標，保持直線距離為 totalDistance
                    const x = Math.round(totalDistance * Math.cos(rad));
                    const y = Math.round(totalDistance * Math.sin(rad));
                    
                    // 計算 z 軸偏移（在基準值的基礎上添加一些隨機性）
                    const zOffset = Math.round(zDistance * (0.8 + (i % 5) * zVariation / 5));
                    
                    // 透明度動畫
                    gsap.to(`.works-content-item-${i}`, {
                        scrollTrigger: {
                            trigger: '.works-section',
                            start: opacityStart,
                            end: opacityEnd,
                            scrub: 0,
                            markers: false,
                            toggleActions: 'restart none none reset'
                        },
                        opacity: 1,
                        ease: 'none'
                    });
                    
                    // 位移動畫
                    gsap.to(`.works-content-item-${i}`, {
                        scrollTrigger: {
                            trigger: '.works-section',
                            start: moveStart,
                            end: moveEnd,
                            scrub: 0,
                            markers: false
                        },
                        '--transform-x': x,
                        '--transform-y': y,
                        '--transform-z': zOffset,
                        ease: 'none'
                    });
                }
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

    const animateTextToTargetPosition = () => {
        if (splashRef.value) {
            splashRef.value.animateTextToTargetPosition();
        }
    }

    const animateTextToOrigin = () => {
        if (splashRef.value) {
            splashRef.value.animateTextToOrigin();
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
            }, 0);
        } else if (animationType === 'shrinking') {
            // 收縮動畫完成，等待2秒後開始生長
            autoPlayTimer = setTimeout(() => {
                growingFunction();
            }, 1000);
        }
    }
    
    const clickStart = () => {
        isStarted.value = true;
        startAutoPlay();
        animateTextToTargetPosition();
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
    
    // 滾動到指定區塊
    const scrollToSection = (sectionClass, isFromMobile = false) => {
        // 如果從行動版選單點擊，先關閉選單
        if (isFromMobile) {
            toggleMenu();
        }
        
        // 使用 setTimeout 確保 DOM 已更新
        setTimeout(() => {
            const section = document.querySelector(`.${sectionClass}`);
            if (section) {
                // 使用平滑滾動
                window.scrollTo({
                    top: section.offsetTop,
                    behavior: 'smooth'
                });
            }
        }, 100);
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