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
      
            <!-- <h1 :class="{'hidden': !isLandingPage || (isLandingPage && !isStarted)}" class="company-name">
            <span class="front-name">
            Splash
            </span>
            <span class="back-name">
            DigiLab
                </span>
            </h1> -->
        </div>
        <div v-if="isStarted" class="section gap-section"></div>
        <div v-if="isStarted" class="section aboutUs-section">
            <div class="aboutUs-marquee">
                <div class="aboutUs-marquee-content-group">
                    <span class="aboutUs-marquee-content-group-item">Splash DigiLab</span>
                    <span class="aboutUs-marquee-content-group-item">Splash DigiLab</span>
                    <span class="aboutUs-marquee-content-group-item">Splash DigiLab</span>
                    <span class="aboutUs-marquee-content-group-item">Splash DigiLab</span>
                </div>
                <div class="aboutUs-marquee-content-group2">
                    <span class="aboutUs-marquee-content-group-item">Splash DigiLab</span>
                    <span class="aboutUs-marquee-content-group-item">Splash DigiLab</span>
                    <span class="aboutUs-marquee-content-group-item">Splash DigiLab</span>
                    <span class="aboutUs-marquee-content-group-item">Splash DigiLab</span>
                </div>
            </div>
            <div class="aboutUs-content-container">
                <div class="aboutUs-content-group">
                    <div class="aboutUs-section-content aboutUs-section-content-1">
                        <span class="aboutUs-section-content-1-1">Splash DigiLab</span>
                        <span class="aboutUs-section-content-1-2">如水花迸濺的創意</span>
                    </div>
                    <div class="aboutUs-section-content aboutUs-section-content-2">
                        <span class="aboutUs-section-content-2-1">結合</span>
                        <span class="aboutUs-section-content-2-2">
                            <div class="service-group">
                                <div class="service-group-item">XR策展</div>
                                <div class="service-group-item">互動設計</div>
                                <div class="service-group-item">數位藝術</div>
                                <div class="service-group-item">網頁開發</div>
                                <div class="service-group-item">AR/VR</div>
                                <div class="service-group-item">UI/UX</div>
                                <div class="service-group-item">2D/3D動畫</div>
                                <div class="service-group-item">平面設計</div>
                                <div class="service-group-item">CIS</div>
                            </div>
                        </span>
                    </div>
                    <div class="aboutUs-section-content aboutUs-section-content-3">
                        <div class="section-content-3-group">
                            <span class="aboutUs-section-content-3-1">呈現</span>
                            <span class="aboutUs-section-content-3-2">素晴らしい</span>
                        </div>
                        <span class="aboutUs-section-content-3-3">的極致體驗</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isStarted" class="section works-section">
            <div class="works-content-container">
                <a href="#" class="works-content-item works-content-item-15">
                    <img src="/works/works15.webp" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-14">
                    <img src="/works/works14.webp" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-13">
                    <img src="/works/works13.webp" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-12">
                    <img src="/works/works12.webp" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-11">
                    <img src="/works/works11.webp" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-10">
                    <img src="/works/works10.webp" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-9">
                    <img src="/works/works9.webp" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-8">
                    <img src="/works/works8.webp" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-7">
                    <img src="/works/works7.webp" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-6">
                    <img src="/works/works6.webp" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-5">
                    <img src="/works/works5.webp" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-4">
                    <img src="/works/works4.webp" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-3">
                    <img src="/works/works3.webp" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-2">
                    <img src="/works/works2.webp" alt="">
                </a>
                <a href="#" class="works-content-item works-content-item-1">
                    <img src="/works/works1.webp" alt="">
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
    import { CustomEase } from 'gsap/CustomEase';
    import { useWindowSize } from '@vueuse/core'
    const { width, height } = useWindowSize();
    
    // 註冊 ScrollTrigger 和 CustomEase 插件
    if (process.client) {
        gsap.registerPlugin(ScrollTrigger, CustomEase);
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
                        end: 'center bottom',
                        scrub: 2,
                        markers: false,
                        onUpdate: (self) => {
                            updatePosition(0, 0, 0, 0, -15, 0, self.progress);
                        },
                        onEnter: () => startServiceMarquee(),
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
                        scrub: 1.5,
                        markers: false,
                        onUpdate: (self) => {
                            updatePosition(0, -1, 30, 0, 0, 0, self.progress);
                        },
                        onLeaveBack: () => {
                            updatePosition(0, -15, 0)
                        }
                    },    
                });
                
                const aboutUsContentTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.aboutUs-section',
                        start: '5% 80%',
                        end: '65% 70%',
                        scrub: 1.5,
                        markers: false
                    }
                });
                aboutUsContentTimeline
                    .to('.aboutUs-section-content-1-1', { opacity: 1, filter: 'blur(0px)', duration: 0.1 }, 0)
                    .to('.aboutUs-section-content-1-2', { opacity: 1, filter: 'blur(0px)', duration: 0.1 }, 0.1)
                    .to('.aboutUs-section-content-2-1', { opacity: 1, filter: 'blur(0px)', duration: 0.1 }, 0.2)
                    .to('.aboutUs-section-content-2-2', { opacity: 1, filter: 'blur(0px)', duration: 0.1 }, 0.3)
                    .to('.aboutUs-section-content-3-1', { opacity: 1, filter: 'blur(0px)', duration: 0.1 }, 0.4)
                    .to('.aboutUs-section-content-3-2', { opacity: 1, filter: 'blur(0px)', duration: 0.1 }, 0.5)
                    .to('.aboutUs-section-content-3-3', { opacity: 1, filter: 'blur(0px)', duration: 0.1 }, 0.6);
                
                gsap.to('.aboutUs-content-group', {
                    scrollTrigger: {
                        trigger: '.aboutUs-section',
                        start: '70% 80%',
                        end: 'bottom bottom',
                        scrub: 0.5, // 更平滑的過渡
                        markers: false,
                        pin: false, // 不固定元素
                        anticipatePin: 1, // 提前準備固定效果
                        fastScrollEnd: true, // 快速滾動時仍完成動畫
                        preventOverlaps: true, // 防止重疊
                    },
                    // 優化變換方式：使用多重變換而非單一 scale
                    // 使用 matrix3d 變換以獲得更高效能和更好的像素控制
                    // 分解 3D 變換可減少瀏覽器渲染計算負擔
                    transform: 'matrix3d(5, 0, 0, 0, 0, 5, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1)',
                    opacity: 0,
                    ease: 'power1.inOut', // 使用更平滑的緩動函數
                    force3D: true, // 強制使用 3D 變換以啟用 GPU 加速
                    overwrite: 'auto', // 自動處理覆蓋問題
                    clearProps: 'transform', // 動畫完成後清除屬性
                });

                const itemCount = 15; // 元素總數
                const totalDistance = 300; // 元素移動的總直線距離
                const zDistance = 6000; // Z軸最大移動距離
                const baseStartPercent = 0; // 起始滾動百分比
                const opacityDuration = 2; // 每個元素透明度動畫的滾動百分比
                const moveDuration = 25; // 每個元素位移動畫的滾動百分比
                const delayBetweenItems = 5; // 元素之間的延遲百分比
                
                // 使用種子算法生成固定的隨機角度集合
                // 這確保每次頁面加載時元素方向一致
                const generateRandomAngles = (count) => {
                    const angles = [];
                    for (let i = 0; i < count; i++) {
                        // 使用數學函數生成偽隨機數
                        const seed = Math.sin(i * 97.123) * 10000;
                        const random = Math.abs(seed - Math.floor(seed));
                        angles.push(random * 360); // 轉換為0-360度的角度
                    }
                    return angles;
                };
                
                // 預先生成所有角度
                const randomAngles = generateRandomAngles(itemCount);
                
                // 建立單一時間軸來管理所有作品項目的動畫
                // 這樣可以在一個 ScrollTrigger 中處理所有動畫
                const worksTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.works-section',
                        start: '0% top', // 從頁面頂部開始
                        end: `${baseStartPercent + (itemCount-1) * delayBetweenItems + moveDuration}% center`, // 動態計算結束點
                        scrub: 1.5, // 平滑的滾動效果
                        markers: false,
                    }
                });
                
                // 為每個作品項目添加動畫
                for (let i = 1; i <= itemCount; i++) {
                    // 計算此元素在滾動過程中的延遲
                    const itemDelay = (i - 1) * delayBetweenItems;
                    
                    // 根據預生成的角度計算方向
                    const randomAngle = randomAngles[i-1];
                    const rad = randomAngle * Math.PI / 180; // 轉換為弧度
                    
                    // 計算 x 和 y 坐標，形成放射狀分布
                    const x = Math.round(totalDistance * Math.cos(rad));
                    const y = Math.round(totalDistance * Math.sin(rad));
                    
                    // Z軸偏移計算，添加隨機變化
                    // const zOffset = Math.round(zDistance * (0.8 + (i % 5) * zVariation / 5));
                    
                    // 計算動畫開始的相對位置
                    // 這決定了每個元素何時開始動畫
                    const startPosition = itemDelay / (moveDuration + (itemCount-1) * delayBetweenItems);
                    
                    // 添加到同一時間軸，使用相對位置控制時序
                    // 首先控制透明度變化
                    worksTimeline.to(`.works-content-item-${i}`, { 
                        opacity: 1, // 從透明變為完全不透明
                        duration: opacityDuration / moveDuration, // 計算相對持續時間
                        ease: 'none' // 線性變化
                    }, startPosition);
                    
                    // 然後控制位置變化（同時進行）
                    worksTimeline.to(`.works-content-item-${i}`, {
                        '--transform-x': x, // CSS變量控制X軸位置
                        '--transform-y': y, // CSS變量控制Y軸位置
                        '--transform-z': zDistance, // CSS變量控制Z軸位置
                        ease: 'power2.in', // 使用power2.in緩動函數
                        duration: 1 // 相對持續時間
                    }, startPosition); // 與透明度動畫同時開始
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
        
        // if (splashRef.value) {
        //     splashRef.value.updatePosition(0, 0, 10);
        // }
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
    
        // 創建自定義緩動
        // const customEasing = CustomEase.create("custom", "M0,0 C0,0 0.015,1 1,1 ");
        
        // gsap.to({
        //     x: 0,
        //     y: 0,
        //     z: 20
        // }, {
        //     x: 0,
        //     y: 0,
        //     z: 0,
        //     duration: 1,
        //     ease: customEasing, // 使用自定義緩動
        //     onUpdate: function() {
        //         // 動畫每一幀更新場景位置
        //         if (splashRef.value) {
        //             splashRef.value.updatePosition(this.targets()[0].x, this.targets()[0].y, this.targets()[0].z);
        //         }
        //     }
        // });
        
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
    
    // 服務項目跑馬燈效果
    let serviceMarqueeInterval = null;
    const startServiceMarquee = () => {
        if(serviceMarqueeInterval) return;
        const items = document.querySelectorAll('.service-group-item');
        if (items.length === 0) return;
        
        let currentIndex = 0;
        
        items[0].classList.add('active');
        
        serviceMarqueeInterval = setInterval(() => {
            items[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % items.length;
            
            // 顯示新的當前項目
            items[currentIndex].classList.add('active');
        }, 1000); // 每個項目顯示 1 秒
    };

    onMounted(() => {
        document.body.style.overflow = 'hidden';
    });
    // 組件卸載時清理
    onUnmounted(() => {
        if (autoPlayTimer) {
            clearTimeout(autoPlayTimer);
        }
        if (serviceMarqueeInterval) {
            clearInterval(serviceMarqueeInterval);
        }
        isAutoPlaying.value = false;
        
        // 清理所有 ScrollTrigger 實例
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    });
</script>