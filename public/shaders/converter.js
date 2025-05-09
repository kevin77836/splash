/**
 * 著色器轉換工具
 * 用於將 2D 片段著色器轉換為適用於 3D 模型的版本
 */

/**
 * 將標準 2D 片段著色器轉換為 3D 模型適用的著色器
 * @param {string} fragmentShader - 原始的 2D 片段著色器代碼
 * @returns {Object} - 包含轉換後的頂點著色器和片段著色器
 */
function convert2DShaderTo3D(fragmentShader) {
  // 創建 3D 頂點著色器
  const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

  // 處理片段著色器內容
  let modifiedFragmentShader = fragmentShader;

  // 添加必要的 varying 變量
  if (!modifiedFragmentShader.includes('varying vec2 vUv')) {
    const varyingDeclarations = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
`;
    
    // 在著色器頂部插入 varying 聲明
    // 先檢查是否有精度聲明或 #ifdef GL_ES
    if (modifiedFragmentShader.includes('#ifdef GL_ES')) {
      const parts = modifiedFragmentShader.split('#endif');
      modifiedFragmentShader = parts[0] + '#endif' + varyingDeclarations + parts.slice(1).join('#endif');
    } else if (modifiedFragmentShader.includes('precision')) {
      const precisionMatch = modifiedFragmentShader.match(/(precision [a-z]+ float;)/);
      if (precisionMatch) {
        const precisionStatement = precisionMatch[0];
        const parts = modifiedFragmentShader.split(precisionStatement);
        modifiedFragmentShader = parts[0] + precisionStatement + varyingDeclarations + parts.slice(1).join(precisionStatement);
      } else {
        modifiedFragmentShader = varyingDeclarations + modifiedFragmentShader;
      }
    } else {
      modifiedFragmentShader = varyingDeclarations + modifiedFragmentShader;
    }
  }
  
  // 處理 gl_FragCoord.xy / resolution.xy 這類座標轉換
  // 將其替換為使用 vUv 座標
  modifiedFragmentShader = modifiedFragmentShader.replace(
    /gl_FragCoord\.xy\s*\/\s*resolution(\.(xy|y|x))?/g, 
    'vUv'
  );
  
  // 替換裸露的 resolution 引用
  modifiedFragmentShader = modifiedFragmentShader.replace(
    /\bresolution\b(?!\s*=)/g, 
    '(resolution)'
  );
  
  // 添加光照函數
  const lightingFunction = `
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
  vec3 specular = 0.3 * spec * vec3(1.0);
  
  return color * (ambient + diffuse) + specular;
}
`;

  // 在 main 函數之前插入光照函數
  const mainFunctionIndex = modifiedFragmentShader.indexOf('void main');
  if (mainFunctionIndex !== -1) {
    modifiedFragmentShader = 
      modifiedFragmentShader.substring(0, mainFunctionIndex) + 
      lightingFunction + 
      modifiedFragmentShader.substring(mainFunctionIndex);
  }
  
  // 查找 main 函數的大括號
  const mainFunctionStartBrace = modifiedFragmentShader.indexOf('{', mainFunctionIndex);
  const mainFunctionContent = modifiedFragmentShader.substring(mainFunctionStartBrace + 1);
  
  // 提取返回顏色的語句
  const returnColorMatch = mainFunctionContent.match(/gl_FragColor\s*=\s*([^;]+);/);
  
  if (returnColorMatch) {
    const originalColorAssignment = returnColorMatch[0];
    const colorValue = returnColorMatch[1];
    
    // 構建增強的代碼
    const enhancedColorCode = `
  // 獲取表面法線
  vec3 normal = normalize(vNormal);
  
  // 原始代碼的顏色計算
  ${originalColorAssignment}
  
  // 提取顏色
  vec3 baseColor = gl_FragColor.rgb;
  
  // 加入光照效果
  vec3 litColor = calculateLighting(baseColor, normal, vPosition);
  
  // 添加邊緣光暈效果
  float edgeFactor = 1.0 - pow(abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.0);
  vec3 edgeHighlight = vec3(1.0, 1.0, 1.0) * edgeFactor * 0.2;
  
  // 最終顏色 - 添加邊緣高光
  gl_FragColor.rgb = litColor + edgeHighlight;`;
    
    // 替換原始的顏色設置
    modifiedFragmentShader = modifiedFragmentShader.replace(originalColorAssignment, enhancedColorCode);
  }
  
  return {
    vertexShader,
    fragmentShader: modifiedFragmentShader
  };
}

/**
 * 將片段著色器代碼保存為文件
 * @param {string} shaderCode - 著色器代碼
 * @param {string} filename - 文件名
 * @returns {Promise<boolean>} - 操作結果
 */
async function saveShaderToFile(shaderCode, filename) {
  try {
    // 在實際應用中，您需要實現文件保存邏輯
    // 這裡僅作為示例
    console.log(`保存著色器到文件: ${filename}`);
    console.log(shaderCode);
    return true;
  } catch (error) {
    console.error('保存著色器失敗:', error);
    return false;
  }
}

// 導出函數以供使用
export { convert2DShaderTo3D, saveShaderToFile }; 