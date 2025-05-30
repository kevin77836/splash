<template>
    <Splash
        ref="splashRef" 
        @resourcesLoaded="handleResourcesLoaded"
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
    <!-- <div :class="{'active': isStarted && isLandingPage}" class="l-footer">
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
    </div> -->
    <div class="main-container">
        <div class="section main-section">
            <div v-if="!isStarted" 
                 class="startButton" 
                 @click="clickStart">
                {{ loadingPercent }}
            </div>
      
            <!-- <h1 :class="{'hidden': !isLandingPage || (isLandingPage && !isStarted)}" class="company-name">
            <span class="front-name">
            Splash
            </span>
            <span class="back-name">
            DigiLab
                </span>
            </h1> -->
            <div v-show="isStarted" class="marquee">
                <div class="marquee-content-group">
                    <span class="marquee-content-group-item">AR/VR/XR策展 ・ UIUX/網頁開發 ・ CIS/平面設計 ・ 2D/3D動畫 ・ 互動設計/數位藝術 ・ </span>
                </div>
                <div class="marquee-content-group2">
                    <span class="marquee-content-group-item">AR/VR/XR策展 ・ UIUX/網頁開發 ・ CIS/平面設計 ・ 2D/3D動畫 ・ 互動設計/數位藝術 ・ </span>
                </div>
            </div>
        </div>
        <div v-show="isStarted" class="section aboutUs-section">
            <div class="aboutUs-content-container">
                <div class="aboutUs-content-group">
                    <div class="aboutUs-section-content aboutUs-section-content-1">
                        <span class="aboutUs-section-content-1-1">迸濺的</span>
                        <hr class="aboutUs-section-hr-1" color="black" size="1">
                        <span class="aboutUs-section-content-1-2">創意</span>
                    </div>
                    <div class="aboutUs-section-content aboutUs-section-content-2">
                        <span class="aboutUs-section-content-2-1">結合</span>
                        <span class="aboutUs-section-content-2-2">
                            <div class="service-group">
                                <div v-for="(item,index) in serviceData.slice(1,serviceData.length)" :key="index" class="service-group-item">
                                    {{ item.title }}
                                </div>
                            </div>
                        </span>
                    </div>
                    <div class="aboutUs-section-content aboutUs-section-content-3">
                        <div class="section-content-3-group">
                            <span class="aboutUs-section-content-3-1">呈現</span>
                            <span class="aboutUs-section-content-3-2">
                                <div class="iconGroup">
                                    <span>素晴らしい</span>
                                    <img src="/images/volume.png" alt="">
                                </div>
                                <div class="underline"></div>
                            </span>
                        </div>
                        <span class="aboutUs-section-content-3-3">的體驗</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="isStarted" class="section works-section">
            <div v-if="isStarted" class="works-content-container">
                <div class="works-content-group">
                    <a v-for="(media,index) in reversedMediaResources" :key="'media'+index" href="media.link" :class="`works-content-item works-content-item-${index+1} ${media.column ? 'column' : ''}`">
                        <video v-if="media.type === 'video'" :src="media.src" autoplay muted loop playsinline></video>
                        <img v-else :src="media.src" alt="">
                    </a>
                </div>
            </div> 
        </div>
        <div v-show="isStarted" class="section services-section">
            <div class="services-content-container">
                <div v-for="(item, index) in serviceData" class="services-content" :class="`services-content-${index+1}`" :key="index">
                    <h2 class="services-title">{{ item.title }}</h2>
                    <div class="services-description">
                        {{ item.description }}
                    </div>
                </div>
            </div>
        </div>
        <div v-show="isStarted" class="section contactUs-section">
            <h2 class="contactUs-title">Let's Make a Splash</h2>
        </div>
    </div>
    
        
        <!-- <div class="button-group" style="top: 1rem; position: fixed;">
        <button @click="growingFunction">開始生長</button>
        <button @click="shrinkingFunction">開始收合</button>
        <button @click="startAutoPlay">開始自動播放</button>
        <button @click="stopAutoPlay">停止自動播放</button>
        <div class="status">資源狀態: {{ loadComplete ? '已載入' : '載入中' }}</div>
        <div class="status">自動播放: {{ isAutoPlaying ? '進行中' : '停止' }}</div>
        </div> -->
