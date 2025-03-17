/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/


// fish 1
let x1, y1, vx1, vy1, size1, color1;
let outOfBoundsTimer1 = 0; // Timer for fish1 being out of bounds
// fish 2
let x2, y2, vx2, vy2, size2, color2;
let outOfBoundsTimer2 = 0; // Timer for fish2 being out of bounds
let targetFlower = null;
let ripples = []; // ripples

//荷花
let flowers = [
  { x: 100, y: 300, size: 45, shake: 0 },
  { x: 400, y: 250, size: 55, shake: 0 },
  { x: 250, y: 100, size: 40, shake: 0 },
  { x: 650, y: 400, size: 55, shake: 0 },
  { x: 520, y: 140, size: 50, shake: 0 }
];

// 速度上限
const maxSpeed = 3; // 最大速度

function setup() {
  let canvas = createCanvas(800, 500);


  // fish1
  x1 = random(width);
  y1 = random(height);
  vx1 = random(-2, 2); // Increase initial speed
  vy1 = random(-2, 2); // Increase initial speed
  size1 = random(70, 100); // Increase size by 30%
  color1 = color(255,150,0);

  // fish2
  x2 = random(width);
  y2 = random(height);
  vx2 = random(-2, 2); // Increase initial speed
  vy2 = random(-2, 2); // Increase initial speed
  size2 = random(65, 95); // Increase size by 30%
  color2 = color(255,255,255);
}

function draw() {
  background(30, 50, 70); // water color

  // draw the ripples
  drawRipples();

  // draw flowers
  drawFlowers();

  updateCreature1();
  drawFish(x1, y1, size1, color1, vx1, vy1); // Draw fish 1
  
  updateCreature2();
  drawFish(x2, y2, size2, color2, vx2, vy2); // Draw fish 2

  // check if they are close to each other
  avoidEachOther();

  // check if fish are near flowers
  checkFlowerInteraction();
}

// update fish1
function updateCreature1() {
  // Use noise to generate random motion
  let noiseValueX = noise(x1 * 0.01, frameCount * 0.01); // Add time-based noise
  let noiseValueY = noise(y1 * 0.01, frameCount * 0.01); // Add time-based noise
  vx1 += map(noiseValueX, 0, 1, -0.1, 0.1); // Adjust velocity based on noise
  vy1 += map(noiseValueY, 0, 1, -0.1, 0.1); // Adjust velocity based on noise

  if (targetFlower) {
    let angleToFlower = atan2(targetFlower.y - y1, targetFlower.x - x1);
    let force = 0.2;
    vx1 += cos(angleToFlower) * force;
    vy1 += sin(angleToFlower) * force;
  }

  // check mouse is nearby
  let mouseDist = dist(mouseX, mouseY, x1, y1);
  if (mouseDist < 50) {
    let mouseForceX = x1 - mouseX;
    let mouseForceY = y1 - mouseY;
    let forceMag = 2 / mouseDist;
    vx1 += mouseForceX * forceMag;
    vy1 += mouseForceY * forceMag;
  }

  // Limit speed
  let speed = sqrt(vx1 * vx1 + vy1 * vy1);
  if (speed > maxSpeed) {
    vx1 = (vx1 / speed) * maxSpeed;
    vy1 = (vy1 / speed) * maxSpeed;
  }

  // Gradually slow down the fish
  vx1 *= 0.98; // Friction
  vy1 *= 0.98;

  // update position
  x1 += vx1;
  y1 += vy1;

  // Check if fish is out of bounds
  if (x1 < 0 || x1 > width || y1 < 0 || y1 > height) {
    outOfBoundsTimer1++; // Increment timer
    if (outOfBoundsTimer1 > 180) { // 3 seconds (60 frames per second * 3)
      // Move towards the center
      let centerX = width / 2;
      let centerY = height / 2;
      let angle = atan2(centerY - y1, centerX - x1);
      vx1 = cos(angle) * maxSpeed;
      vy1 = sin(angle) * maxSpeed;
    }
  } else {
    outOfBoundsTimer1 = 0; // Reset timer if fish is back in bounds
  }

  // Add ripple at fish's position
  if (frameCount % 10 === 0 && x1 >= 0 && x1 <= width && y1 >= 0 && y1 <= height) {
    ripples.push({ x: x1, y: y1, size: 5, alpha: 100 });
  }
}

