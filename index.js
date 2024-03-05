const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const $button = document.getElementById("button");

let rightPressed = false;
let leftPressed = true;
let upPressed = false;
let downPressed = false;
let direction = "left";
const snakeSpeed = 3;

const ballRadius = 1.5;
//ball position
let x = canvas.width / 2;
let y = canvas.height - 30;

let snakePositionX = 200;
let snakePositionY = 200;

let snakeXWidth = 24;
let snakeYHeight = 3;

let snake = [
  { x: 200, y: 200 },
  { x: 203, y: 200 },
  { x: 206, y: 200 },
  { x: 209, y: 200 },
  { x: 212, y: 200 },
  { x: 215, y: 200 },
  { x: 218, y: 200 },
];
// let snake = [
//   { x: 200, y: 200 },
//   { x: 203, y: 200 },
//   { x: 206, y: 200 },
//   { x: 209, y: 200 },
//   { x: 212, y: 200 },
//   { x: 215, y: 200 },
//   { x: 218, y: 200 },
// ];

let snakeLength = snakeXWidth / snakeYHeight;

let moveDirection = "right";
let isXMov = true;

function ballDraw() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function snakeDraw() {
  snake.forEach((snakePart) => {
    ctx.fillStyle = "green";
    ctx.fillRect(snakePart.x, snakePart.y, snakeSpeed, snakeSpeed);
  });
}

function snakeMovement() {
  if (snake[0].x < 0 || snake[0].x > canvas.width || snake[0].y < 0 || snake[0].y > canvas.height) {
    // document.location.reload();
    alert("Game Over");
  }
  if (rightPressed) {
    moveDirection = "right";
    snake = snake.map((snakePart, i, oldSnake) => {
      if (i === 0) return { x: snakePart.x + snakeSpeed, y: snakePart.y };
      return oldSnake[i - 1];
    });
  } else if (leftPressed) {
    moveDirection = "left";
    snake = snake.map((snakePart, i, oldSnake) => {
      if (i === 0) return { x: snakePart.x - snakeSpeed, y: snakePart.y };
      return oldSnake[i - 1];
    });
  } else if (upPressed) {
    moveDirection = "up";
    snake = snake.map((snakePart, i, oldSnake) => {
      if (i === 0) return { x: snakePart.x, y: snakePart.y - snakeSpeed };
      return oldSnake[i - 1];
    });
  } else if (downPressed) {
    moveDirection = "down";
    snake = snake.map((snakePart, i, oldSnake) => {
      if (i === 0) return { x: snakePart.x, y: snakePart.y + snakeSpeed };
      return oldSnake[i - 1];
    });
  }
}

function snakeCollision() {
  if (snake[0].x < x + ballRadius && snake[0].x + snakeSpeed > x - ballRadius && snake[0].y < y + ballRadius && snake[0].y + snakeSpeed > y - ballRadius) {
    x = Math.floor(Math.random() * canvas.width);
    y = Math.floor(Math.random() * canvas.height);
    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      alert("Game Over");
      document.location.reload();
    }
  }
}

function initEvents() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" && !leftPressed) {
      direction = "right";
      rightPressed = true;
      leftPressed = false;
      upPressed = false;
      downPressed = false;
    } else if (event.key === "ArrowLeft" && !rightPressed) {
      direction = "left";
      leftPressed = true;
      rightPressed = false;
      upPressed = false;
      downPressed = false;
    } else if (event.key === "ArrowUp" && !downPressed) {
      direction = "up";
      upPressed = true;
      rightPressed = false;
      leftPressed = false;
      downPressed = false;
    } else if (event.key === "ArrowDown" && !upPressed) {
      direction = "down";
      downPressed = true;
      rightPressed = false;
      leftPressed = false;
      upPressed = false;
    }
  });
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  cleanCanvas();
  ballDraw();
  snakeDraw();
  snakeMovement();
  snakeCollision();

  window.requestAnimationFrame(draw);
}

$button.addEventListener("click", () => {
  console.log("clicked");
  cleanCanvas();
  ballDraw();
  snakeDraw();
  snakeMovement();
  snakeCollision();

  setTimeout(() => {
    draw();
    initEvents();
  }, 2000);
});
