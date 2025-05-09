#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// 生成彩虹顏色
vec3 digitalRainbow(float value) {
  float r = clamp(sin(value + 0.0) * 0.5 + 0.5, 0.0, 1.0);
  float g = clamp(sin(value + 2.0944) * 0.5 + 0.5, 0.0, 1.0);
  float b = clamp(sin(value + 4.18879) * 0.5 + 0.5, 0.0, 1.0);
  return vec3(r, g, b);
}

// 計算光照效果
vec3 calculateLighting(vec3 color, vec3 normal, vec3 viewPosition) {
  // 簡單環境光
  float ambientStrength = 0.2;
  vec3 ambient = ambientStrength * vec3(1.0);
  
  // 來自相機方向的基本光照
  vec3 lightDir = normalize(-viewPosition);
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuse = diff * vec3(1.0);
  
  // 鏡面反射光
  vec3 viewDir = normalize(-viewPosition);
  vec3 reflectDir = reflect(-lightDir, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0);
  vec3 specular = 0.5 * spec * vec3(1.0);
  
  return color * (ambient + diffuse + specular);
}

void main() {
  // 獲取表面參數
  vec3 normal = normalize(vNormal);
  
  // 使用UV坐標而不是屏幕坐標，更好地貼合模型表面
  vec2 uv = vUv;
  
  // 添加模型表面紋理變化
  float depth = length(vPosition) * 0.05;
  
  // 同時使用模型位置和UV計算隨機因子，增加表面細節
  float randomFactor = fract(sin(dot(uv + depth, vec2(12.9898, 78.233))) * 43758.5453);
  
  // 計算流動場方向，結合表面法線
  float scale = 9.0;
  float angle = sin(uv.x * scale) * cos(uv.y * scale) + time + dot(normal, vec3(1.0, 0.5, 0.3)) * 2.0;
  vec2 flowDir = vec2(cos(angle), sin(angle));
  
  // 應用流動場和深度
  vec2 newUV = uv + flowDir * randomFactor * 0.05;
  
  // 根據曲面變化調整像素圖案尺度
  float curvatureFactor = abs(dot(normal, vec3(0.0, 0.0, 1.0)));
  vec2 scaledUV = newUV * (15.0 + 10.0 * curvatureFactor);
  
  // 創建像素藝術圖案，同時考慮表面曲率
  float pixelValue = 1.0 - step(0.5, mod(scaledUV.x + scaledUV.y, 2.0));
  
  // 將法線因素融入彩虹效果
  float rainbowFactor = mod(time + scaledUV.x + scaledUV.y + dot(normal, vec3(0.3, 0.4, 0.5)) * 3.0, 6.2831);
  vec3 rainbowColor = digitalRainbow(rainbowFactor);
  
  // 背景顏色 - 使用深色而非純黑，提高可見度
  vec3 backgroundColor = vec3(0.05, 0.05, 0.08);
  
  // 混合顏色，加入法線影響
  vec3 baseColor = mix(backgroundColor, rainbowColor, pixelValue);
  
  // 應用光照效果
  vec3 litColor = calculateLighting(baseColor, normal, vPosition);
  
  // 添加深度感和邊緣光暈
  float edgeFactor = 1.0 - pow(abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.0);
  vec3 edgeHighlight = vec3(1.0, 1.0, 1.0) * edgeFactor * 0.3;
  
  // 最終顏色 - 帶有深度感和邊緣高光
  vec3 finalColor = litColor + edgeHighlight;
  
  gl_FragColor = vec4(finalColor, 1.0);
} 