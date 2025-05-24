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
        </div>
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
                        <!-- <div class="section-content-1-group">
                            <span class="aboutUs-section-content-1-1">Splash</span>
                            <span class="aboutUs-section-content-1-2">DigiLab</span>
                        </div> -->
                        <span class="aboutUs-section-content-1-1">迸濺的</span>
                        <hr class="aboutUs-section-hr-1" color="black" size="1">
                        <span class="aboutUs-section-content-1-2">創意</span>
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
        <div v-if="isStarted" class="section works-section">
            <div class="works-content-container">
                <div class="works-content-group">
                    <a href="#" class="works-content-item works-content-item-15 column">
                        <video src="/works/works15.mp4" autoplay muted loop playsinline></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-14 column">
                        <video src="/works/works14.mp4" autoplay muted loop playsinline></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-13">
                        <video src="/works/works13.mp4" autoplay muted loop playsinline></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-12">
                        <img src="/works/works12.webp" alt="">
                    </a>
                    <a href="#" class="works-content-item works-content-item-11 column">
                        <video src="/works/works11.mp4" autoplay muted loop playsinline></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-10 column">
                        <video src="/works/works10.mp4" autoplay muted loop playsinline></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-9 column">
                        <video src="/works/works9.mp4" autoplay muted loop playsinline></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-8">
                        <img src="/works/works8.webp" alt="">
                    </a>
                    <a href="#" class="works-content-item works-content-item-7">
                        <video src="/works/works7.mp4" autoplay muted loop playsinline></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-6 column">
                        <video src="/works/works6.mp4" autoplay muted loop playsinline></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-5 column">
                        <video src="/works/works5.mp4" autoplay muted loop playsinline></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-4">
                        <img src="/works/works4.webp" alt="">
                    </a>
                    <a href="#" class="works-content-item works-content-item-3">
                        <video src="/works/works3.mp4" autoplay muted loop playsinline></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-2">
                        <video src="/works/works2.mp4" autoplay muted loop playsinline></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-1">
                        <video src="/works/works1.mp4" autoplay muted loop playsinline></video>
                    </a>
                </div>
            </div> 
        </div>
        <div v-if="isStarted" class="section services-section">
            <div class="services-content-container">
                <div class="services-content title-content">
                    <h2 class="services-title">Services</h2>
                    <div class="services-description">
                        介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹
                    </div>
                </div>
                <div class="services-content services-content-1">
                    <h2 class="services-title">XR策展</h2>
                    <div class="services-description">
                        介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹
                    </div>
                </div>
                <div class="services-content services-content-2">
                    <h2 class="services-title">互動設計</h2>
                    <div class="services-description">
                        介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹
                    </div>
                </div>
                <div class="services-content services-content-3">
                    <h2 class="services-title">數位藝術</h2>
                    <div class="services-description">
                        介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹
                    </div>
                </div>
                <div class="services-content services-content-4">
                    <h2 class="services-title">網頁開發</h2>
                    <div class="services-description">
                        介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹
                    </div>
                </div>
                <div class="services-content services-content-5">
                    <h2 class="services-title">AR/VR</h2>
                    <div class="services-description">
                        介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹
                    </div>
                </div>
                <div class="services-content services-content-6">
                    <h2 class="services-title">UI/UX</h2>
                    <div class="services-description">
                        介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹
                    </div>
                </div>
                <div class="services-content services-content-7">
                    <h2 class="services-title">2D/3D動畫</h2>
                    <div class="services-description">
                        介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹
                    </div>
                </div>
                <div class="services-content services-content-8">
                    <h2 class="services-title">平面設計</h2>
                    <div class="services-description">
                        介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹
                    </div>
                </div>
                <div class="services-content services-content-9">
                    <h2 class="services-title">CIS</h2>
                    <div class="services-description">
                        介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹介紹
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isStarted" class="section contactUs-section">
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
    const { width, height } = useWindowSize();
    if (process.client) {
        gsap.registerPlugin(ScrollTrigger, CustomEase);
    }
    
    const splashRef = ref(null);
    const loadComplete = ref(false);
    const loadedItems = ref(0);
    const isAutoPlaying = ref(false);
    const isStarted = ref(false);
    const isMenuOpen = ref(false);
    const isLandingPage = ref(true);
    let customEasing;
    
    // 新增：媒體資源列表
    const mediaResources = [
        { type: 'video', src: '/works/works15.mp4' },
        { type: 'video', src: '/works/works14.mp4' },
        { type: 'video', src: '/works/works13.mp4' },
        { type: 'image', src: '/works/works12.webp' },
        { type: 'video', src: '/works/works11.mp4' },
        { type: 'video', src: '/works/works10.mp4' },
        { type: 'video', src: '/works/works9.mp4' },
        { type: 'image', src: '/works/works8.webp' },
        { type: 'video', src: '/works/works7.mp4' },
        { type: 'video', src: '/works/works6.mp4' },
        { type: 'video', src: '/works/works5.mp4' },
        { type: 'image', src: '/works/works4.webp' },
        { type: 'video', src: '/works/works3.mp4' },
        { type: 'video', src: '/works/works2.mp4' },
        { type: 'video', src: '/works/works1.mp4' }
    ];
    // 新增：計算載入進度
    const loadingPercent = computed(() => {
        const percent = Math.floor((loadedItems.value / (mediaResources.length + 1)) * 100);
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
                video.onloadeddata = () => {
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
            await Promise.all(mediaResources.map(resource => preloadMedia(resource)));
            console.log('All media loaded successfully');
        } catch (error) {
            console.error('Error loading media:', error);
        }
    };
    // 處理資源載入完成事件
    const handleResourcesLoaded = () => {
        loadedItems.value++;
        if (splashRef.value) {
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
            });
        }
    };
    const aboutUsSectionGsap = () => {
        gsap.timeline({
            scrollTrigger: {
                trigger: '.aboutUs-section',
                start: 'top 80%',
                end: 'center bottom',
                scrub: true,
                markers: true,
                onUpdate: (self) => {
                    updatePosition(0, 0, 0, 0, -35, 0, self.progress);
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
                end: '65% bottom',
                scrub: true,
                markers: false
            }
        });
        aboutUsContentTimeline
            .to('.aboutUs-section-content-1-1', { opacity: 1, filter: 'blur(0px)', duration: 0.1 })
            .to('.aboutUs-section-hr-1', { width: '100%', duration: 0.2 })
            .to('.aboutUs-section-content-1-2', { opacity: 1, filter: 'blur(0px)', duration: 0.1 })
            .to('.aboutUs-section-content-2-1', { opacity: 1, filter: 'blur(0px)', duration: 0.1 })
            .to('.aboutUs-section-content-2-2', { width: '100%', duration: 0.2 })
            .to('.aboutUs-section-content-3-1', { opacity: 1, filter: 'blur(0px)', duration: 0.1 })
            .to('.aboutUs-section-content-3-2', { opacity: 1, filter: 'blur(0px)', duration: 0.1 })
            .to('.aboutUs-section-content-3-2 .underline', { width: '100%', duration: 0.2 })
            .to('.aboutUs-section-content-3-3', { opacity: 1, filter: 'blur(0px)', duration: 0.1 });

        gsap.to('.aboutUs-content-group', {
            scrollTrigger: {
                trigger: '.aboutUs-section',
                start: '70% 80%',
                end: 'bottom bottom',
                scrub: true,
                markers: false,
            },
            transform: 'scale(5)',
            ease: 'none'
        });
        gsap.to('.aboutUs-section', {
            scrollTrigger: {
                trigger: '.aboutUs-section',
                start: '70% bottom',
                end: 'bottom bottom',
                scrub: true,
                markers: false,
            },
            opacity: 0,
            ease: 'none'
        });
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
                start: '0% top', // 從頁面頂部開始
                end: `bottom bottom`, // 動態計算結束點
                scrub: true, // 平滑的滾動效果
                markers: false,
                onUpdate: (self) => {
                    updatePosition(0, 0, -10, 0, 0, 10, self.progress);
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
                trigger: '.title-content',
                start: 'top bottom',
                end: '80% bottom',
                scrub: true,
                markers: false,
                onEnter: () => {
                    shrinkingFunction()
                },
                onLeave: () => {
                    growingFunction()
                },
                onEnterBack: () => {
                    shrinkingFunction()
                },
                onLeaveBack: () => {
                    growingFunction()
                },
                onUpdate: (self) => {
                    updatePosition(0, 0, 10, -10, 0, 0, self.progress);
                    // if(width.value > 768){
                    //     updatePosition(0, 0, 15, -4, 0, 15, self.progress);
                    // }else{
                    //     updatePosition(0, 0, 15, 0, -3, 0, self.progress);
                    // }
                },
            },   
        });

        const servicesItemCount = 9;
        for (let i = 1; i <= servicesItemCount; i++) {
            gsap.timeline({
                scrollTrigger: {
                    trigger: `.services-content-${i}`,
                    start: 'top 80%',
                    end: '80% bottom',
                    scrub: true,
                    markers: false,
                    onEnter: () => {
                        shrinkingFunction()
                    },
                    onLeave: () => {
                        growingFunction()
                        if(i === 1){
                            changeMaterialType('metallic');
                        }else if(i === 2){
                            changeMaterialType('matte');
                        }else if(i === 3){
                            changeMaterialType('gold');
                        }else if(i === 4){
                            changeMaterialType('neon');
                        }else if(i === 5){
                            changeMaterialType('ice');
                        }else if(i === 6){
                            changeMaterialType('holographic');
                        }else if(i === 7){
                            changeMaterialType('cloud');
                        }else if(i === 8){
                            changeMaterialType('chameleon');
                        }else if(i === 9){
                            changeMaterialType('galaxy');
                        }
                    },
                    onEnterBack: () => {
                        shrinkingFunction()
                    },
                    onLeaveBack: () => {
                        growingFunction()
                        if(i === 1){
                            changeMaterialType('water');
                        }else if(i === 2){
                            changeMaterialType('metallic');
                        }else if(i === 3){
                            changeMaterialType('matte');
                        }else if(i === 4){
                            changeMaterialType('gold');
                        }else if(i === 5){
                            changeMaterialType('neon');
                        }else if(i === 6){
                            changeMaterialType('ice');
                        }else if(i === 7){
                            changeMaterialType('holographic');
                        }else if(i === 8){
                            changeMaterialType('cloud');
                        }else if(i === 9){
                            changeMaterialType('chameleon');
                        }
                    },
                    onUpdate: (self) => {
                        // if(i === 0){
                        //     updatePosition(10, 0, 20, -10, 0, 20, self.progress);
                        // }
                        // if(width.value > 768){
                        //     if(i % 2 === 0){
                        //         updatePosition(10, 0, 20, -10, 0, 20, self.progress);
                        //     }else{
                        //         updatePosition(-10, 0, 20, 10, 0, 20, self.progress);
                        //     }
                        // }else{
                        //     splashRef.value.updatePosition(0, -3, 0);
                        // }
                    },
                },   
            });
        }
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
    const backgroundColors = {
        'water': '#F2F2F2',
        'metallic': '#FCBD00',
        'matte': '#239D89',
        'gold': '#000000',
        'neon': '#000814',
        'ice': '#001419',
        'holographic': '#14001a',
        'cloud': '#1a1a1a',
        'chameleon': '#001a14',
        'galaxy': '#000033',
        'wireframe': '#ffffff',
    };
    const fontColors = {
        'water': '#000000',
        'metallic': '#000000',
        'matte': '#000000',
        'gold': '#ffffff',
        'neon': '#ffffff',
        'ice': '#ffffff',
        'holographic': '#ffffff',
        'cloud': '#ffffff',
        'chameleon': '#ffffff',
        'galaxy': '#ffffff',
        'wireframe': '#000000',
    };
    const changeMaterialType = (materialType) => {
        if (splashRef.value) {
            splashRef.value.changeMaterialType(materialType);
            const color = backgroundColors[materialType];
            const fontColor = fontColors[materialType];
            if (color) {
                document.documentElement.style.backgroundColor = color;
                document.body.style.backgroundColor = color;
            }
            if (fontColor) {
                const servicesContents = document.querySelectorAll('.services-content');
                servicesContents.forEach(content => {
                    content.style.setProperty('--font-color', fontColor);
                });
            }
        }
    }
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
        splashRef.value.addMouseControlEvents();
        
        // 設置滾動動畫
        setupScrollAnimations();
    
        // 創建自定義緩動
        customEasing = CustomEase.create("custom", "M0,0 C0,0 0.015,1 1,1 ");
        
        gsap.to({
            x: 0,
            y: 0,
            z: 10
        }, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1,
            ease: "customGrowEase", // 使用自定義緩動
            onUpdate: function(self) {
                // 動畫每一幀更新場景位置
                if (splashRef.value) {
                    splashRef.value.updatePosition(this.targets()[0].x, this.targets()[0].y, this.targets()[0].z);
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
    });
</script>