<template>
  <div class="main-container">
    <h1 class="company-name">
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
  console.log('資源載入完成，開始自動播放');
  startAutoPlay();
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

<style scoped>

.button-group {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.status {
  margin-top: 8px;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 5px 10px;
  border-radius: 4px;
}

button {
  margin-right: 8px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: rgba(40, 40, 40, 0.8);
}
</style>