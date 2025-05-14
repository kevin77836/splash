<template>
  <div class="container">
    <h1>計算你跟目標位置的距離</h1>
    <button @click="getDistance" :disabled="loading">{{ loading ? '計算中...' : '取得距離' }}</button>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 目標位置經緯度（以台北 101 大樓為例）
const target = { lat: 25.033964, lon: 121.564468 };
const message = ref('');
const loading = ref(false);

// 哈弗辛公式：輸入兩點經緯度，回傳距離（公尺）
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371000; // 地球半徑（公尺）
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1), Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// 計算距離函數
const getDistance = () => {
  if (!process.client) return;
  
  if (!navigator.geolocation) {
    message.value = '你的瀏覽器不支援 Geolocation API';
    return;
  }

  loading.value = true;
  message.value = '正在獲取位置...';

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      const distance = haversineDistance(
        latitude, longitude,
        target.lat, target.lon
      );
      message.value = `你距離目標位置約 ${distance.toFixed(1)} 公尺。`;
      loading.value = false;
    },
    error => {
      message.value = `無法取得位置：${error.message}`;
      loading.value = false;
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};

// 確保只在客戶端執行
onMounted(() => {
  if (!process.client) return;
  
  if (!navigator.geolocation) {
    message.value = '你的瀏覽器不支援 Geolocation API';
  } else {
    message.value = '點擊按鈕獲取你的位置';
  }
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
  text-align: center;
}

h1 {
  margin-bottom: 2rem;
}

button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

p {
  margin-top: 2rem;
  font-size: 18px;
}
</style>
