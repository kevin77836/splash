<template>
    <div class="three-sphere-wrapper">
      <!-- 按钮：切换到下一种材质 -->
      <button @click="switchMaterial" class="switch-btn">
        切换材质 (当前 {{ currentIndex + 1 }}/{{ materials.length }})
      </button>
      <!-- Three.js 渲染容器 -->
      <div ref="container" class="three-container"></div>
    </div>
  </template>
  
  <script setup>
  import * as THREE from 'three'
  
  const container = ref(null)
  let renderer, scene, camera, sphereMesh, animId
  const materials = []         // 存放所有材质
  const currentIndex = ref(0)  // 当前材质索引
  
  // 切换到下一种材质
  function switchMaterial() {
    if (!sphereMesh) return
    currentIndex.value = (currentIndex.value + 1) % materials.length
    sphereMesh.material = materials[currentIndex.value]
    sphereMesh.material.needsUpdate = true
  }
  
  onMounted(() => {
    const el = container.value
    if (!el) return
  
    // 1. 初始化 Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio || 1)
    el.appendChild(renderer.domElement)
  
    // 2. Scene
    scene = new THREE.Scene()
    // 可设背景色，例如深灰： scene.background = new THREE.Color(0x222222)
  
    // 3. Camera
    const width = el.clientWidth
    const height = el.clientHeight
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 5)
    scene.add(camera)
  
    // 4. 光源
    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5)
    scene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)
  
    // 5. Geometry：球体
    const geometry = new THREE.SphereGeometry(1, 32, 32)
  
    // 6. 构建多种材质并加入 materials 数组
  
    // 6.1 标准 PBR 材质：蓝色
    const matStandardBlue = new THREE.MeshStandardMaterial({
      color: 0x0077ff,
      metalness: 0.3,
      roughness: 0.6,
    })
    materials.push(matStandardBlue)
  
    // 6.2 Lambert 材质：绿色
    const matLambert = new THREE.MeshLambertMaterial({
      color: 0x00aa00,
    })
    materials.push(matLambert)
  
    // 6.3 Wireframe 材质：红色线框
    const matWireframe = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    })
    materials.push(matWireframe)
  
    // 6.4 自定义 ShaderMaterial A：法线映射颜色
    // 顶点 shader：传递法线
    const vsNormalColor = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `
    // 片段 shader：根据法线方向变色
    const fsNormalColor = `
      precision mediump float;
      varying vec3 vNormal;
      void main() {
        vec3 n = normalize(vNormal);
        // 将 [-1,1] 映射到 [0,1]
        vec3 color = vec3(0.5) + 0.5 * n;
        gl_FragColor = vec4(color, 1.0);
      }
    `
    const matShaderNormal = new THREE.ShaderMaterial({
      vertexShader: vsNormalColor,
      fragmentShader: fsNormalColor,
    })
    materials.push(matShaderNormal)
  
    // 6.5 自定义 ShaderMaterial B：随时间波动的颜色
    // 需要 uTime uniform，每帧更新
    const vsTime = `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `
    const fsTime = `
      precision mediump float;
      uniform float uTime;
      varying vec3 vPosition;
      void main() {
        // 让颜色随时间和位置一起波动
        float v = 0.5 + 0.5 * sin(uTime + vPosition.y * 2.0);
        vec3 color = vec3(0.5 + 0.5 * sin(uTime), 0.5 + 0.5 * cos(uTime * 1.3), v);
        gl_FragColor = vec4(color, 1.0);
      }
    `
    const matShaderTime = new THREE.ShaderMaterial({
      vertexShader: vsTime,
      fragmentShader: fsTime,
      uniforms: {
        uTime: { value: 0 },
      }
    })
    materials.push(matShaderTime)
  
    // 7. 创建 Mesh，初始材质用 materials[0]
    sphereMesh = new THREE.Mesh(geometry, materials[currentIndex.value])
    scene.add(sphereMesh)
  
    // 8. 处理尺寸与 resize
    function resize() {
      const w = el.clientWidth
      const h = el.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)
  
    // 9. 动画循环
    let clock = new THREE.Clock()
    function animate() {
      // 更新旋转
      if (sphereMesh) {
        sphereMesh.rotation.y += 0.01
        sphereMesh.rotation.x += 0.005
      }
      // 如果当前材质是时间 shader，需要更新 uniform
      if (materials[currentIndex.value] === matShaderTime) {
        const t = clock.getElapsedTime()
        matShaderTime.uniforms.uTime.value = t
      }
      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }
    animate()
  
    // 10. 清理
    onUnmounted(() => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      // dispose 相关资源
      geometry.dispose()
      materials.forEach(mat => mat.dispose())
      renderer.dispose()
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    })
  })
  </script>
  
  <style scoped>
  .three-sphere-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .three-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .switch-btn {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 10;
    padding: 8px 12px;
    background: rgba(255,255,255,0.8);
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  </style>
  