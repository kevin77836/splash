<template>
  <div class="main-container">
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
const splashRef = ref(null);
const loadComplete = ref(false);
const currentState = ref('idle');
const isAutoPlaying = ref(false);
const isStarted = ref(false);
let autoPlayTimer = null;
const startButton = ref(null);




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
  // console.log('資源載入完成，開始自動播放');
  // startAutoPlay();
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
    // 收縮動畫完成，等待1秒後開始生長
    autoPlayTimer = setTimeout(() => {
      growingFunction();
    }, 2000);
  }
}

const clickStart = () => {
  isStarted.value = true;
  startAutoPlay();
  splashRef.value.addMouseControlEvents();
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

// 組件卸載時清理
onUnmounted(() => {
  if (autoPlayTimer) {
    clearTimeout(autoPlayTimer);
  }
  isAutoPlaying.value = false;
});
</script>