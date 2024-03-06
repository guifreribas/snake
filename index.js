const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const $button = document.getElementById("button");
const $body = document.querySelector("body");
const $levelSelector = document.querySelector("select");
const $scoreNumber = document.querySelector(".score__number");
const pickSound = new Audio("sounds/pick.mp3");
const gameOverSound = new Audio("sounds/game-over.mp3");

let rightPressed = false;
let leftPressed = true;
let upPressed = false;
let downPressed = false;
let direction = "left";
let snakeSpeed = 2;
let score = 0;
const snakePartSize = 6;
let time = 0;
const initialSnakePosition = [
  { x: 200, y: 200 },
  { x: 206, y: 200 },
  { x: 212, y: 200 },
  { x: 218, y: 200 },
  { x: 224, y: 200 },
  { x: 230, y: 200 },
];

const ballRadius = 3;
//ball position
let x = canvas.width / 2;
let y = canvas.height - 30;

let snakePositionX = 200;
let snakePositionY = 200;

let snakeXWidth = 24;
let snakeYHeight = 3;

let snake = initialSnakePosition;

let snakeLength = snakeXWidth / snakeYHeight;

let moveDirection = "right";
let isXMov = true;

$levelSelector.addEventListener("change", (event) => {
  console.log(event.target.value);
  snakeSpeed = event.target.value;
});

function ballDraw() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function snakeDraw() {
  snake.forEach((snakePart, idx) => {
    if (idx === 0) ctx.fillStyle = "black";
    else ctx.fillStyle = "green";
    ctx.fillRect(snakePart.x, snakePart.y, snakePartSize, snakePartSize);
  });
}

function snakeMovement() {
  // if (time <= snakeSpeed) {
  //   time++;
  //   return;
  // }
  // time = 0;
  if (snake[0].x < 0 || snake[0].x > canvas.width || snake[0].y < 0 || snake[0].y > canvas.height) {
    // document.location.reload();
    gameOverSound.play();
    alert("Game Over");
    snake = initialSnakePosition;
    cleanCanvas();
    document.location.reload();
    return;
  }
  if (rightPressed) {
    moveDirection = "right";
    snake = snake.map((snakePart, i, oldSnake) => {
      if (i === 0) return { x: snakePart.x + snakePartSize, y: snakePart.y };
      return oldSnake[i - 1];
    });
  } else if (leftPressed) {
    moveDirection = "left";
    snake = snake.map((snakePart, i, oldSnake) => {
      if (i === 0) return { x: snakePart.x - snakePartSize, y: snakePart.y };
      return oldSnake[i - 1];
    });
  } else if (upPressed) {
    moveDirection = "up";
    snake = snake.map((snakePart, i, oldSnake) => {
      if (i === 0) return { x: snakePart.x, y: snakePart.y - snakePartSize };
      return oldSnake[i - 1];
    });
  } else if (downPressed) {
    moveDirection = "down";
    snake = snake.map((snakePart, i, oldSnake) => {
      if (i === 0) return { x: snakePart.x, y: snakePart.y + snakePartSize };
      return oldSnake[i - 1];
    });
  }
}

function snakeCollision() {
  if (
    snake[0].x < x + ballRadius &&
    snake[0].x + snakePartSize > x - ballRadius &&
    snake[0].y < y + ballRadius &&
    snake[0].y + snakePartSize > y - ballRadius
  ) {
    x = Math.floor(Math.random() * canvas.width);
    y = Math.floor(Math.random() * canvas.height);
    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
    score++;
    $scoreNumber.textContent = score;
    pickSound.play();
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      gameOverSound.play();
      alert("Game Over");
      snake = initialSnakePosition;
      cleanCanvas();
      document.location.reload();
      break;
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
  if (time < snakeSpeed) {
    time++;
  } else {
    time = 0;
    cleanCanvas();
    ballDraw();
    snakeDraw();
    snakeMovement();
    snakeCollision();
  }

  window.requestAnimationFrame(draw);
}

$button.addEventListener("click", () => {
  const $counter = $body.appendChild(document.createElement("p"));
  $counter.classList.add("counter");
  $counter.textContent = "1";
  cleanCanvas();
  ballDraw();
  snakeDraw();
  snakeMovement();
  snakeCollision();

  setTimeout(() => {
    $counter.textContent = "Ready";
  }, 1000);

  setTimeout(() => {
    $counter.textContent = "Go!";
    $counter.remove();
    draw();
    initEvents();
  }, 2000);
});
