import "./styles.scss";

const gameButton = document.querySelector("#gameButton");
const difficulty = document.querySelector('input[name="difficulty"]');
const root = document.querySelector(":root");
const level = [
  "#13dd23",
  "#13dd9b",
  "#8fe00e",
  "#8ddd0d",
  "#cbdd0d",
  "#d0dd0d",
  "#dd850d",
  "#f7735e",
  "#e24546",
  "#dd0f10",
];

function DotGame() {
  const board = document.querySelector(".game-board");
  const playerScore = document.querySelector("#playerScore");

  let play;
  // Move Dots
  let animateDot = window.requestAnimationFrame(move);
  function move() {
    if (game.gameInProgress && game.dots) {
      for (let dot of Object.keys(game.dots)) {
        game.dots[dot].move();
      }
    }

    animateDot = window.requestAnimationFrame(move);
  }

  this.gameInProgress = false;
  this.dots = {};
  this.boardHeight = board.offsetHeight;
  this.boardWidth = board.offsetWidth;
  this.speed = difficulty.value;
  this.score = 0;

  // start the game
  this.start = () => {
    play = setInterval(this.addDot, 1000);
    move();
  };

  // pause the game
  this.pause = () => {
    clearInterval(play);
  };

  // add a new dot
  this.addDot = () => {
    let dot = new Dot();

    game.dots[dot.id] = dot;
    board.appendChild(dot.dom());
  };

  // update score
  this.increaseScore = function (value) {
    this.score += value;
    playerScore.innerHTML = this.score;
  };

  // toggle game state
  this.toggleState = () => {
    if (!this.gameInProgress) {
      gameButton.innerHTML = "Pause";
      this.start();
    } else {
      gameButton.innerHTML = "Start";
      this.pause();
    }
    this.gameInProgress = !this.gameInProgress;
  };

  // change difficulty
  difficulty.oninput = (e) => {
    this.speed = difficulty.value;
    document.querySelector("#level").innerHTML = difficulty.value;
    root.style.setProperty("--level", level[difficulty.value - 1]);
  };

  // play/pause
  gameButton.addEventListener("click", () => game.toggleState());

  board.addEventListener("mousedown", (e) => {
    if (game.gameInProgress && e.target.dataset.ref) {
      let id = e.target.dataset.ref;
      let dot = game.dots[id];
      game.increaseScore(dot.points);
      delete game.dots[id];
      e.target.remove();
    }
  });
}

// Dots
function Dot() {
  const size = Math.ceil(Math.random() * 10) * 10;
  const createDot = document.createElement("span");
  const id = Date.now();

  this.id = id;
  this.y = -size;
  this.points = (size - 110) * -1;

  this.dom = function () {
    let speed = this.y + game.speed;

    createDot.setAttribute("data-ref", id);
    createDot.className = `dot`;
    createDot.style.height = `${size}px`;
    createDot.style.width = `${size}px`;
    createDot.style.left =
      Math.floor(Math.random() * (game.boardWidth - size + 1)) + "px";

    return createDot;
  };

  // dot movement
  this.move = () => {
    this.y += game.speed / 3;

    createDot.style.transform = `translateY(${this.y}px)`;
    // Game over
    if (this.y >= Math.ceil(game.boardHeight + size)) {
      gameover();
    }
  };
}

function gameover() {
  const gameOver = document.getElementById("gameOver");
  const playerScore = document.querySelector("#playerScore");
  document.querySelector("#finalScore").innerHTML = game.score;
  document.querySelector(".game-board").innerHTML = "";
  game.toggleState();
  game.score = 0;
  playerScore.innerHTML = 0;
  game.dots = {};
  gameOver.style.display = "flex";
  gameOver.addEventListener("click", () => (gameOver.style.display = "none"));
}

// initiate game
let game = new DotGame();