// update fish2
function updateCreature2() {
  // Use noise to generate random motion
  let noiseValueX = noise(x2 * 0.01, frameCount * 0.01); // Add time-based noise
  let noiseValueY = noise(y2 * 0.01, frameCount * 0.01); // Add time-based noise
  vx2 += map(noiseValueX, 0, 1, -0.1, 0.1); // Adjust velocity based on noise
  vy2 += map(noiseValueY, 0, 1, -0.1, 0.1); // Adjust velocity based on noise

   if (targetFlower) {
    let angleToFlower = atan2(targetFlower.y - y2, targetFlower.x - x2);
    let force = 0.2;
    vx2 += cos(angleToFlower) * force;
    vy2 += sin(angleToFlower) * force;
  }

  // check if mouse is nearby
  let mouseDist = dist(mouseX, mouseY, x2, y2);
  if (mouseDist < 50) {
    let mouseForceX = x2 - mouseX;
    let mouseForceY = x2 - mouseY;
    let forceMag = 2 / mouseDist;
    vx2 += mouseForceX * forceMag;
    vy2 += mouseForceY * forceMag;
  }

  // Limit speed
  let speed = sqrt(vx2 * vx2 + vy2 * vy2);
  if (speed > maxSpeed) {
    vx2 = (vx2 / speed) * maxSpeed;
    vy2 = (vy2 / speed) * maxSpeed;
  }

  // Gradually slow down the fish
  vx2 *= 0.98; // Friction
  vy2 *= 0.98;

  x2 += vx2;
  y2 += vy2;

  // Check if fish is out of bounds
  if (x2 < 0 || x2 > width || y2 < 0 || y2 > height) {
    outOfBoundsTimer2++; // Increment timer
    if (outOfBoundsTimer2 > 180) { // 3 seconds (60 frames per second * 3)
      // Move towards the center
      let centerX = width / 2;
      let centerY = height / 2;
      let angle = atan2(centerY - y2, centerX - x2);
      vx2 = cos(angle) * maxSpeed;
      vy2 = sin(angle) * maxSpeed;
    }
  } else {
    outOfBoundsTimer2 = 0; // Reset timer if fish is back in bounds
  }

  // Add ripple at fish's position
  if (frameCount % 10 === 0 && x2 >= 0 && x2 <= width && y2 >= 0 && y2 <= height) {
    ripples.push({ x: x2, y: y2, size: 5, alpha: 100 });
  }
}
function drawFish(x, y, size, col, vx, vy) {
  push();
  translate(x, y);
  rotate(atan2(vy, vx));
  fill(col);
  noStroke();

  // 身体保持原样
  beginShape();
  for (let i = 0; i < PI; i += PI / 10) {
    let sx = cos(i) * size * 0.5;
    let sy = sin(i) * size * 0.2;
    vertex(sx, sy);
  }
  for (let i = PI; i < TWO_PI; i += PI / 10) {
    let sx = cos(i) * size * 0.6;
    let sy = sin(i) * size * 0.3;
    vertex(sx, sy);
  }
  endShape(CLOSE);

   // 增强版尾巴
  let i = frameCount;
  let tailBaseX = -size * 0.6;
  let tailBaseY = 0;
  let cosValue = cos(i / 10) * size * 0.1; // 增加摆动幅度
  
  push();
  translate(tailBaseX, tailBaseY);
  rotate(-HALF_PI);
  scale(size/100 * 1.3); // 放大30%
  
  fill(col);
  noStroke();
  beginShape();
  // 修改后的控制点（宽度加倍）
  curveVertex(0, 0);
  curveVertex(0, 0);
  curveVertex(3, -3);  // 加宽起点
  curveVertex(7, -12 + cosValue);
  curveVertex(14, -18 + cosValue * 0.6);  // 横向扩大
  curveVertex(21, -22 + cosValue * 1);  // 长度和宽度同时增加
  curveVertex(28, -22 + cosValue * 1.4);
  curveVertex(35, -18 + cosValue * 0.8);
  curveVertex(28, -26 + cosValue * 1.2);
  curveVertex(21, -30 + cosValue * 0.5);  // 加大弯曲幅度
  curveVertex(14, -26 + cosValue * 0.5);
  curveVertex(7, -18 + cosValue);
  curveVertex(0, -9);  // 加宽基部
  curveVertex(-7, -18 + cosValue);
  curveVertex(-14, -26 + cosValue * 0.5);
  curveVertex(-21, -30 + cosValue * 1.0);
  curveVertex(-28, -26 + cosValue * 1.2);
  curveVertex(-35, -18 + cosValue * 0.8);
  curveVertex(-28, -22 + cosValue * 1.4);
  curveVertex(-21, -22 + cosValue * 1.2);
  curveVertex(-14, -18 + cosValue * 0.6);
  curveVertex(-7, -12 + cosValue);
  curveVertex(-3, -4);  // 对称加宽
  curveVertex(0, 0);
  curveVertex(0, 0);
  endShape();
  pop();


  // Dorsal fin
  fill(col);
  beginShape();
  vertex(-size * 0.2, -size * 0.2);
  vertex(0, -size * 0.4);
  vertex(size * 0.2, -size * 0.2);
  endShape(CLOSE);

  // Pectoral fins
  fill(col);
  beginShape();
  vertex(size * 0.1, size * 0.1);
  vertex(size * 0.3, size * 0.2);
  vertex(size * 0.1, size * 0.3);
  endShape(CLOSE);

  // Eye with contrasting color
  fill(red(col) > 200 ? 0 : 255);
  ellipse(size * 0.3, -size * 0.05, size * 0.1, size * 0.1);
  
  pop();
}

