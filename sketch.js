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

let ripples = []; // ripples

//荷花
let flowers = [
  { x: 100, y: 300, size: 30, shake: 0 },
  { x: 400, y: 250, size: 40, shake: 0 },
  { x: 250, y: 100, size: 30, shake: 0 },
  { x: 650, y: 400, size: 45, shake: 0 }
];

// 速度上限
const maxSpeed = 3; // 最大速度

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");

  // fish1
  x1 = random(width);
  y1 = random(height);
  vx1 = random(-2, 2); // Increase initial speed
  vy1 = random(-2, 2); // Increase initial speed
  size1 = random(50, 75); // Increase size by 30%
  color1 = color(255,150,0);

  // fish2
  x2 = random(width);
  y2 = random(height);
  vx2 = random(-2, 2); // Increase initial speed
  vy2 = random(-2, 2); // Increase initial speed
  size2 = random(50, 85); // Increase size by 30%
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

// Draw a fish shape
function drawFish(x, y, size, col, vx, vy) {
  push();
  translate(x, y);
  rotate(atan2(vy, vx)); // Rotate fish in the direction of movement
  fill(col);
  noStroke();

  // Body (ellipse)
  ellipse(0, 0, size, size * 0.6);

  // Tail (triangle)
  fill(col);
  triangle(-size * 0.6, 0, -size, -size * 0.3, -size, size * 0.3);

  // Eye (small circle)
  fill(255);
  ellipse(size * 0.2, -size * 0.1, size * 0.1, size * 0.1);
  pop();
}

// draw ripples
function drawRipples() {
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    noFill();
    stroke(200, 200, 255, ripple.alpha);
    strokeWeight(2);
    ellipse(ripple.x, ripple.y, ripple.size, ripple.size);

    ripple.size += 1;
    ripple.alpha -= 2;

    // if ripple cannot be seen, remove it
    if (ripple.alpha <= 0) {
      ripples.splice(i, 1);
    }
  }
}

// draw flowers
function drawFlowers() {
  for (let flower of flowers) {
    push();
    translate(flower.x, flower.y);

    // Shake effect
    if (flower.shake > 0) {
      translate(random(-2, 2), random(-2, 2));
      flower.shake--;
    }

    // Stem
    stroke(50, 150, 50);
    strokeWeight(5);
    line(0, 0, 0, 50);

    // Flower (ellipse)
    noStroke();
    fill(255, 100, 150); // Pink color
    ellipse(0, -20, flower.size, flower.size * 0.8);

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
