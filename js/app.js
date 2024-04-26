// Global variables
const game = document.getElementById("game");
const movement = document.getElementById("movement");
const score = document.getElementById("score");
score.textContent = "0";
const status = document.getElementById("status");
const ctx = game.getContext("2d");
let newScore = 0;
let chicoCharacter;
let shark;
let swimmingFish;
const fishImg = document.getElementById("chico-fish");
let initialSharkInterval = 5000;
let sharkInterval = initialSharkInterval;
let previousSharkTime = Date.now();
const sharkImg = document.getElementById("shark");

// ====================== PAINT INTIAL SCREEN ======================= //
window.addEventListener("DOMContentLoaded", function () {
  chicoCharacter = new Character(200, 280, fishImg, 200, 250);
  shark = new Character(620, 400, sharkImg, 300, 300);
  setInterval(() => {
    addFishAround();
  }, 2000); 

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

// ====== Fish swimming around =================
let swimmingFishArray = [];

function addFishAround() {
  setTimeout(() => {
    const fishImages = [
      "img/—Pngtree—yellow fish isolated on white_9144140.png",
      "img/10582595.png",
      "img/10582611.png",
      "img/fishing-png-41470.png",
      "img/10717802.png",
      'img/pngimg.com - dolphin_PNG9123.png',
      'img/transparent-octopus-octopus-swirly-tentacles-pink-purple-colorful-octopus-with-swirling-tentacles-on-black66160395eb6b04.91676288.png'
    ];
    const randomImageIndex = Math.floor(Math.random() * fishImages.length);
    const randomFishImage = new Image();
    randomFishImage.src = fishImages[randomImageIndex];

    randomFishImage.onload = function () {
      const newFish = new Character(
        Math.random() * game.width,
        Math.random() * game.height,
        randomFishImage,
        50,
        50
      );
      swimmingFishArray.push(newFish);
    };
  }, 2000);
}

// KEYBOARD LOGIC =================
function movementHandler(e) {
  const movementSpeed = 20;

  if (e.key === "ArrowUp" || e.key === "w") {
    chicoCharacter.y - movementSpeed >= 0
      ? (chicoCharacter.y -= movementSpeed)
      : null;
  } else if (e.key === "ArrowDown" || e.key === "s") {
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

    shark = new Character(randomX, randomY, sharkImg, 200, 420);
  }, 1000);

  return true;
}

// ====================== GAME PROCESSES ======================= //
function gameLoop() {
  ctx.clearRect(0, 0, game.width, game.height);
  swimmingFishArray.forEach((fish) => {
    fish.render();
  });
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
  swimmingFishArray = [];
  newScore = 0;
  score.textContent = newScore;
  initialSharkInterval = 5000;
  sharkInterval = initialSharkInterval;
  document.addEventListener("keydown", movementHandler);
  previousSharkTime = Date.now();
  chicoCharacter.render();
  shark.render();
  const winMessage = document.getElementsByClassName("win-message");
  if (winMessage.length) {
    winMessage[0].remove();
  }
  const lostMessage = document.getElementsByClassName("lost-message");
  if (lostMessage.length) {
    lostMessage[0].remove();
  }
  restartGame();
}

function winGame() {
  const winningMessage = document.createElement("div");
  winningMessage.setAttribute("class", "win-message");
  winningMessage.textContent = "Congratulations You win!";
  winningMessage.style.color = "green";
  winningMessage.style.fontSize = "60px";
  winningMessage.style.position = "absolute";
  winningMessage.style.background = "orange";
  winningMessage.style.width = "400px";
  winningMessage.style.padding = "20px";
  winningMessage.style.textAlign = "center";
  winningMessage.style.lineHeight = "50px";
  winningMessage.style.top = "50%";
  winningMessage.style.left = "50%";
  winningMessage.style.transform = "translate(-50%, -50%)";
  shark.alive = false;
  document.body.appendChild(winningMessage);
}

function lostGame() {
  const lostMessage = document.createElement("div");
  lostMessage.setAttribute("class", "lost-message");
  lostMessage.textContent = "Sorry You lost!";
  lostMessage.style.background = "black";
  lostMessage.style.color = "red";
  lostMessage.style.width = "400px";
  lostMessage.style.padding = "20px";
  lostMessage.style.textAlign = "center";
  lostMessage.style.lineHeight = "50px";
  lostMessage.style.fontSize = "60px";
  lostMessage.style.position = "absolute";
  lostMessage.style.top = "50%";
  lostMessage.style.left = "50%";
  lostMessage.style.transform = "translate(-50%, -50%)";
  document.body.appendChild(lostMessage);
}