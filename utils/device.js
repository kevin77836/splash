/**
 * 檢查當前裝置是否為行動裝置
 * @returns {boolean} 如果是行動裝置則返回 true，否則返回 false
 */
export function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
} 