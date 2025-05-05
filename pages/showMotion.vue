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
                AR/VR
            </div>
            <div class="header-saparator">
                <div class="header-saparator-line"></div>
            </div>
            <div class="header-link">
                Animation
            </div>
            <div class="header-saparator">
                <div class="header-saparator-line"></div>
            </div>
            <div class="header-link">
                UI/UX
            </div>
        </div>
    </div>
    <div :class="{'active': isStarted}" class="l-footer">
        <div class="desktop-group">
            <div class="footer-link">
                Web Development
            </div>
            <div class="footer-saparator">
                <div class="footer-saparator-line"></div>
            </div>
            <div class="footer-link">
                CIS
            </div>
            <div class="footer-saparator">
                <div class="footer-saparator-line"></div>
            </div>
            <div class="footer-link">
                Graphic Design
            </div>
        </div>
    </div>
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

    function handleKeyup(e) {
        clickStart();
    }
    
    const splashRef = ref(null);
    const loadComplete = ref(false);
    const currentState = ref('idle');
    const isAutoPlaying = ref(false);
    const isStarted = ref(false);
    const isHidden = ref(true);
    const isMenuOpen = ref(false);
    const isLandingPage = ref(true);
    let autoPlayTimer = null;
    

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
        isHidden.value = false;
        startAutoPlay();
        splashRef.value.addMouseControlEvents();
        
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
        window.addEventListener('keyup', handleKeyup);
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