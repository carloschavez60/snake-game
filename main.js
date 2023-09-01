// 1. Game Constants and Variables

// Game Constants

const GAME_SPACE_WIDTH = 800 // in px
const GAME_PIXEL_WIDTH = 20  // in px
const GAME_SPACE_PIXEL_WIDTH = GAME_SPACE_WIDTH/GAME_PIXEL_WIDTH

// Game Variables

const game = {
  score: 0,
  frameDuration: 0,
  isOver: false,
  mainLoopIsRunning: false,
  maxScore: 0,
}

// 2. Entities

const snake = {
  position: [{ x: 0, y: 0 }],
  direction: '',
  hasEatenFood: false,
}

const food = {
  position: { x: 0, y: 0 },
}

// 3. Systems

// 3.1. Input System

// correct snake direction
function correctSnakeDirection(e) {
  switch (e.key) {
    case 'ArrowUp':
      if (snake.direction !== 'down') {
          snake.direction = 'up'
      }
      break
    case 'ArrowRight':
      if (snake.direction !== 'left') {
          snake.direction = 'right'
      }
        break
    case 'ArrowDown':
      if (snake.direction !== 'up') {
          snake.direction = 'down'
      }
      break
    case 'ArrowLeft':
      if (snake.direction !== 'right') {
          snake.direction = 'left'
      }
      break
  }
}

// 3.2. Collision System

function checkCollisions() {
  if (snakeIsEatingFood()) {
    game.score++
    game.frameDuration -= 2

    snake.hasEatenFood = true

    food.position = {
      x: generateRandomPosition(),
      y: generateRandomPosition(),
    }
  }

  if (snakeIsOutOfMap()) {
    game.isOver = true
  }

  if (snakeIsEatingItself()) {
    game.isOver = true
  }
}

function snakeIsEatingFood() {
  const head = snake.position[0]
  return head.x === food.position.x && head.y === food.position.y
}

function snakeIsOutOfMap() {
  const head = snake.position[0]
  return head.x < 0 || head.x >= GAME_SPACE_WIDTH || head.y < 0 || head.y >= GAME_SPACE_WIDTH
}

function snakeIsEatingItself() {
  const head = snake.position[0]
  for (let i = 1; i < snake.position.length; i++) {
    const part = snake.position[i]
    if (head.x === part.x && head.y === part.y) {
      return true
    }
  }
  return false
}

// 3.3. Physcis System

function moveSnake() {
  if (snake.hasEatenFood) {
    snake.position.push({})
  }

  const head = snake.position[0]
  const newHead = {...head}

  switch(snake.direction) {
    case 'up':
      newHead.y -= GAME_PIXEL_WIDTH
      break
    case 'right':
      newHead.x += GAME_PIXEL_WIDTH
      break
    case 'down':
      newHead.y += GAME_PIXEL_WIDTH
      break
    case 'left':
      newHead.x -= GAME_PIXEL_WIDTH
      break
  }

  snake.position.unshift(newHead)
  snake.position.pop()

  snake.hasEatenFood = false
}

// 3.4. Draw System

// 3.4.1. Draw Tools

const canvas = document.querySelector('canvas')
canvas.width = GAME_SPACE_WIDTH
canvas.height = GAME_SPACE_WIDTH

const ctx = canvas.getContext('2d')

// 3.4.2. Draw

function drawGame() {
  // erase previous world to draw a new one
  ctx.clearRect(0, 0, GAME_SPACE_WIDTH, GAME_SPACE_WIDTH)

  // draw entities
  drawFood()
  drawSnake()

  // other draws
  drawScore()
}

function drawFood() {
  ctx.fillStyle = 'red'
  ctx.fillRect(food.position.x, food.position.y, GAME_PIXEL_WIDTH, GAME_PIXEL_WIDTH)
}

function drawSnake() {
  // draw head
  ctx.fillStyle = '#3A5A40'
  ctx.fillRect(snake.position[0].x, snake.position[0].y, GAME_PIXEL_WIDTH, GAME_PIXEL_WIDTH)

  // draw body
  ctx.fillStyle = '#A3B18A'
  for (let i = 1; i < snake.position.length; i++) {
    ctx.fillRect(snake.position[i].x, snake.position[i].y, GAME_PIXEL_WIDTH, GAME_PIXEL_WIDTH)
  }
}

function drawScore() {
  ctx.fillStyle = 'white'
  ctx.font = '20px Arial'
  ctx.fillText(`Score: ${game.score} | Max Score: ${game.maxScore}`, GAME_SPACE_WIDTH/2 - 100, GAME_PIXEL_WIDTH)
}

function drawGameOver() {
  ctx.fillStyle = 'white'
  ctx.font = '20px Arial'
  ctx.fillText('Game Over', GAME_SPACE_WIDTH/2 - 50, GAME_SPACE_WIDTH/2)
}

// 3.5. Utility System

function generateRandomPosition() {
  return Math.floor(Math.random() * GAME_SPACE_PIXEL_WIDTH) * GAME_PIXEL_WIDTH
}

// 4. Set initial game state

function setInitialGameState() {
  // set max score
  if (game.score > game.maxScore) {
    game.maxScore = game.score
  }

  // set initial state of game variables
  game.score = 0
  game.frameDuration = 100
  game.isOver = false

  // set initial state of entities
  snake.position = [{ x: GAME_SPACE_WIDTH/2, y: GAME_SPACE_WIDTH/2 }]
  snake.direction = 'right'
  snake.hasEatenFood = false

  food.position = {
    x: generateRandomPosition(),
    y: generateRandomPosition(),
  }

  // call first main loop
  if (!game.mainLoopIsRunning) {
    mainLoop()
    game.mainLoopIsRunning = true
  }
}

// 5. Main Loop

function mainLoop() {
  // 5.1. check if game is over
  if (game.isOver === true) {
    drawGameOver()
    game.mainLoopIsRunning = false
    return
  }

  // 5.2. get user input (It was separated as an event listener)

  // 5.3. process last state and change world state

  // object awareness
  checkCollisions()

  // object state changes independent of trigger effects
  moveSnake()

  // 5.4. draw game
  drawGame()

  // loop
  setTimeout(mainLoop, game.frameDuration)
}

// Start Game button
document.querySelector('button').addEventListener('click', setInitialGameState)

// 5.2. get user input
document.addEventListener('keydown', correctSnakeDirection)
