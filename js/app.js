// Global DOM manipulation / variables
const game = document.getElementById("game");
const movement = document.getElementById("movement");
const score = document.getElementById("score");
const status = document.getElementById("status");
const ctx = game.getContext("2d");
let chicoCharacter;
let shark;
const fishImg = document.getElementById("chico-fish");
let initialSharkInterval = 5000;
let sharkInterval = initialSharkInterval;
let previousSharkTime = Date.now();
// fishImg.style.position = "absolute";
// fishImg.style.width = "100px";
// fishImg.style.height = "100px";
// fishImg.style.display = "block";
// fishImg.style.top = "350px";
// fishImg.style.left = "500px";

// console.log(fishImg);
const sharkImg = document.getElementById("shark");
// console.log(sharkImg);
// ====================== PAINT INTIAL SCREEN ======================= //
// EVENT LISTENERS
window.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded");
  chicoCharacter = new Character(200, 280, fishImg, 60, 80);
  shark = new Character(620, 400, sharkImg, 120, 220);
  

  console.log("shark", sharkImg);
  // run a game loop
  const runGame = setInterval(gameLoop, 60);
});

document.addEventListener("keydown", movementHandler);

// ====================== SETUP FOR CANVAS RENDERING ======================= //
// 2D rendering context for canvas element
// This is used for drawing shapes, text, images, etc.
game.setAttribute("height", getComputedStyle(game)["height"]);
game.setAttribute("width", getComputedStyle(game)["width"]);

// ====================== ENTITIES ======================= //
class Crawler {
  constructor(x, y, color, width, height) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
    this.height = height;
    this.alive = true;

    this.render = function () {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    };
  }
}

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
  console.log("--movement: " + e.key);
  if (e.key === "ArrowUp" || e.key === "w") {
    chicoCharacter.y - 10 >= 0 ? (chicoCharacter.y -= 10) : null;
  } else if (e.key === "ArrowDown" || e.key === "s") {
    console.log("game height :", game.height);
    chicoCharacter.y + 10 <= game.height - chicoCharacter.height
      ? (chicoCharacter.y += 10)
      : null;
  } else if (e.key === "ArrowRight" || e.key === "d") {
    chicoCharacter.x + 10 <= game.width - chicoCharacter.width
      ? (chicoCharacter.x += 10)
      : null;
  } else if (e.key === "ArrowLeft" || e.key === "a") {
    chicoCharacter.x - 10 >= 0 ? (chicoCharacter.x -= 10) : null;
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
  if (Date.now() - previousSharkTime > sharkInterval){
    addNewShark();
    previousSharkTime = Date.now();
    sharkInterval += 1000;
  }
  if (shark.alive) {
    shark.render();
    let hit = detectHit(chicoCharacter, shark);
    
  }
  chicoCharacter.render();
}

// ====================== COLLISION DETECTION ======================= //
function detectHit(player, opp) {
  // hittest returns a boolean
  let hitTest =
    player.y + player.height > opp.y &&
    player.y < opp.y + opp.height &&
    player.x + player.width > opp.x &&
    player.x < opp.x + opp.width;
  // console.log("we have a hit", hitTest);
  if (hitTest) {
    // add 100 points to the current score
    // console.log(score.textContent); // dataType? Number
    let newScore = Number(score.textContent) + 100;
    score.textContent = newScore;
    // update status
    setTimeout(function () {
      status.textContent = "The shark is hit!";
      const typed = new Typed("#status", {
        strings: ["The shark is hit!", "You got him!", "Target acquired!"],
        typeSpeed: 50,
        backSpeed: 50,
        backDelay: 1000,
        // loop: true
      });
    }, 250);

    setTimeout(function () {
      status.textContent = "Oh, no!! The shark is back!";
    }, 10000);
    // return a new shrek with the addNewShrek function
    return addNewShark(); // true
  } else {
    return false;
  }
}
// ====================== EXTRAS ======================= //
// Level up:
