let man;

let player;

let yForce = 0;
let xSpeed = 2;

let ground;

let spikes;

let score = 0;
let allTime = 0;

let s;

class Triangle {
  constructor(opts) {
    this.size = opts.size || 8;
    this.pos = createVector(opts.x, opts.y);
    
    this.rot = opts.rotation || 0;
  }
  
  drawTriangle(x, y, r, s) {
    push();
    translate(x, y);
    rotate(r);
    beginShape();
    vertex(0, -s);
    vertex(-s, s);
    vertex(s, s);
    endShape();
    pop();
  }
  
  draw() {
    man.draw(this.drawTriangle, this.pos.x, this.pos.y, this.rot, this.size);
  }
  
  checkIntersect(otherTriangle) {
    return (this.pos.dist(otherTriangle.pos) < this.size + otherTriangle.size);
  }
}

function setup() {
  let h = min(windowWidth - 20, windowHeight - 20);
  createCanvas(h, h);
  textAlign(CENTER);
  colorMode(HSB, 256);
  background(0);
  
  man = new Mandala({mirror: false, rotations: 7, translate: false});
  
  setupGame();
}
function setupGame() {
  ground = height / 4;

  s = height / 600;
  
  spikes = [];
  let x = -width / 2;
  for(let i = 0; i < 8; i++) {
    x += 100 * s + random(200 * s);
    spikes.push(new Triangle({x: x, y: ground, size: 8 * s}))
  }
  player = new Triangle({x: 0, y: ground, size: 8 * s})
  
  
  textSize(20 * s);
  xSpeed = 2 * s;
}

function draw() {
  let d = (deltaTime / 20);
  allTime += d;
  
  translate(width / 2, height / 2);
  background(0, 40);
  //text(round(score / 100), 0, 0);
  rotate(allTime * 0.005);
  
  man.draw(text, round(score / 100), 0, ground + 50 * s)
  
  xSpeed = min(xSpeed + 0.0001 * d * s, 5 * s);
  score += xSpeed;
  for(let t of spikes) {
    t.pos.x -= xSpeed * d;
    if(t.checkIntersect(player)) {
      score = 0;
      xSpeed = 2 * s;
      background(0);
      fill(0, 0, 256);
      man.draw(text, "game over", 0, ground - 10 * s)
    }
    fill(noise((t.pos.x + allTime) * 0.001 * s) * 400 % 256, 256, 256);
    t.draw();
    if(t.pos.x < -width) {
      t.pos.x = width + random(100 * s);
    }
  }
  fill(0, 0, 256);
  player.draw();
  player.pos.y += yForce * d * s;
  
  if(player.pos.y > ground) {
    player.pos.y = ground;
    player.rot *= 0.5;
    if (keyIsPressed || mouseIsPressed || touches.length > 0) {
      yForce = -8;
    }
  } else {
    player.rot += 0.2 * d * s;
  }
  yForce += 0.3 * d;
  
  strokeWeight(0.4)
  for(let i = 0; i < 25; i++) {
    let x = (width / 12.5) * i - width;
    stroke(noise((x + allTime) * 0.001 * s) * 400 % 256, 256, 256);
    man.line(x, ground + player.size, x + width / 12.5, ground + player.size);
  }
  rotate(-allTime * 0.02)
  stroke(256, 50);
  for(let j = 0; j < 5; j++) {
    for(let i = 0; i < 5; i++) {
      let x = allTime * 0.01 + i * 0.1 + j
      man.line(0, -cos(x - 200) * width / 3, sin(x + 1000) * width, sin(x) * width);
    }
  }
  noStroke();
}

function windowResized() {
  let h = min(windowWidth - 20, windowHeight - 20)
  resizeCanvas(h, h);
  setupGame();
}

