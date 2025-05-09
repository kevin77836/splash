let particles = [];
const num = 800;
const scale = 15;
let cols, rows;
let zOff = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  cols = floor(width / scale);
  rows = floor(height / scale);
  // 初始化粒子
  for (let i = 0; i < num; i++) {
    particles.push(createVector(random(width), random(height)));
  }
  background(0);
}

function draw() {
  // 半透明背景留下拖尾
  background(0, 0, 0, 10);

  // 生成流场并更新粒子
  zOff += 0.005;
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let xIdx = floor(p.x / scale);
    let yIdx = floor(p.y / scale);
    let angle = noise(xIdx * 0.1, yIdx * 0.1, zOff) * TWO_PI * 4;
    // 根据角度设色
    stroke((angle * 180/PI) % 360, 80, 100, 50);
    strokeWeight(2);
    // 记录旧位置
    let px = p.x, py = p.y;
    // 更新位置
    p.x += cos(angle) * 2;
    p.y += sin(angle) * 2;
    // 环绕边界
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    // 绘制轨迹
    line(px, py, p.x, p.y);
  }
}