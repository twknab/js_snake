// Initialize game state and audio
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const biteSound = document.getElementById("biteSound");
const gameOverSound = document.getElementById("gameOverSound");
const celebrationSound = document.getElementById("celebrationSound");
biteSound.volume = 0.2;
gameOverSound.volume = 0.2;
celebrationSound.volume = 0.2;

const boxSize = 40;
let snake = [{ x: 5, y: 5 }];
let food = {
  x: Math.floor(Math.random() * 20),
  y: Math.floor(Math.random() * 20),
};
let dx = 1,
  dy = 0;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("best").innerText = `Best: ${highScore}`;

// Listen for Keystrokes
document.addEventListener("keydown", function (event) {
  if (gameOver) {
    snake = [{ x: 5, y: 5 }];
    dx = 1;
    dy = 0;
    score = 0;
    gameOver = false;
    draw();
    return;
  }
  switch (event.keyCode) {
    case 37:
      if (dx === 0 && dy !== 0) {
        dx = -1;
        dy = 0;
      }
      break; // Left
    case 38:
      if (dy === 0 && dx !== 0) {
        dx = 0;
        dy = -1;
      }
      break; // Up
    case 39:
      if (dx === 0 && dy !== 0) {
        dx = 1;
        dy = 0;
      }
      break; // Right
    case 40:
      if (dy === 0 && dx !== 0) {
        dx = 0;
        dy = 1;
      }
      break; // Down
  }
});

const resetCanvas = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const drawSnake = () => {
  for (let cell of snake) {
    context.fillStyle = "yellow";
    context.fillRect(cell.x * boxSize, cell.y * boxSize, boxSize, boxSize);
  }
};

const drawFood = () => {
  context.fillStyle = "red";
  context.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);
};

const drawScore = () => {
  context.fillStyle = "white";
  context.font = '40px "Press Start 2P"';
  context.textAlign = "start"; // Default value
  context.textBaseline = "alphabetic"; // Default value
  context.fillText(score, 20, 50);
};

const moveSnake = () => {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  if (head.x === food.x && head.y === food.y) {
    eatFood(head);
  } else {
    snake.pop();
  }
  if (isCollision(head)) {
    handleCollision();
  } else {
    snake.unshift(head);
  }
};

const eatFood = (head) => {
  food = {
    x: Math.floor(Math.random() * 20),
    y: Math.floor(Math.random() * 20),
  };
  score++;
  biteSound.play();
};

const isCollision = (head) => {
  return (
    head.x < 0 ||
    head.x >= 20 ||
    head.y < 0 ||
    head.y >= 20 ||
    snake.some((cell) => cell.x === head.x && cell.y === head.y)
  );
};

const handleCollision = () => {
  gameOver = true;
  gameOverSound.play();
  context.fillStyle = "white";
  context.font = '70px "Press Start 2P"';
  context.strokeStyle = "yellow";
  context.lineWidth = 5;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  context.strokeText("GAME OVER", canvas.width / 2, canvas.height / 2);
  if (score > highScore) {
    localStorage.setItem("highScore", score);
    document.getElementById("best").innerText = `Best: ${score}`;
    celebrationSound.play();
    context.font = '40px "Press Start 2P"';
    context.fillText(
      "New Best Score!",
      canvas.width / 2,
      canvas.height / 2 + 50
    );
  }
};

function draw() {
  if (gameOver) {
    return;
  }

  resetCanvas();
  drawSnake();
  drawFood();
  drawScore();
  moveSnake();

  setTimeout(draw, 100); // change val to set speed of snake)
}

draw();
