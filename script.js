document.addEventListener("DOMContentLoaded", function () {
  const boardSize = 20;
  const cellSize = 20;
  const initialSpeed = 200;
  const speedIncrement = 10;
  const foodScore = 10;

  let gameBoard = document.getElementById("game-board");
  let cells = [];

  let snake = {
    body: [{ row: 10, col: 10 }],
    direction: "right",
    score: 0,
    speed: initialSpeed,
    intervalId: null,
  };

  let food = {
    row: getRandomNumber(boardSize),
    col: getRandomNumber(boardSize),
  };

  function createBoard() {
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        let cell = document.createElement("div");
        cell.className = "cell";
        gameBoard.appendChild(cell);
        cells.push(cell);
      }
    }
  }

  function updateBoard() {
    clearBoard();
    drawSnake();
    drawFood();
  }

  function clearBoard() {
    cells.forEach(function (cell) {
      cell.className = "cell";
    });
  }

  function drawSnake() {
    snake.body.forEach(function (segment) {
      let index = segment.row * boardSize + segment.col;
      cells[index].classList.add("snake"); // Adiciona a classe "snake"
    });
  }

  function drawFood() {
    let index = food.row * boardSize + food.col;
    cells[index].classList.add("food"); // Adiciona a classe "food"
  }

  function handleKeyPress(event) {
    let newDirection;
    switch (event.keyCode) {
      case 37:
        newDirection = "left";
        break;
      case 38:
        newDirection = "up";
        break;
      case 39:
        newDirection = "right";
        break;
      case 40:
        newDirection = "down";
        break;
    }

    if (newDirection && isValidDirection(newDirection)) {
      snake.direction = newDirection;
    }
  }

  function isValidDirection(newDirection) {
    let oppositeDirections = {
      left: "right",
      up: "down",
      right: "left",
      down: "up",
    };
    return snake.direction !== oppositeDirections[newDirection];
  }

  function moveSnake() {
    let head = { ...snake.body[0] };
    switch (snake.direction) {
      case "left":
        head.col--;
        break;
      case "right":
        head.col++;
        break;
      case "up":
        head.row--;
        break;
      case "down":
        head.row++;
        break;
    }
    snake.body.unshift(head);
    if (head.row === food.row && head.col === food.col) {
      snake.score += foodScore;
      generateNewFood();
      if (snake.score % 50 === 0) {
        increaseSpeed();
      }
    } else {
      snake.body.pop();
    }
    if (gameOver()) {
      clearInterval(snake.intervalId);
      alert("Game Over! Pontuação: " + snake.score);
      resetGame();
    } else {
      updateBoard();
    }
  }

  function generateNewFood() {
    food.row = getRandomNumber(boardSize);
    food.col = getRandomNumber(boardSize);
  }

  function increaseSpeed() {
    snake.speed -= speedIncrement;
    clearInterval(snake.intervalId);
    snake.intervalId = setInterval(moveSnake, snake.speed);
  }

  function gameOver() {
    let head = snake.body[0];
    if (
      head.row < 0 ||
      head.row >= boardSize ||
      head.col < 0 ||
      head.col >= boardSize
    ) {
      return true;
    }
    for (let i = 1; i < snake.body.length; i++) {
      if (head.row === snake.body[i].row && head.col === snake.body[i].col) {
        return true;
      }
    }
    return false;
  }
  
  function resetGame() {
    snake.body = [{ row: 10, col: 10 }];
    snake.direction = "right";
    snake.score = 0;
    snake.speed = initialSpeed;
    generateNewFood();
    updateBoard();
    snake.intervalId = setInterval(moveSnake, snake.speed);
  }
  
  function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
  }
  
  createBoard();
  updateBoard();
  snake.intervalId = setInterval(moveSnake, snake.speed);
  document.addEventListener("keydown", handleKeyPress);
});