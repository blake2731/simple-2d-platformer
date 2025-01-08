// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game constants
const GRAVITY = 0.5;
const MOVE_SPEED = 3;
const JUMP_SPEED = 10;
const TILE_SIZE = 32;

// Player object
const player = {
  x: 50,
  y: 0,
  width: 28,
  height: 32,
  vx: 0,
  vy: 0,
  onGround: false
};

// Basic level layout (0 = empty, 1 = ground)
// 20 tiles wide, ~7 rows tall (adjust as needed)
const levelData = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
  [0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Keyboard input
let keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

function update() {
  // Horizontal movement
  if (keys["ArrowLeft"]) {
    player.vx = -MOVE_SPEED;
  } else if (keys["ArrowRight"]) {
    player.vx = MOVE_SPEED;
  } else {
    player.vx = 0;
  }

  // Jump (only if on ground)
  if (keys["Space"] && player.onGround) {
    player.vy = -JUMP_SPEED;
    player.onGround = false;
  }

  // Apply gravity
  player.vy += GRAVITY;

  // Move player in x-direction
  player.x += player.vx;
  checkCollisionX();

  // Move player in y-direction
  player.y += player.vy;
  checkCollisionY();
}

function checkCollisionX() {
  // Player's tile boundaries
  const top = Math.floor(player.y / TILE_SIZE);
  const bottom = Math.floor((player.y + player.height - 1) / TILE_SIZE);
  const left = Math.floor(player.x / TILE_SIZE);
  const right = Math.floor((player.x + player.width - 1) / TILE_SIZE);

  // If out of level bounds, just ignore for now
  if (top < 0 || bottom >= levelData.length) return;

  // Check collisions horizontally
  if (player.vx > 0) {
    // Right side
    if (right < levelData[0].length) {
      for (let row = top; row <= bottom; row++) {
        if (levelData[row][right] === 1) {
          // Push player back
          player.x = right * TILE_SIZE - player.width;
          break;
        }
      }
    }
  } else if (player.vx < 0) {
    // Left side
    if (left >= 0) {
      for (let row = top; row <= bottom; row++) {
        if (levelData[row][left] === 1) {
          player.x = (left + 1) * TILE_SIZE;
          break;
        }
      }
    }
  }
}

function checkCollisionY() {
  const top = Math.floor(player.y / TILE_SIZE);
  const bottom = Math.floor((player.y + player.height - 1) / TILE_SIZE);
  const left = Math.floor(player.x / TILE_SIZE);
  const right = Math.floor((player.x + player.width - 1) / TILE_SIZE);

  if (left < 0 || right >= levelData[0].length) return;

  // Vertical collision
  if (player.vy > 0) {
    // Moving down
    if (bottom < levelData.length) {
      for (let col = left; col <= right; col++) {
        if (levelData[bottom][col] === 1) {
          // Land on top
          player.y = bottom * TILE_SIZE - player.height;
          player.vy = 0;
          player.onGround = true;
          return;
        }
      }
    }
    player.onGround = false;
  } else if (player.vy < 0) {
    // Moving up
    if (top >= 0) {
      for (let col = left; col <= right; col++) {
        if (levelData[top][col] === 1) {
          // Bump head
          player.y = (top + 1) * TILE_SIZE;
          player.vy = 0;
          return;
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw level
  for (let row = 0; row < levelData.length; row++) {
    for (let col = 0; col < levelData[row].length; col++) {
      if (levelData[row][col] === 1) {
        ctx.fillStyle = "#777";
        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  // Draw player
  ctx.fillStyle = "yellow";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
