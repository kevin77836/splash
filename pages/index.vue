<template>
    <Splash
        ref="splashRef" 
        @resourcesLoaded="handleResourcesLoaded"
        @animationComplete="handleAnimationComplete"
    />
    <div :class="{'active': isStarted}" class="l-header">
        <div class="desktop-group">
            <div class="header-link" :class="{'hidden': isLandingPage}" @click="scrollToSection('main-section')">
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
            <div class="header-link" @click="scrollToSection('services-section')">
                Services
            </div>
            <div class="header-saparator" :class="{'hidden': !isLandingPage}">
                <div class="header-saparator-line"></div>
            </div>
            <div class="header-link" @click="scrollToSection('partners-section')">
                Partners
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
            <div class="header-link" :class="{'hidden': isLandingPage}" @click="scrollToSection('main-section')">Splash DigiLab</div>
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
            <div class="menu-item" @click="scrollToSection('partners-section', true)">
                Partners
            </div>
            <div class="menu-item" @click="scrollToSection('contactUs-section', true)">
                Contact Us
            </div>
        </div>
    </div>
    <div data-scroll-wrapper class="scroll-wrapper">
        <div data-scroll-content class="main-container">
            <div class="section main-section">
                <div v-if="!isStarted" 
                    class="startButton" 
                    @click="clickStart">
                    {{ loadingPercent }}
                </div>

                <div v-show="isStarted" class="marquee">
                    <div class="marquee-content-group">
                        <span class="marquee-content-group-item">AR/VR/XR策展 ・ 網頁設計開發 ・ 品牌識別規劃 ・ 2D/3D動畫 ・ 互動設計/數位藝術 ・ AR/VR/XR策展 ・ 網頁設計開發 ・ 品牌識別規劃 ・ 2D/3D動畫 ・ 互動設計/數位藝術 ・&nbsp;</span>
                    </div>
                    <div class="marquee-content-group2">
                        <span class="marquee-content-group-item">AR/VR/XR策展 ・ 網頁設計開發 ・ 品牌識別規劃 ・ 2D/3D動畫 ・ 互動設計/數位藝術 ・ AR/VR/XR策展 ・ 網頁設計開發 ・ 品牌識別規劃 ・ 2D/3D動畫 ・ 互動設計/數位藝術 ・&nbsp;</span>
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
                <div v-for="(item, index) in serviceData" class="services-content" :class="`services-content-${index+1}`" :key="index">
                    <h2 class="services-title">{{ item.title }}</h2>
                    <div class="services-description">
                        {{ item.description }}
                    </div>
                    <div v-if="item.projects?.length" class="services-projects-group">
                        <div class="services-projects" v-for="(project,projectsIndex) in item.projects" :key="'services'+ index + projectsIndex">
                            <div class="banner">
                                <video v-if="fetchMediaById(project).type === 'video'" :src="fetchMediaById(project).src" autoplay muted loop playsinline></video>
                                <img v-else :src="fetchMediaById(project).src" alt="">
                            </div>
                            <div class="infoGroup">
                                <div class="title">{{ fetchMediaById(project).title }}</div>
                                <div class="descriptionWrap">
                                    <div class="description">{{ fetchMediaById(project).description }}</div>
                                </div>
                                <div class="cta">查看專案</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div v-show="isStarted" class="section partners-section">
                <div class="partners-content-container">
                    <!-- <div class="partners-content-title">
                        Partners
                    </div> -->
                    <div class="partners-content-group">
                        <div class="partners-content-item partners-content-item-1">
                            <img src="/partners/partners1.png" alt="">
                        </div>
                        <div class="partners-content-item partners-content-item-2">
                            <img src="/partners/partners2.png" alt="">
                        </div>
                        <div class="partners-content-item partners-content-item-3">
                            <img src="/partners/partners3.png" alt="">
                        </div>
                        <div class="partners-content-item partners-content-item-4">
                            <img src="/partners/partners4.png" alt="">
                        </div>
                        <div class="partners-content-item partners-content-item-5">
                            <img src="/partners/partners1.png" alt="">
                        </div>
                        <div class="partners-content-item partners-content-item-6">
                            <img src="/partners/partners2.png" alt="">
                        </div>
                        <div class="partners-content-item partners-content-item-7">
                            <img src="/partners/partners3.png" alt="">
                        </div>
                        <div class="partners-content-item partners-content-item-8">
                            <img src="/partners/partners4.png" alt="">
                        </div>
                        <div class="partners-content-item partners-content-item-9">
                            <img src="/partners/partners1.png" alt="">
                        </div>
                        <div class="partners-content-item partners-content-item-10">
                            <img src="/partners/partners2.png" alt="">
                        </div>
                        <div class="partners-content-item partners-content-item-11">
                            <img src="/partners/partners3.png" alt="">
                        </div>
                        <div class="partners-content-item partners-content-item-12">
                            <img src="/partners/partners4.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="isStarted" class="section contactUs-section">
                <div class="contactUs-title">
                    Let's make a splash
                </div>
                <div class="contactUs-description">
                    如果有任何疑問或者有報價洽詢的需求，歡迎聯繫我們，
                    我們會在收到訊息後三天內回覆，
                    請留下您的聯絡方式及簡要內容，方便讓我們了解您的需求。
                </div>
                <div class="contactUs-information">
                    <div class="phone">Phone: 0912-345-678</div>
                    <div class="email">Email: splash-digilab@gmail.com</div>
                    <div class="line">Line: @splash-digilab</div>
                    <div class="companyName">斯巴拉系數位互動有限公司</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import { ScrollSmoother } from 'gsap/ScrollSmoother';
    import { CustomEase } from 'gsap/CustomEase';
    import { useWindowSize } from '@vueuse/core'
    import { SplitText } from 'gsap/SplitText';
    const { width, height } = useWindowSize();
    import { isMobileDevice } from '../utils/device';
    
    const splashRef = ref(null);
    const loadComplete = ref(false);
    const loadedItems = ref(0);
    const isAutoPlaying = ref(false);
    const isStarted = ref(false);
    const isMenuOpen = ref(false);
    const isLandingPage = ref(true);

    let customEasing;
    let smoother = null;

    if (process.client) {
        gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, ScrollSmoother);
    }

    const serviceData = ref([
        {
            title: 'Services',
            description: 'Splash DigiLab 結合設計創意與前端開發，擅長跨界沉浸式互動體驗，服務範圍包含 XR 展演策劃、UI/UX 設計、網頁開發、品牌設計、數位藝術、互動設計等。',
            splitTitle: [],
            splitDescription: [],
            splitActive: false
        },
        {
            title: 'AR/VR/XR策展',
            description: '策劃並開發、執行 Web AR/ XR 沉浸式展覽、行銷活動或產品展示，打造虛實整合體驗。',
            splitTitle: [],
            splitDescription: [],
            splitActive: false,
            projects:[
                1,3,9
            ]
        },
        {
            title: '網頁設計開發',
            description: '從前端網站設計到3D互動前端，整合 Nuxt、Three.js 等技術，實現網頁創新體驗。',
            splitTitle: [],
            splitDescription: [],
            splitActive: false,
            projects:[
                2,11
            ]
        },
        {
            title: '品牌識別規劃',
            description: '提供品牌識別與視覺系統規劃服務，滿足品牌在實體門店到數位體驗中的各式需求。',
            splitTitle: [],
            splitDescription: [],
            splitActive: false,
            projects:[
                4,13
            ]
        },
        {
            title: '2D/3D動畫',
            description: '製作 3D 動畫、CGI 與 Web AR 結合的視覺內容，豐富數位敘事層次。',
            splitTitle: [],
            splitDescription: [],
            splitActive: false,
            projects:[
                1,7
            ]
        },
        // {
        //     title: '互動設計/數位藝術',
        //     description: '專注於直覺互動體驗，從動作感應裝置到展覽互動系統，強化體驗參與感。',
        //     splitTitle: [],
        //     splitDescription: [],
        //     projects:[
        //         1,2,3
        //     ]
        // },
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
        { id: 15,type: 'video', src: '/works/works15.mp4', link: '#', column: true, title:'專案標題', description:'專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文' },
        { id: 14,type: 'video', src: '/works/works14.mp4', link: '#', column: true, title:'專案標題', description:'專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文' },
        { id: 13,type: 'video', src: '/works/works13.mp4', link: '#', column: false, title:'專案標題', description:'專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文' },
        { id: 12,type: 'image', src: '/works/works12.webp', link: '#', column: false, title:'專案標題', description:'專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文' },
        { id: 11,type: 'video', src: '/works/works11.mp4', link: '#', column: true, title:'專案標題', description:'專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文' },
        { id: 10,type: 'video', src: '/works/works10.mp4', link: '#', column: true, title:'專案標題', description:'專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文' },
        { id: 9,type: 'video', src: '/works/works9.mp4', link: '#', column: true, title:'AR | 打狗祭 2024 × AR 小怪獸現身!', description:'今年，小怪獸們不只盤據舞台，更將透過 AR 擴增實境，衝破次元，降臨你的世界！📱✨' },
        { id: 8,type: 'image', src: '/works/works8.webp', link: '#', column: false, title:'專案標題', description:'專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文' },
        { id: 7,type: 'video', src: '/works/works7.mp4', link: '#', column: false, title:'專案標題', description:'專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文' },
        { id: 6,type: 'video', src: '/works/works6.mp4', link: '#', column: true, title:'專案標題', description:'專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文' },
        { id: 5,type: 'video', src: '/works/works5.mp4', link: '#', column: true, title:'專案標題', description:'專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文' },
        { id: 4,type: 'image', src: '/works/works4.webp', link: '#', column: false, title:'專案標題', description:'專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文' },
        { id: 3,type: 'video', src: '/works/works3.mp4', link: '#', column: false, title:'AR Card / 3D Animation | 黑金派對 2024 – 可可占星術', description:'《黑金派對 2024 – 可可占星術》可可（Cacao）一詞源自瑪雅銘文的 Kakaw，在古瑪雅文化中，被視為蘊藏神秘力量的珍寶。而在《黑金派對 2024》，這股神秘魔力將透過 AR 可可占星術，為你揭開內心深處的秘密！' },
        { id: 2,type: 'video', src: '/works/works2.mp4', link: '#', column: false, title:'專案標題', description:'專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文專案內文' },
        { id: 1,type: 'video', src: '/works/works1.mp4', link: '#', column: false, title:'Web AR | 2024 康士坦的變化球 KST 眠月線演唱會 高雄站', description:'《2024 康士坦的變化球 KST 眠月線演唱會 高雄站》在康士坦變化球《眠月線》高雄演唱會，打造了一場獨特的 Web AR 互動體驗，透過手機瀏覽器無須下載App即可開啟活動體驗，親身走進《眠月線》MV的夢境與現實交錯之中，尋找遺落的記憶碎片。' }
    ]);
    // 新增：反轉後的媒體資源列表
    const reversedMediaResources = computed(() => {
        return [...mediaResources.value].reverse();
    });

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

    function fetchMediaById(id) {
        return mediaResources.value.find(item => item.id === id);
    }

    const loadingPercent = computed(() => {
        const percent = Math.floor((loadedItems.value / (mediaResources.value.length + 1)) * 100);
        if(percent == 100){
            loadComplete.value = true;
            return 'Start';
        }else{
            return `${percent}%`;
        }
    });
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
    const handleResourcesLoaded = () => {
        if (splashRef.value) {
            // for(let i=1;i<5;i++){
            //     setTimeout(() => {
            //         changeMaterialType(i);
            //     },(i-1)*100)
            // }
            // setTimeout(() => {
            //     changeMaterialType(0);
            //     loadedItems.value++;
            // },5*100)
            loadedItems.value++;
            splashRef.value.updatePosition(0, 0, 10);
        }
    }
    
    // 動畫相關
    const setupScrollAnimations = () => {
        if (process.client) {
            nextTick(() => {
                if (!isMobileDevice()) {
                    setSmoother();
                }
                aboutUsSectionGsap();
                worksSectionGsap();
                servicesSectionGsap();
                partnersSectionGsap();
                contactUsSectionGsap();
            });
        }
    };
    const aboutUsSectionGsap = () => {
        ScrollTrigger.create({
            trigger: '.aboutUs-section',
            start: 'top top',
            end: 'bottom top',
            pin: '.aboutUs-content-container',
            pinSpacing: false,
            scrub: false,
        });

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
                trigger: '.main-section',
                start: 'top top',
                end: `bottom+=150% top`,
                scrub: true,
                markers: false,
                onUpdate: (self) => {
                    updatePosition(0, 0, 0, 0, -18, 0, self.progress);
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
                markers: false,
            }
        });
        aboutUsContentTimeline
            .to('.aboutUs-section-content-1-1', { opacity: 1, filter: 'blur(0px)', duration: 0.1, ease: "power4.in", },0)
            .to('.aboutUs-section-hr-1', { opacity: 1, width: '100%', duration: 0.2, ease: "power4.in", },0.1)
            .to('.aboutUs-section-content-1-2', { opacity: 1, filter: 'blur(0px)', duration: 0.1, ease: "power4.in", },0.3)
            .to('.aboutUs-section-content-2-1', { opacity: 1, filter: 'blur(0px)', duration: 0.1, ease: "power4.in", },0.4)
            .to('.aboutUs-section-content-2-2', { width: '100%', duration: 0.2, ease: "power4.in", },0.5)
            .to('.aboutUs-section-content-3-1', { opacity: 1, filter: 'blur(0px)', duration: 0.1, ease: "power4.in", },0.7)
            .to('.aboutUs-section-content-3-2', { opacity: 1, filter: 'blur(0px)', duration: 0.1, ease: "power4.in", },0.8)
            .to('.aboutUs-section-content-3-2 .underline', { width: '100%', duration: 0.2, ease: "power4.in", },0.9)
            .to('.aboutUs-section', { '--bg-opacity': '0', duration: 0, ease: "power4.in", },0.9)
            .to('.aboutUs-section-content-3-3', { opacity: 1, filter: 'blur(0px)', duration: 0.1, ease: "power4.in", },1.1)
            .to('.aboutUs-content-group', { opacity: 0, transform: 'scale(5)', duration: 0.2, ease: "power4.in", },1.3)
    }
    const worksSectionGsap = () => {
        ScrollTrigger.create({
            trigger: '.works-section',
            start: 'top top',
            end: 'bottom top',
            pin: '.works-content-container',
            pinSpacing: false,
            scrub: false,
        });

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
        if(width.value > (1400 - 1)){
            totalDistance = 3500;
        }else if(width.value > (1200 - 1)){
            totalDistance = 3000;
        }else if(width.value > (992 - 1)){
            totalDistance = 2500;
        }else if(width.value > (768 - 1)){
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
                    updatePosition(0, 0, -10, 0, 0, 0, self.progress);
                },
                onLeave: () => {
                    for (let i = 0; i < itemCount; i++) {
                        const itemSelector = `.works-content-item-${i + 1}`;
                        gsap.set(itemSelector, {
                            opacity: 0,
                        });
                    }
                },
                onEnterBack: () => {
                    for (let i = 0; i < itemCount; i++) {
                        const itemSelector = `.works-content-item-${i + 1}`;
                        gsap.set(itemSelector, {
                            opacity: 1,
                        });
                    }
                }
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
                duration: durationTime,
                ease: "power1.out",
            }, start);

            // 透明動畫（延遲 opacityDelayRatio 啟動）
            worksTimeline.to(itemSelector, {
                opacity: 1,
                duration: opacityDuration / durationTime,
            }, start);
        }
    }
    const servicesSectionGsap = () => {
        gsap.timeline({
            scrollTrigger: {
                trigger: `.services-content-1`,
                start: 'top bottom',
                end: `top+=300px center`,
                scrub: false,
                markers: false,
                onEnter: () => {
                    shrinkingFunction()
                },
                onUpdate: (self) => {
                    if(width.value>(768 - 1)){
                        updatePosition(0, 0, 0, -8, 0, 0, self.progress);
                    }else{
                        updatePosition(0, 0, 0, 0, -2, 0, self.progress);
                    }
                },
            },
        })

        for (let i = 1; i <= serviceData.value.length; i++) {
            gsap.timeline({
                scrollTrigger: {
                    trigger: `.services-content-${i}`,
                    start: `top+=300px center`,
                    end: `center center`,
                    markers: false,
                    scrub: true,
                    onEnter: () => {
                        growingFunction();
                        changeMaterialType(i-1);
                        if(!serviceData.value[i-1].splitActive){
                            textAnimation.animate(i-1);
                            serviceData.value[i-1].splitActive = true;
                        }
                    },
                    onLeaveBack: () =>{
                        shrinkingFunction();
                    }
                },
            })
            gsap.timeline({
                scrollTrigger: {
                    trigger: `.services-content-${i}`,
                    start: `bottom-=300px center`,
                    end: `bottom center`,
                    markers: false,
                    scrub: true,
                    onEnter: () => {
                        shrinkingFunction();
                    },
                    onLeaveBack: () => {
                        growingFunction();
                        changeMaterialType(i-1);
                    }
                },
            })

            gsap.fromTo( `.services-content-${i} .services-projects`,
                { x: 50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power4.out',
                    delay: 0, 
                    stagger: 0.5,
                    scrollTrigger: {
                        trigger: `.services-content-${i}`, 
                        start: 'top+=300px center',
                        scrub: false,
                        markers: false,
                    },
                }
            )
        }
    }
    const partnersSectionGsap = () => {
        ScrollTrigger.create({
            trigger: '.partners-section',
            start: 'top top',
            end: 'bottom top',
            pin: '.partners-content-container',
            pinSpacing: false,
            scrub: false,
        });

        gsap.timeline({
            scrollTrigger: {
                trigger: '.partners-section',
                start: `top ${(100 * 2) / 3}%`,
                end: 'top top',
                scrub: true,
                markers: false,
                onUpdate: (self) => {
                    if(width.value>(768 - 1)){
                        updatePosition(-8, 0, 0, 0, 0, 0, self.progress);
                    }else{
                        updatePosition(0, -2, 0, 0, 0, 0, self.progress);
                    }
                },
                onLeave: () => {
                    changeMaterialType(0);
                    growingFunction();
                },
                onEnterBack: () => {
                    shrinkingFunction();
                },
            },    
        });

        const itemCount = 12; // 元素總數

        const desktopPositions = {
            1: {x: 50, y: -350, z: 3300},
            2: {x: 400, y: -150, z: 3400},
            3: {x: 580, y: 50, z: 3300},
            4: {x: 350, y: 150, z: 3400},
            5: {x: 220, y: 0, z: 3350},
            6: {x: 200, y: 300, z: 3400},
            7: {x: -180, y: 350, z: 3300},
            8: {x: -400, y: 200, z: 3400},
            9: {x: -190, y: 100, z: 3200},
            10: {x: -550, y: 50, z: 3300},
            11: {x: -500, y: -250, z: 3300},
            12: {x: -300, y: -150, z: 3200},
        };
        const mobilePositions = {
            1: {x: 250, y: -550, z: 1100},
            2: {x: -200, y: -450, z: 1300},
            3: {x: 150, y: -350, z: 1200},
            4: {x: -300, y: -250, z: 1200},
            5: {x: 200, y: -150, z: 1000},
            6: {x: -150, y: -50, z: 1100},
            7: {x: 300, y: 50, z: 1200},
            8: {x: -250, y: 150, z: 1300},
            9: {x: 200, y: 250, z: 1100},
            10: {x: -300, y: 350, z: 1400},
            11: {x: 200, y: 450, z: 1200},
            12: {x: -200, y: 550, z: 1300},
        };

        const partnersSectionTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.partners-section',
                start: 'top top', // 從頁面頂部開始
                end: 'bottom bottom', // 動態計算結束點
                scrub: true, // 平滑的滾動效果
                markers: false,
                onUpdate: (self) => {
                    updatePosition(0, 0, 0, 0, 0, 20, self.progress);
                },
            }
        });

        let contentGroupTransformZ;
        if(width.value > (768 - 1)){
            contentGroupTransformZ = 400;
        }else if(width.value > (576 - 1)){
            contentGroupTransformZ = 140;
        }else{
            contentGroupTransformZ = 120;
        }

        partnersSectionTimeline.to('.partners-content-group', {
            '--transform-z': contentGroupTransformZ,
            ease: CustomEase.create("custom", "M0,0 C0,0.5 1,0.5 1,1 "),
            duration: 1,
        },0);
        
        const position = width.value > (768 - 1) ? desktopPositions : mobilePositions;
        for (let i = 1; i <= itemCount; i++) {
            partnersSectionTimeline.to(`.partners-content-item-${i}`, {
                '--transform-x': position[i].x,
                '--transform-y': position[i].y,
                '--transform-z': position[i].z,
                opacity: 1,
                duration: 0.3,
                ease: "power4.out",
            },0);
        }
    }
    const contactUsSectionGsap = () => {
        gsap.timeline({
            scrollTrigger: {
                trigger: '.contactUs-section',
                start: 'top bottom',
                end: 'bottom bottom',
                scrub: true,
                markers: false,
                onUpdate: (self) => {
                    updatePosition(0, 0, 20, 0, 0, 30, self.progress);
                },
                onEnter: ()=>{
                    shrinkingFunction();
                },
            },    
        });
    }
    const setSmoother = () => {
        smoother = ScrollSmoother.create({
            wrapper: '[data-scroll-wrapper]',
            content: '[data-scroll-content]',
            smooth: 1,
            effects: true,
            normalizeScroll: true,
        })
        ScrollTrigger.refresh()
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
            },
            onComplete: ()=>{
                document.body.style.overflow = 'auto';
            }
        });       
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
        
        setTimeout(() => {
            const section = document.querySelector(`.${sectionClass}`);
            if (section) {
                let position = section.offsetTop;

                if(sectionClass == 'aboutUs-section'){
                    position = section.offsetTop + section.offsetHeight * 0.5;
                }else if(sectionClass == 'works-section'){
                    position = section.offsetTop + section.offsetHeight * 0.15;
                }else if(sectionClass == 'services-section'){
                    position = section.offsetTop - section.offsetHeight / 12;
                }
                

                window.scrollTo({
                    top: position,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    onMounted(async() => {
        preloadAllMedia();

        document.body.style.overflow = 'hidden';

        gsap.registerEase("customGrowEase", function(x) {
            return Math.pow(x, 0.15);
        });
        gsap.registerEase("customShrinkEase", function(x) {
            return Math.pow(x, 2.5);
        });

        if (isMobileDevice()) {
            const windowHeight = height.value;
            document.documentElement.style.setProperty('--h', `${windowHeight}px`);
        }

        textAnimation.init();
    });
</script>