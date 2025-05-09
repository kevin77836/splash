<template>
  <div class="p-glsl-converter">
    <ShaderConverter />
  </div>
</template>

<script setup>
import ShaderConverter from '~/components/ShaderConverter.vue';
</script>

<style scoped>
.p-glsl-converter {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style> 