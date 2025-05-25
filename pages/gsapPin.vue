<template>
    <div class="container">
        <section class="section section-1">
            <div class="box box-1"></div>
        </section>
        <section class="section section-2">
            <div class="box box-2"></div>
        </section>
        <section class="section section-3">
            <div class="box box-3"></div>
        </section>
        <section class="section section-4">
            <div class="box box-4"></div>
        </section>
        <section class="section section-5">
            <div class="box box-5"></div>
        </section>
    </div>
</template>

<script setup>
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onMounted } from 'vue';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}

onMounted(() => {
    // Section 1 動畫：從左到右移動並旋轉
    gsap.timeline({
        scrollTrigger: {
            trigger: ".section-1",
            start: "top top",
            end: "bottom top",
            pin: true,
            scrub: true,
            markers: true
        }
    }).to(".box-1", {
        x: "100vw",
        rotation: 360,
        duration: 1
    });

    // Section 2 動畫：放大並改變顏色
    gsap.timeline({
        scrollTrigger: {
            trigger: ".section-2",
            start: "top top",
            end: "bottom top",
            pin: true,
            scrub: true,
            markers: true
        }
    }).to(".box-2", {
        scale: 2,
        backgroundColor: "#ff0000",
        duration: 1
    });

    // Section 3 動畫：對角線移動並變形
    gsap.timeline({
        scrollTrigger: {
            trigger: ".section-3",
            start: "top top",
            end: "bottom top",
            pin: true,
            scrub: true,
            markers: true
        }
    }).to(".box-3", {
        x: "50vw",
        y: "50vh",
        skewX: 45,
        duration: 1
    });

    // Section 4 動畫：彈跳效果
    gsap.timeline({
        scrollTrigger: {
            trigger: ".section-4",
            start: "top top",
            end: "bottom top",
            pin: true,
            scrub: true,
            markers: true
        }
    }).to(".box-4", {
        y: "50vh",
        ease: "bounce.out",
        duration: 1
    });

    // Section 5 動畫：淡出並旋轉
    gsap.timeline({
        scrollTrigger: {
            trigger: ".section-5",
            start: "top top",
            end: "bottom top",
            pin: true,
            scrub: true,
            markers: true
        }
    }).to(".box-5", {
        opacity: 0,
        rotation: 720,
        scale: 0,
        duration: 1
    });
});
</script>

<style scoped>
.container {
    width: 100%;
    background-color: #f0f0f0;
}

.section {
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.box {
    width: 100px;
    height: 100px;
    background-color: #3498db;
    position: absolute;
}

.section-1 {
    background-color: #f1f1f1;
}

.section-2 {
    height: 200vh;
    background-color: #f5f5f5;
}

.section-3 {
    background-color: #f9f9f9;
}

.section-4 {
    background-color: #fdfdfd;
}

.section-5 {
    background-color: #ffffff;
}

.box-1 {
    left: 0;
}

.box-2 {
    background-color: #2ecc71;
}

.box-3 {
    background-color: #e74c3c;
}

.box-4 {
    background-color: #f1c40f;
}

.box-5 {
    background-color: #9b59b6;
}
</style>