</template>
<script setup>
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import { CustomEase } from 'gsap/CustomEase';
    import { useWindowSize } from '@vueuse/core'
    import { SplitText } from 'gsap/SplitText';
    const { width, height } = useWindowSize();
    import { isMobileDevice } from '../utils/device';
    if (process.client) {
        gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);
    }
    
    const splashRef = ref(null);
    const loadComplete = ref(false);
    const loadedItems = ref(0);
    const isAutoPlaying = ref(false);
    const isStarted = ref(false);
    const isMenuOpen = ref(false);
    const isLandingPage = ref(true);
    let customEasing;

    const serviceData = ref([
        {
            title: 'Services',
            description: 'Splash DigiLab 結合設計創意與前端開發，擅長跨界沉浸式互動體驗，服務範圍包含 XR 展演策劃、UI/UX 設計、網頁開發、品牌設計、數位藝術、互動設計等。',
            splitTitle: [],
            splitDescription: []
        },
        {
            title: 'AR/VR/XR策展',
            description: '策劃並開發、執行 Web AR/ XR 沉浸式展覽、行銷活動或產品展示，打造虛實整合體驗。',
            splitTitle: [],
            splitDescription: []
        },
        {
            title: 'UIUX/網頁開發',
            description: '從前端網站設計到3D互動前端，整合 Nuxt、Three.js 等技術，實現網頁創新體驗。',
            splitTitle: [],
            splitDescription: []
        },
        {
            title: 'CIS/平面設計',
            description: '提供品牌識別與視覺系統規劃服務，滿足品牌在實體門店到數位體驗中的各式需求。',
            splitTitle: [],
            splitDescription: []
        },
        {
            title: '2D/3D動畫',
            description: '製作 3D 動畫、CGI 與 Web AR 結合的視覺內容，豐富數位敘事層次。',
            splitTitle: [],
            splitDescription: []
        },
        {
            title: '互動設計/數位藝術',
            description: '專注於直覺互動體驗，從動作感應裝置到展覽互動系統，強化體驗參與感。',
            splitTitle: [],
            splitDescription: []
        },
    ])

    // 文字動態特效
    const textAnimation = {
        init() {
            if (process.client) {
                for(let i = 0; i < serviceData.value.length; i++) {
                    // 為標題創建 SplitText
                    const titleElement = document.querySelector(`.services-content-${i+1} .services-title`);
                    if (titleElement) {
                        serviceData.value[i].splitTitle = new SplitText(titleElement, {
                            type: "chars",
                            charsClass: "char"
                        });
                        // 保存原始文字並設置初始可見性
                        serviceData.value[i].splitTitle.chars.forEach(char => {
                            char.dataset.originalText = char.textContent;
                            char.style.visibility = 'hidden';
                            char.textContent = '';
                        });
                    }

                    // 為描述創建 SplitText
                    const descElement = document.querySelector(`.services-content-${i+1} .services-description`);
                    if (descElement) {
                        serviceData.value[i].splitDescription = new SplitText(descElement, {
                            type: "chars",
                            charsClass: "char"
                        });
                        // 保存原始文字並設置初始可見性
                        serviceData.value[i].splitDescription.chars.forEach(char => {
                            char.dataset.originalText = char.textContent;
                            char.style.visibility = 'hidden';
                            char.textContent = '';
                        });
                    }
                }
            }
        },

        getRandomLetter() {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ結合設計創意與前端開發擅長跨界沉浸式互動體驗';
            return letters[Math.floor(Math.random() * letters.length)];
        },

        animate(index) {
            if (!process.client) return;

            const titleChars = serviceData.value[index].splitTitle.chars;
            const descriptionChars = serviceData.value[index].splitDescription.chars;

            // 先將所有字元設為空
            titleChars.forEach(char => {
                char.textContent = '';
                char.style.visibility = 'hidden';
            });
            descriptionChars.forEach(char => {
                char.textContent = '';
                char.style.visibility = 'hidden';
            });

            // 創建標題動畫時間軸
            const titleTimeline = gsap.timeline();

            // 為每個標題字元創建動畫
            titleChars.forEach((char, charIndex) => {
                const charTimeline = gsap.timeline();
                
                // 添加單個字元的動畫到時間軸
                charTimeline
                    .set(char, { visibility: 'visible' }) // 顯示字元
                    .to({}, { 
                        duration: 0.05,
                        onStart: () => {
                            // 開始隨機字動態
                            const randomInterval = setInterval(() => {
                                char.textContent = textAnimation.getRandomLetter();
                            }, 5);

                            // 0.5秒後清除隨機字動態
                            setTimeout(() => {
                                clearInterval(randomInterval);
                                char.textContent = char.dataset.originalText;
                            }, 50);
                        }
                    })

                // 將此字元的動畫添加到主時間軸
                titleTimeline.add(charTimeline, charIndex * 0.05); // 0.6 = 0.5(動畫) + 0.1(延遲)
            });

            // 等標題完成後開始描述文字動畫
            titleTimeline.add(() => {
                const descriptionTimeline = gsap.timeline();

                // 為每個描述字元創建動畫
                descriptionChars.forEach((char, charIndex) => {
                    const charTimeline = gsap.timeline();
                    
                    // 添加單個字元的動畫到時間軸
                    charTimeline
                        .set(char, { visibility: 'visible' }) // 顯示字元
                        .to({}, { 
                            duration: 0.02,
                            onStart: () => {
                                // 開始隨機字動態
                                const randomInterval = setInterval(() => {
                                    char.textContent = textAnimation.getRandomLetter();
                                }, 2);

                                // 0.5秒後清除隨機字動態
                                setTimeout(() => {
                                    clearInterval(randomInterval);
                                    char.textContent = char.dataset.originalText;
                                }, 20);
                            }
                        })

                    // 將此字元的動畫添加到描述時間軸
                    descriptionTimeline.add(charTimeline, charIndex * 0.02); // 0.6 = 0.5(動畫) + 0.1(延遲)
                });
            });
        }
    };

    // 新增：媒體資源列表
    const mediaResources = ref([
        { type: 'video', src: '/works/works15.mp4', link: '#', column: true },
        { type: 'video', src: '/works/works14.mp4', link: '#', column: true },
        { type: 'video', src: '/works/works13.mp4', link: '#', column: false },
        { type: 'image', src: '/works/works12.webp', link: '#', column: false },
        { type: 'video', src: '/works/works11.mp4', link: '#', column: true },
        { type: 'video', src: '/works/works10.mp4', link: '#', column: true },
        { type: 'video', src: '/works/works9.mp4', link: '#', column: true },
        { type: 'image', src: '/works/works8.webp', link: '#', column: false },
        { type: 'video', src: '/works/works7.mp4', link: '#', column: false },
        { type: 'video', src: '/works/works6.mp4', link: '#', column: true },
        { type: 'video', src: '/works/works5.mp4', link: '#', column: true },
        { type: 'image', src: '/works/works4.webp', link: '#', column: false },
        { type: 'video', src: '/works/works3.mp4', link: '#', column: false },
        { type: 'video', src: '/works/works2.mp4', link: '#', column: false },
        { type: 'video', src: '/works/works1.mp4', link: '#', column: false }
    ]);
    // 新增：反轉後的媒體資源列表
    const reversedMediaResources = computed(() => {
        return [...mediaResources.value].reverse();
    });

    // 新增：計算載入進度
    const loadingPercent = computed(() => {
        const percent = Math.floor((loadedItems.value / (mediaResources.value.length + 1)) * 100);
        if(percent == 100){
            loadComplete.value = true;
            return 'Start';
        }else{
            return `${percent}%`;
        }
    });
    // 新增：預載入單個媒體資源
    const preloadMedia = (resource) => {
        return new Promise((resolve, reject) => {
            if (resource.type === 'video') {
                const video = document.createElement('video');
                video.src = resource.src;
                video.onloadeddata = (res) => {
                    loadedItems.value++;
                    resolve();
                };
                video.onerror = reject;
                // 觸發載入
                video.load();
            } else if (resource.type === 'image') {
                const img = new Image();
                img.onload = () => {
                    loadedItems.value++;
                    resolve();
                };
                img.onerror = reject;
                img.src = resource.src;
            }
        });
    };
    // 新增：預載入所有媒體資源
    const preloadAllMedia = async () => {
        try {
            await Promise.all(mediaResources.value.map((resource) => {
                preloadMedia(resource);
            }));
            console.log('All media loaded successfully');
        } catch (error) {
            console.error('Error loading media:', error);
        }
    };
    // 處理資源載入完成事件
    const handleResourcesLoaded = () => {
        if (splashRef.value) {
            for(let i=1;i<5;i++){
                setTimeout(() => {
                    changeMaterialType(i);
                },(i-1)*100)
            }
            setTimeout(() => {
                changeMaterialType(0);
                loadedItems.value++;
            },5*100)       
            splashRef.value.updatePosition(0, 0, 10);
        }
    }
    
    // 動畫相關
    const setupScrollAnimations = () => {
        if (process.client) {
            nextTick(() => {
                aboutUsSectionGsap();
                worksSectionGsap();
                servicesSectionGsap();
                contactUsSectionGsap();
            });
        }
    };
    const aboutUsSectionGsap = () => {
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

        gsap.timeline({
            scrollTrigger: {
                trigger: '.aboutUs-section',
                start: '5% bottom',
                end: `center bottom`,
                scrub: true,
                markers: false,
                onUpdate: (self) => {
                    updatePosition(0, 0, 0, 0, -30, 0, self.progress);
                },
                onEnter: () =>{ 
                    startServiceMarquee();
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

        const aboutUsContentTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.aboutUs-section',
                start: '10% bottom',
                end: 'bottom bottom',
                scrub: true,
                markers: false
            }
        });
        aboutUsContentTimeline
            .to('.aboutUs-section-content-1-1', { opacity: 1, filter: 'blur(0px)', duration: 0.1 },0)
            .to('.aboutUs-section-hr-1', { width: '100%', duration: 0.2 },0.1)
            .to('.aboutUs-section-content-1-2', { opacity: 1, filter: 'blur(0px)', duration: 0.1 },0.3)
            .to('.aboutUs-section-content-2-1', { opacity: 1, filter: 'blur(0px)', duration: 0.1 },0.4)
            .to('.aboutUs-section-content-2-2', { width: '100%', duration: 0.2 },0.5)
            .to('.aboutUs-section-content-3-1', { opacity: 1, filter: 'blur(0px)', duration: 0.1 },0.7)
            .to('.aboutUs-section-content-3-2', { opacity: 1, filter: 'blur(0px)', duration: 0.1 },0.8)
            .to('.aboutUs-section-content-3-2 .underline', { width: '100%', duration: 0.2 },0.9)
            .to('.aboutUs-section', { '--bg-opacity': 0, duration: 0 },0.9)
            .to('.aboutUs-section-content-3-3', { opacity: 1, filter: 'blur(0px)', duration: 0.1 },1.1)
            .to('.aboutUs-content-group', { opacity: 0, transform: 'scale(5)', duration: 0.2 },1.3)
    }
    const worksSectionGsap = () => {
        gsap.timeline({
            scrollTrigger: {
                trigger: '.works-section',
                start: 'top bottom',
                end: 'top top',
                scrub: true,
                markers: false,
                onUpdate: (self) => {
                    updatePosition(0, -1, 30, 0, 0, -10, self.progress);
                },
                onLeave: () => {
                    growingFunction()
                },
                onEnterBack: () => {
                    shrinkingFunction()
                },
                onLeaveBack: () => {
                    updatePosition(0, -15, 0)
                }
            },    
        });

        const itemCount = 15;
        const zDistance = 10000;
        let totalDistance;
        if(width.value > 1400){
            totalDistance = 3500;
        }else if(width.value > 1200){
            totalDistance = 3000;
        }else if(width.value > 992){
            totalDistance = 2500;
        }else if(width.value > 768){
            totalDistance = 2500;
        }else{
            totalDistance = 2500;
        }
        const radToDeg = rad => rad * 180 / Math.PI;
        const clampAngle = angle => ((angle % 360) + 360) % 360;
        const getCornerDataFromScreen = () => {
            const halfW = width.value / 2;
            const halfH = height.value / 2;

            return {
                topLeft: {
                    angle: clampAngle(radToDeg(Math.atan2(-halfH, -halfW))),
                },
                topRight: {
                    angle: clampAngle(radToDeg(Math.atan2(-halfH, halfW))),
                },
                bottomLeft: {
                    angle: clampAngle(radToDeg(Math.atan2(halfH, -halfW))),
                },
                bottomRight: {
                    angle: clampAngle(radToDeg(Math.atan2(halfH, halfW))),
                },
            };
        };
        const cornerOrder = [
            'topLeft', 
            'topRight', 
            'bottomRight', 
            'bottomLeft'
        ];
        const generateAngleSequence = (count) => {
            const cornerData = getCornerDataFromScreen();
            const sequence = [];

            for (let i = 0; i < count; i++) {
                const cornerKey = cornerOrder[i % cornerOrder.length];
                const baseAngle = cornerData[cornerKey].angle;
                const randomOffset = Math.random() * 40 - 20; // ±45 度
                const finalAngle = baseAngle + randomOffset;

                sequence.push(finalAngle);
            }

            return sequence;
        };
        const worksAngleData = generateAngleSequence(itemCount);
        
        const worksTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.works-section',
                start: 'top top',
                end: `bottom bottom`,
                scrub: true,
                markers: false,
                onUpdate: (self) => {
                    updatePosition(0, 0, -10, 0, 0, 20, self.progress);
                },
            }
        });

        function polarToCartesian(angleDeg, distance) {
            const rad = angleDeg * Math.PI / 180;
            return {
                x: Math.round(distance * Math.cos(rad)),
                y: Math.round(distance * Math.sin(rad)),
            };
        }

        const durationTime = 1;
        const opacityDuration = 0.3;
        const delayPercent = 0.15;
        for (let i = 0; i < itemCount; i++) {
            const { x, y } = polarToCartesian(worksAngleData[i], totalDistance);

            
            const itemSelector = `.works-content-item-${i + 1}`;
            const start = (durationTime * delayPercent) * (i-1);

            // 位移動畫
            worksTimeline.to(itemSelector, {
                '--transform-x': x,
                '--transform-y': y,
                '--transform-z': zDistance,
                ease: 'none',
                duration: durationTime,
            }, start);

            // 透明動畫（延遲 opacityDelayRatio 啟動）
            worksTimeline.to(itemSelector, {
                opacity: 1,
                ease: 'none',
                duration: opacityDuration / durationTime,
            }, start);
        }
    }
    const servicesSectionGsap = () => {
        gsap.timeline({
            scrollTrigger: {
                trigger: '.services-section',
                start: 'top bottom',
                end: `top 15%`,
                scrub: false,
                markers: false,
                onEnter: () => {
                    // textAnimation.animate(0);
                    shrinkingFunction()
                },
                onLeave: () => {
                    growingFunction();
                },
                onEnterBack: () => {
                    shrinkingFunction()
                },
                onLeaveBack: () => {
                    growingFunction()
                },
                onUpdate: (self) => {
                    if(width.value>768){
                        updatePosition(0, 0, 20, -8, 0, 0, self.progress);
                    }else{
                        updatePosition(0, 0, 20, 0, -2, 0, self.progress);
                    }
                },
            },
        })

        // 動畫時間參數
        const animParams = {
            transitionDuration: 0.1,  // 淡入淡出過渡時間
            stayDuration: 0.1,     // 內容停留時間
            totalCount: 6,
            xTransform: 125,
            yTransform: 500,
            xStayTransform: 8,
            yStayTransform: 100,
        }

        const halfStayDuration = animParams.stayDuration / 2;
        const contentDuration = animParams.transitionDuration + animParams.stayDuration;
        const timeLineDuration = halfStayDuration + animParams.transitionDuration + (animParams.totalCount - 2) * contentDuration + halfStayDuration;
        const animateDuration = timeLineDuration / 100 / 4 * 5;
        if(width.value <= 768){
            animParams.xTransform = 0;
            animParams.xStayTransform = 0;
        }
        
        // 1
        const tl1 = gsap.timeline({
            scrollTrigger: {
                trigger: '.services-section',
                start: 'top top',
                end: `${(halfStayDuration + animParams.transitionDuration) / animateDuration}% top`,
                scrub: true,
                markers: false,
            },
        })
        tl1.to(
            `.services-content-1`,
            {
                opacity: 1,
                x: animParams.xStayTransform,
                y: -animParams.yStayTransform, 
                duration: halfStayDuration, 
                ease: 'none' 
            },
            0
        )
        .to(
            `.services-content-1`,
            { 
                opacity: 0, 
                x: animParams.xTransform, 
                y: -animParams.yTransform, 
                duration: animParams.transitionDuration, 
                ease: 'none',
            },
            halfStayDuration
        )

        gsap.timeline({
            scrollTrigger: {
                trigger: '.services-section',
                end: `${(halfStayDuration + halfStayDuration) / animateDuration}% top`,
                markers: false,
                onLeave: () => {
                    shrinkingFunction();
                },
                onEnterBack: () => {
                    growingFunction();
                    changeMaterialType(0);
                },
            },
        })
        gsap.timeline({
            scrollTrigger: {
                trigger: '.services-content-container',
                start: `top center`,
                markers: false,
                onEnter: () => {
                    // textAnimation.animate(0);
                },
            },
        })
        
        // 2~5
        for(let i = 2; i <= animParams.totalCount-1; i++){
            const sectionStart = (halfStayDuration + (((halfStayDuration * 2) + animParams.transitionDuration) * (i-2)));
            const sectionEnd = (halfStayDuration + (((halfStayDuration * 2) + animParams.transitionDuration) * (i-1))+ animParams.transitionDuration);
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.services-section',
                    start: `${sectionStart / animateDuration}% top`,
                    end: `${sectionEnd / animateDuration}% top`,
                    scrub: true,
                    markers: false,
                    onEnter: () => {
                        // textAnimation.animate(i-1);
                    },
                },
            })
            tl.fromTo(
                `.services-content-${i}`,
                { 
                    opacity: 0, 
                    x: animParams.xTransform, 
                    y: animParams.yTransform 
                },
                { 
                    opacity: 1, 
                    x: animParams.xStayTransform,
                    y: animParams.yStayTransform, 
                    duration: animParams.transitionDuration, 
                    ease: 'none' 
                },
                0
            )
            .to(
                `.services-content-${i}`,
                { 
                    x: 0,
                    y: 0, 
                    duration: halfStayDuration, 
                    ease: 'none' 
                },
                animParams.transitionDuration
            )
            .to(
                `.services-content-${i}`,
                { 
                    x: animParams.xStayTransform,
                    y: -animParams.yStayTransform, 
                    duration: halfStayDuration, 
                    ease: 'none' 
                },
                animParams.transitionDuration + halfStayDuration
            )
            .to(
                `.services-content-${i}`,
                { 
                    opacity: 0, 
                    x: animParams.xTransform, 
                    y: -animParams.yTransform, 
                    duration: animParams.transitionDuration, 
                    ease: 'none' 
                },
                animParams.transitionDuration + halfStayDuration + halfStayDuration
            )

            gsap.timeline({
                scrollTrigger: {
                    trigger: '.services-section',
                    start: `${(sectionStart + animParams.transitionDuration) / animateDuration}% top`,
                    end: `${(sectionEnd - animParams.transitionDuration) / animateDuration}% top`,
                    markers: false,
                    onEnter: () => {
                        growingFunction();
                        changeMaterialType(i-1);
                    },
                    onLeave: () => {
                        shrinkingFunction();
                    },
                    onEnterBack: () => {
                        growingFunction();
                        changeMaterialType(i-1);
                    },
                    onLeaveBack: () => {
                        shrinkingFunction();
                    },
                },
            });
        }
        
        // 6
        const tl6 = gsap.timeline({
            scrollTrigger: {
                trigger: '.services-section',
                start: `${(halfStayDuration + (((halfStayDuration * 2) + animParams.transitionDuration) * (6-2))) / animateDuration}% top`,
                end:`${((((halfStayDuration * 2) + animParams.transitionDuration) * (6-1))) / animateDuration}% top`,
                scrub: true,
                markers: false,
                onEnter: () => {
                    // textAnimation.animate(6-1);
                },
            },
        })
        tl6.fromTo(
            `.services-content-${animParams.totalCount}`,
            { 
                opacity: 0, 
                x: animParams.xTransform, 
                y: animParams.yTransform 
            },
            { 
                opacity: 1, 
                x: animParams.xStayTransform,
                y: animParams.yStayTransform, 
                duration: animParams.transitionDuration, 
                ease: 'none',
            },
            0
        )
        .to(
            `.services-content-${animParams.totalCount}`,
            { 
                x: 0,
                y: 0, 
                duration: halfStayDuration, 
                ease: 'none' 
            },
            animParams.transitionDuration
        )
        
        gsap.timeline({
            scrollTrigger: {
                trigger: '.services-section',
                start: `${(halfStayDuration + (((halfStayDuration * 2) + animParams.transitionDuration) * (animParams.totalCount-2)) + animParams.transitionDuration) / animateDuration}% top`,
                markers: false,
                onEnter: () => {
                    growingFunction();
                    changeMaterialType(5);
                },
                onLeaveBack: () => {
                    shrinkingFunction();
                },
            },
        })
    }
    const contactUsSectionGsap = () => {
        gsap.timeline({
            scrollTrigger: {
                trigger: '.contactUs-section',
                start: '15% bottom',
                end: `bottom bottom`,
                scrub: true,
                markers: false,
                onUpdate: (self) => {
                    if(width.value>768){
                        updatePosition(-8, 0, 0, 0, 0, 0, self.progress);
                    }else{
                        updatePosition(0, -2, 0, 0, 0, 0, self.progress);
                    }
                },
                onEnter:()=>{
                    shrinkingFunction();
                },
                onLeave:()=>{
                    changeMaterialType(0);
                    growingFunction();
                },
                onEnterBack:()=>{
                    shrinkingFunction();
                },
                onLeaveBack:()=>{
                    changeMaterialType(5);
                    growingFunction();
                },
            }
        })
    }
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
    const materialData =[
        {
            value: 'default',
            backgroundColor: '#F2F2F2',
        },
        {
            value: 'arVrXr',
            backgroundColor: '#F2F2F2',
        },
        {
            value: 'digiArt',
            backgroundColor: '#F2F2F2',
        },
        {
            value: 'uiuxDev',
            backgroundColor: '#F2F2F2',
        },
        {
            value: 'animate',
            backgroundColor: '#F2F2F2',
        },
        {
            value: 'graphic',
            backgroundColor: '#F2F2F2',
        },
    ]
    const changeMaterialType = (index) => {
        if (splashRef.value) {
            splashRef.value.changeMaterialType(materialData[index].value);
            // const color = materialData[materialData[index].backgroundColor];
            // if (color) {
            //     document.documentElement.style.backgroundColor = color;
            //     document.body.style.backgroundColor = color;
            // }
        }
    }

    // 水花收合
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
    
    // 控制自動播放
    let autoPlayTimer = null;
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
    const startAutoPlay = () => {
        if (isAutoPlaying.value) return;
        isAutoPlaying.value = true;
        growingFunction();
    }
    const stopAutoPlay = () => {
        isAutoPlaying.value = false;
        if (autoPlayTimer) {
        clearTimeout(autoPlayTimer);
        autoPlayTimer = null;
        }
        shrinkingFunction();
    }
    
    // 標準字收合
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
    
    // 點擊開始按鈕
    const clickStart = () => {
        if (!loadComplete.value) return;
        isStarted.value = true;
        startAutoPlay();
        animateTextToTargetPosition();

        if (splashRef.value) {
            splashRef.value.addMouseControlEvents();
        }
        
        
        // 設置滾動動畫
        setupScrollAnimations();
    
        // 創建自定義緩動
        customEasing = CustomEase.create("custom", "M0,0 C0,0 0.015,1 1,1 ");
        
        gsap.to({
            z: 10
        }, {
            z: 0,
            duration: 1,
            ease: "customGrowEase", // 使用自定義緩動
            onUpdate: function(self) {
                // 動畫每一幀更新場景位置
                if (splashRef.value) {
                    splashRef.value.updatePosition(0, 0, this.targets()[0].z);
                }
            }
        });
        
        // 啟用頁面滾動
        document.body.style.overflow = 'auto';
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

        gsap.registerEase("customGrowEase", function(x) {
            return Math.pow(x, 0.15);
        });

        gsap.registerEase("customShrinkEase", function(x) {
            return Math.pow(x, 2.5);
        });

        // 開始預載入媒體資源
        preloadAllMedia();

        // textAnimation.init();
    });
</script>