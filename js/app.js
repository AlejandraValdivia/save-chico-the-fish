// Global DOM manipulation / variables
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
// fishImg.style.position = "absolute";
// fishImg.style.width = "100px";
// fishImg.style.height = "100px";
// fishImg.style.display = "block";
// fishImg.style.top = "350px";
// fishImg.style.left = "500px";

const sharkImg = document.getElementById("shark");
const twoSharksImg = document.getElementById("two-sharks");
// console.log(sharkImg);
// ====================== PAINT INTIAL SCREEN ======================= //
// EVENT LISTENERS
window.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded");
  chicoCharacter = new Character(200, 280, fishImg, 200, 250);
  shark = new Character(620, 400, sharkImg, 300, 300);
  //   twoSharks = new Character(200, 300, twoSharksImg, 300, 300); //

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

function sharkMovement(e) {
  twoSharks.push(e);
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
// This function takes care of the game and everytyhing the characters are doing
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
  // hittest returns a boolean
  let hitTest =
    player.y + player.height > opp.y &&
    player.y < opp.y + opp.height &&
    player.x + player.width > opp.x &&
    player.x < opp.x + opp.width;
  // console.log("we have a hit", hitTest);
  if (hitTest) {
    fishImg.src = "./img/bones.png";
    chicoCharacter.x = 200;
    chicoCharacter.y = 280;

    // call loose function
    lostGame();

    document.removeEventListener("keydown", movementHandler);
    // add100 points to the current score
    // console.log(score.textContent); // dataType? Number

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
// --------- Restart game
//  when someone clicks on the restart button make an event listener, call a function
// that i have to make (restartGame) reset all of my important varibles
//initialSharkInterval, sharkInterval
//change the shark.x position to update the previousShark time to Date.Now(), clear canvas
// render chicoCarachter

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

// Level up:

// twoSharks = new Character(randomX, randomY, twoSharksImg, 200, 420);
// when you win
// create a variable counter
// every time you make it to the end add by 100 once you make it to 500 points you win and display a
// message: you win

function winGame() {
  const winningMessage = document.createElement("div");
  winningMessage.setAttribute("class", "win-message");
  winningMessage.textContent = "Congratulations You win!";
  winningMessage.style.color = "green";
  winningMessage.style.fontSize = "24px";
  winningMessage.style.position = "absolute"; // Position the message
  winningMessage.style.top = "50%"; // Center vertically
  winningMessage.style.left = "50%"; // Center horizontally
  winningMessage.style.transform = "translate(-50%, -50%)"; // Center the message
  document.body.appendChild(winningMessage);
}

function lostGame() {
  const lostMessage = document.createElement("div");
  lostMessage.setAttribute("class", "lost-message");
  lostMessage.textContent = "Sorry You lost!";
  lostMessage.style.color = "red";
  lostMessage.style.fontSize = "24px";
  lostMessage.style.position = "absolute"; // Position the message
  lostMessage.style.top = "50%"; // Center vertically
  lostMessage.style.left = "50%"; // Center horizontally
  lostMessage.style.transform = "translate(-50%, -50%)"; // Center the message
  document.body.appendChild(lostMessage);
}
