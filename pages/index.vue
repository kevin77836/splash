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
                        <video src="/works/works15.mp4" autoplay muted loop></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-14 column">
                        <video src="/works/works14.mp4" autoplay muted loop></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-13">
                        <video src="/works/works13.mp4" autoplay muted loop></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-12">
                        <img src="/works/works12.webp" alt="">
                    </a>
                    <a href="#" class="works-content-item works-content-item-11 column">
                        <video src="/works/works11.mp4" autoplay muted loop></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-10">
                        <video src="/works/works10.mp4" autoplay muted loop></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-9 column">
                        <video src="/works/works9.mp4" autoplay muted loop></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-8">
                        <img src="/works/works8.webp" alt="">
                    </a>
                    <a href="#" class="works-content-item works-content-item-7">
                        <video src="/works/works7.mp4" autoplay muted loop></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-6 column">
                        <video src="/works/works6.mp4" autoplay muted loop></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-5 column">
                        <video src="/works/works5.mp4" autoplay muted loop></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-4">
                        <img src="/works/works4.webp" alt="">
                    </a>
                    <a href="#" class="works-content-item works-content-item-3">
                        <video src="/works/works3.mp4" autoplay muted loop></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-2">
                        <video src="/works/works2.mp4" autoplay muted loop></video>
                    </a>
                    <a href="#" class="works-content-item works-content-item-1">
                        <video src="/works/works1.mp4" autoplay muted loop></video>
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
    let customEasing;
    
    // 設置 ScrollTrigger 動畫
    const setupScrollAnimations = () => {
        if (process.client) {
            nextTick(() => {
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
                        scrub: true,
                        markers: false,
                        onUpdate: (self) => {
                            updatePosition(0, 0, 0, 0, -15, 0, self.progress);
                        },
                        onEnter: () => startServiceMarquee(),
                    },
                });

                const aboutUsContentTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.aboutUs-section',
                        start: '5% 80%',
                        end: '65% 70%',
                        scrub: 1,
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
                        start: '70% 80%',
                        end: 'bottom bottom',
                        scrub: true,
                        markers: false,
                    },
                    opacity: 0,
                    ease: 'none'
                });

                const itemCount = 15; // 元素總數
                let totalDistance = 2000; // 元素移動的總直線距離
                const zDistance = 10000; // Z軸最大移動距離
                const baseStartPercent = 0; // 起始滾動百分比
                const opacityDuration = 10; // 每個元素透明度動畫的滾動百分比
                const moveDuration = 30; // 每個元素位移動畫的滾動百分比
                const delayBetweenItems = 5; // 元素之間的延遲百分比

                if(width.value > 1400){
                    totalDistance = 3000;
                }else if(width.value > 1200){
                    totalDistance = 2500;
                }else if(width.value > 992){
                    totalDistance = 2000;
                }else if(width.value > 768){
                    totalDistance = 2000;
                }else{
                    totalDistance = 2000;
                }
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
                            // growingFunction()
                        },
                        onEnterBack: () => {
                            // shrinkingFunction()
                        },
                        onLeaveBack: () => {
                            updatePosition(0, -15, 0)
                        }
                    },    
                });
                const worksTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.works-section',
                        start: '0% top', // 從頁面頂部開始
                        end: `${baseStartPercent + (itemCount-1) * delayBetweenItems + moveDuration}% bottom`, // 動態計算結束點
                        scrub: true, // 平滑的滾動效果
                        markers: false,
                        onUpdate: (self) => {
                            updatePosition(0, 0, -10, 0, 0, 25, self.progress);
                        },
                    }
                });
                
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
                        topCenter: {
                            angle: clampAngle(radToDeg(Math.atan2(-halfH, 0))),
                        },
                        bottomCenter: {
                            angle: clampAngle(radToDeg(Math.atan2(halfH, 0))),
                        },
                        leftCenter: {
                            angle: clampAngle(radToDeg(Math.atan2(0, -halfW))),
                        },
                        rightCenter: {
                            angle: clampAngle(radToDeg(Math.atan2(0, halfW))),
                        }
                    };
                };

                const cornerOrder = ['topLeft', 'bottomCenter', 'topRight', 'leftCenter', 'bottomRight', 'topCenter', 'bottomLeft', 'rightCenter']; // 固定順序

                const generateSequence = (count) => {
                    const cornerData = getCornerDataFromScreen();
                    const sequence = [];

                    for (let i = 0; i < count; i++) {
                        const cornerKey = cornerOrder[i % cornerOrder.length];
                        const baseAngle = cornerData[cornerKey].angle;
                        let distance = totalDistance;

                        if(cornerKey === 'bottomCenter' || cornerKey === 'topCenter'){
                            if(width.value > height.value){
                                distance = totalDistance * 0.6;
                            }else{
                                distance = totalDistance * 0.8;
                            }
                        }else if(cornerKey === 'leftCenter' || cornerKey === 'rightCenter'){
                            if(width.value > height.value){
                                distance = totalDistance * 0.8;
                            }else{
                                distance = totalDistance * 0.7;
                            }
                        }

                        const randomOffset = Math.random() * 40 - 20; // ±45 度
                        const finalAngle = baseAngle;

                        sequence.push({
                            angle: finalAngle,
                            distance: distance
                        });
                    }

                    return sequence;
                };

                // 使用方式
                // const angles = generateAngleSequence(10);
                // 預先生成所有角度
                const worksAngleAndDistanceData = generateSequence(itemCount);
                
                // 為每個作品項目添加動畫
                for (let i = 1; i <= itemCount; i++) {
                    // 計算此元素在滾動過程中的延遲
                    const itemDelay = (i - 1) * delayBetweenItems;
                    
                    // 根據預生成的角度計算方向
                    const randomAngle = worksAngleAndDistanceData[i-1].angle;
                    const rad = randomAngle * Math.PI / 180; // 轉換為弧度
                    const distance = worksAngleAndDistanceData[i-1];
                    
                    // 計算 x 和 y 坐標，形成放射狀分布
                    const x = Math.round(distance.distance * Math.cos(rad));
                    const y = Math.round(distance.distance * Math.sin(rad));
                    
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
                        ease: 'none', // 使用power2.in緩動函數
                        duration: 1 // 相對持續時間
                    }, startPosition); // 與透明度動畫同時開始
                }

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
                            changeMaterialType('wireframe');
                            growingFunction()
                        },
                        onEnterBack: () => {
                            changeMaterialType('water');
                            shrinkingFunction()
                        },
                        onLeaveBack: () => {
                            // growingFunction()
                        },
                        onUpdate: (self) => {
                            updatePosition(0, 0, 25, -8, 0, 0, self.progress);
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
                                    changeMaterialType('wireframe');
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

    const changeMaterialType = (materialType) => {
        if (splashRef.value) {
            splashRef.value.changeMaterialType(materialType);
        }
    }
    
    // 處理資源載入完成事件
    const handleResourcesLoaded = () => {
        if (splashRef.value) {
            splashRef.value.updatePosition(0, 0, 10);
        }
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

        gsap.registerEase("customGrowEase", function(x) {
            return Math.pow(x, 0.15);
        });

        gsap.registerEase("customShrinkEase", function(x) {
            return Math.pow(x, 2.5);
  });
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