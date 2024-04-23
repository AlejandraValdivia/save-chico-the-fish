const game = document.getElementById("game");
const movement = document.getElementById("movement");
const score = document.getElementById("score");
const status = document.getElementById("status");
const ctx = game.getContext("2d");
let newScore = 0;
let chicoCharacter;
let shark;
let twoSharks;
const fishImg = document.getElementById("chico-fish");
let initialSharkInterval = 5000;
let sharkInterval = initialSharkInterval;
let previousSharkTime = Date.now();

const sharkImg = document.getElementById("shark");
const twoSharksImg = document.getElementById("two-sharks");

// ====================== PAINT INTIAL SCREEN ======================= //
window.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded");
  chicoCharacter = new Character(200, 280, fishImg, 200, 250);
  shark = new Character(620, 400, sharkImg, 300, 300);

  const runGame = setInterval(gameLoop, 60);
});

document.addEventListener("keydown", movementHandler);

// ====================== SETUP FOR CANVAS RENDERING ======================= //

game.setAttribute("height", getComputedStyle(game)["height"]);
game.setAttribute("width", getComputedStyle(game)["width"]);

// ====================== ENTITIES ======================= //

class Character {
  constructor(x, y, image, height, width) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.width = width;
    this.height = height;
    this.alive = true;

    this.render = function () {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
  }
}

// KEYBOARD LOGIC =================
function movementHandler(e) {
  const movementSpeed = 20;

  if (e.key === "ArrowUp" || e.key === "w") {
    chicoCharacter.y - movementSpeed >= 0
      ? (chicoCharacter.y -= movementSpeed)
      : null;
  } else if (e.key === "ArrowDown" || e.key === "s") {
    console.log("game height :", game.height);
    chicoCharacter.y + movementSpeed <= game.height - chicoCharacter.height
      ? (chicoCharacter.y += movementSpeed)
      : null;
  } else if (e.key === "ArrowRight" || e.key === "d") {
    if (chicoCharacter.x + movementSpeed >= game.width - chicoCharacter.width) {
      newScore = Number(score.textContent) + 100;
      score.textContent = newScore;
      chicoCharacter.x = 0;
      sharkInterval -= 2000;
      shark.x += 100;
    } else {
      chicoCharacter.x += movementSpeed;
    }
  } else if (e.key === "ArrowLeft" || e.key === "a") {
    chicoCharacter.x - movementSpeed >= 0
      ? (chicoCharacter.x -= movementSpeed)
      : null;
  }
}

// ====================== HELPER FUNCTIONS ======================= //

function addNewShark() {
  shark.alive = false;
  setTimeout(function () {
    let randomX = Math.floor(Math.random() * game.width - 50);
    let randomY = Math.floor(Math.random() * game.height - 90);
    const colors = [
      "yellow",
      "purple",
      "cyan",
      "gold",
      "blue",
      "peru",
      "red",
      "green",
    ];
    let randomIndex = Math.floor(Math.random() * colors.length - 1);
    let randomColor = colors[randomIndex];
    shark = new Character(randomX, randomY, sharkImg, 200, 420);
  }, 1000);

  return true;
}

// ====================== GAME PROCESSES ======================= //
function gameLoop() {
  ctx.clearRect(0, 0, game.width, game.height);
  movement.textContent = `X: ${chicoCharacter.x}\nY: ${chicoCharacter.y}`;
  if (chicoCharacter.x >= game.width - chicoCharacter.width) {
    newScore = Number(score.textContent) + 100;
    score.textContent = newScore;
    chicoCharacter.x = 0;
    sharkInterval -= 2000;
    shark.x += 100;
  }
  if (newScore === 300) {
    winGame();
  }
  if (Date.now() - previousSharkTime > sharkInterval) {
    addNewShark();
    previousSharkTime = Date.now();
    sharkInterval += 1000;
  }
  if (shark.alive) {
    shark.x += 5;
    shark.render();
    let hit = detectHit(chicoCharacter, shark);
  }
  chicoCharacter.render();
}

// ====================== COLLISION DETECTION ======================= //
function detectHit(player, opp) {
  let hitTest =
    player.y + player.height > opp.y &&
    player.y < opp.y + opp.height &&
    player.x + player.width > opp.x &&
    player.x < opp.x + opp.width;

  if (hitTest) {
    fishImg.src = "./img/bones.png";
    chicoCharacter.x = 200;
    chicoCharacter.y = 280;

    lostGame();

    document.removeEventListener("keydown", movementHandler);

    setTimeout(function () {
      status.textContent = "The shark is hit!";
      const typed = new Typed("#status", {
        strings: ["The shark is hit!", "You got him!", "Target acquired!"],
        typeSpeed: 50,
        backSpeed: 50,
        backDelay: 1000,
      });
    }, 250);

    setTimeout(function () {
      status.textContent = "Oh, no!! The shark is back!";
    }, 10000);
    return addNewShark(); 
  } else {
    return false;
  }
}

// ====================== EXTRAS ======================= //
const restart = document.getElementById("restart");
restart.addEventListener("click", restartGame);
function restartGame() {
  fishImg.src = "./img/10550885.png";
  let newScore = 0;
  score.textContent = newScore;
  initialSharkInterval = 5000;
  sharkInterval = initialSharkInterval;
  ctx.clearRect(0, 0, game.width, game.height);
  document.addEventListener("keydown", movementHandler);
  previousSharkTime = Date.now();
  chicoCharacter.render();
  shark.render();
  const winMessage = document.querySelector(".win-message");
  if (winMessage) {
    winMessage.remove();
  }
  const lostMessage = document.querySelector(".lost-message");
  if (lostMessage) {
    lostMessage.remove();
  }
}

function winGame() {
  const winningMessage = document.createElement("div");
  winningMessage.setAttribute("class", "win-message");
  winningMessage.textContent = "Congratulations You win!";
  winningMessage.style.color = "green";
  winningMessage.style.fontSize = "24px";
  winningMessage.style.position = "absolute";
  winningMessage.style.top = "50%";
  winningMessage.style.left = "50%";
  winningMessage.style.transform = "translate(-50%, -50%)";
  document.body.appendChild(winningMessage);
}

function lostGame() {
  const lostMessage = document.createElement("div");
  lostMessage.setAttribute("class", "lost-message");
  lostMessage.textContent = "Sorry You lost!";
  lostMessage.style.color = "red";
  lostMessage.style.fontSize = "24px";
  lostMessage.style.position = "absolute";
  lostMessage.style.top = "50%";
  lostMessage.style.left = "50%";
  lostMessage.style.transform = "translate(-50%, -50%)";
  document.body.appendChild(lostMessage);
}
