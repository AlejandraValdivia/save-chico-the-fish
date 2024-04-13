// Global DOM manipulation / variables
const game = document.getElementById("game");
const movement = document.getElementById("movement");
const score = document.getElementById("score");
const status = document.getElementById("status");
const ctx = game.getContext("2d");
let chicoCharacter;
let shark;
const fishImg = document.getElementById("chico-fish");
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
  chicoCharacter = new Character(200, 280, fishImg, 20, 40);
  shark = new Character(20, 80, sharkImg, 250, 100);

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
    this.height = height;
    this.alive = true;

    this.render = function () {
      ctx.drawImage(this.x, this.y, this.image, this.width, this.height);
    };
  }
}

// let rambo = new Crawler(600, 200, "red", 75, 75);
// rambo.render(); // test the rambo(Crawler) instance

let testCrawler = new Crawler(150, 20, "blue", 100, 100);
testCrawler.render();

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
    const colors = ["#bada55", "purple", "cyan", "gold", " blue"];
    let randomIndex = Math.floor(Math.random() * colors.length - 1);
    let randomColor = colors[randomIndex];
    shark = new Character(randomX, randomY, shark, 200, 120);
  }, 10000);
  return true;
}

// ====================== GAME PROCESSES ======================= //
function gameLoop() {
  ctx.clearRect(0, 0, game.width, game.height);
  movement.textContent = `X: ${chicoCharacter.x}\nY: ${chicoCharacter.y}`;
  if (chicoCharacter.alive) {
    chicoCharacter.render();
  }
  mushroomCharacter.render();
}

// ====================== COLLISION DETECTION ======================= //

// ====================== EXTRAS ======================= //