// Improved water ripples effect
function drawRipples() {
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    noFill();
    stroke(180, 180, 255, ripple.alpha);
    strokeWeight(1.5);
    for (let j = 0; j < 3; j++) {
      ellipse(ripple.x, ripple.y, ripple.size + j * 5, ripple.size + j * 5);
    }
    ripple.size += 2;
    ripple.alpha -= 3;

    if (ripple.alpha <= 0) {
      ripples.splice(i, 1);
    }
  }
}

// Improved lotus flower
function drawFlowers() {
  for (let flower of flowers) {
    push();
    translate(flower.x, flower.y);

    // Shake effect
    if (flower.shake > 0) {
      translate(random(-1, 1), random(-1, 1));
      flower.shake--;
    }

    // Stem
    stroke(50, 120, 50);
    strokeWeight(4);
    line(0, 0, 0, 50);

    // Petals (smaller and realistic)
    noStroke();
    fill(255, 120, 150); 
    for (let i = 0; i < 6; i++) {
      push();
      rotate(PI / 3 * i);
      ellipse(0, -10, flower.size * 0.5, flower.size * 0.8);
      pop();
    }

    // Center of flower
    fill(255, 200, 50);
    ellipse(0, -3, flower.size * 0.3, flower.size * 0.3);

    pop();
  }
}


// check if fish are near flowers
function checkFlowerInteraction() {
  for (let flower of flowers) {
    // Check fish1
    let dist1 = dist(x1, y1, flower.x, flower.y);
    if (dist1 < 50) {
      flower.shake = 10; // Shake for 10 frames
    }

    // Check fish2
    let dist2 = dist(x2, y2, flower.x, flower.y);
    if (dist2 < 50) {
      flower.shake = 10; // Shake for 10 frames
    }
  }
}

// click the ripples
function mousePressed() {
  ripples.push({ x: mouseX, y: mouseY, size: 5, alpha: 100 });

  // Check if mouse is clicked on a flower
  for (let flower of flowers) {
    let distToFlower = dist(mouseX, mouseY, flower.x, flower.y);
    if (distToFlower < 30) {
      flower.shake = 10; // Shake for 10 frames
      targetFlower = flower;
    }
  }
}

function avoidEachOther() {
  let minDistance = 60; // mimimum distance
  let distance = dist(x1, y1, x2, y2); 

  if (distance < minDistance) {
    let force = (minDistance - distance) / minDistance;
    let angle = atan2(y2 - y1, x2 - x1);

    vx1 -= cos(angle) * force;
    vy1 -= sin(angle) * force;

    vx2 += cos(angle) * force;
    vy2 += sin(angle) * force;
  }
}
