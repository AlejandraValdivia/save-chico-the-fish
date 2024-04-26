# Save Chico the fish 🐠 from the hungry shark! 🦈

### Visit the page that hosts my game in GitHub to get started playing! Have fun!!

[http:https://alejandravaldivia.github.io/save-chico-the-fish/](https://alejandravaldivia.github.io/save-chico-the-fish/)

![save-chico-the-fish](img/save-chico-wireframe-1.jpeg)

## Approach taken and unsolved problems

This game was made using HTML, CSS, and JavaScript, using the Canvas JS library and DOM manipulation.

My approach was to create an easy-to-use interface for young children to play because I love children and have great memories of playing catch as many fish as possible before the timer went off and I lost the game.

I decided to adapt my childhood game to the game of a small fish called Chico who tries to swim as fast as possible to scape the hungry shark to survive and earns 100 points for every lap through the screen. If you win 300 or more points and scape the shark, you win!

I created the wireframes using Adobe XD. Although there are many options online for getting free game sprites, I preferred a more pixel-perfect cartoonization of the characters and the animation.

## Javascript

| Functions              | Description                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| Character              | Constructor to create Chico and Shark characters                         |
| addFishAround()        | Add fish and sea animals swimming around on the screen every two seconds |
| addNewShark()          | Display the shark swimming around randomly                               |
| gameLoop()             | Keeps track of characters interaction                                    |
| movementHandler(e)     | Detects character movements inside the canvas screen                     |
| detectHit(player, opp) | Detects collision between chico and the shark                            |
| restartGame()          | Restarts the game when hitting the 'play again' button                   |

I used the class Character to create `Chico` and the `Shark` characters.

```javascript
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
```

I created the `chicoCharacter` and the `shark` and display them on the loading screen before running the rest of the script.

```javascript
window.addEventListener("DOMContentLoaded", function () {
  chicoCharacter = new Character(200, 280, fishImg, 200, 250);
  shark = new Character(620, 400, sharkImg, 300, 300);
  setInterval(() => {
    addFishAround();
  }, 2000);

  const runGame = setInterval(gameLoop, 60);
});

document.addEventListener("keydown", movementHandler);
```

Then I created the function `addNewShark()` to display the shark swimming around randomly.

```javascript
function addNewShark() {
  shark.alive = false;
  setTimeout(function () {
    let randomX = Math.floor(Math.random() * game.width - 50);
    let randomY = Math.floor(Math.random() * game.height - 90);

    shark = new Character(randomX, randomY, sharkImg, 200, 420);
  }, 1000);

  return true;
}
```

I created JavaScript functions and event listeners that would handle the chico and shark `x` (horizontal position and movement) and `y`(vertical position and movement) axes positioning when swimming accross the screen.

```javascript
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
```

The `movementHandler` function handles keyboard input for controlling the movement of the chicoCharacter. The function takes an event object `e` as a parameter which represents the key that was pressed.

We first set chico's start speed to `const movementSpeed = 20;`.
The function checks the value of `e.key` to determine which key was pressed. If the key is either `W` or `Arrow Up`, it checks if decreasing the `y` position(moving down) of `chicoCharacter` by `movementSpeed` will be a valid position(i.e. not below 0). If it is valid, it updates the `y` position of chicoCharacter by subtracting movementSpeed.

If we use the `ArrowDown` or `S` key, it checks if increasing the `y` position of chicoCharacter by `movementSpeed` will result in a valid position(i.e. not above the game height minus the character height). If it is valid, it updates the `y` position of chicoCharacter by adding movementSpeed.

If the key is either `ArrowRight` or `D`, it checks if increasing the `x` position of `chicoCharacter` by `movementSpeed` will result in a valid position (i.e. not above the game width minus the character width). If it's valid, it updates the `x` position of the chicoCharacter by adding movementSpeed. Additionally, if the new `x` position is equal to or greater than the game width minus the character width, it updates the score, resets the `x` position of chicoCharacter, and adjusts the `sharkInterval`.

If the key is either `ArrowLeft` or `A`, it checks if decreasing the `x` position of `chicoCharacter` by `movementSpeed` will result in a valid position(i.e. not above the game width minus the character width). If it's valid it updates the `x` position of the chicoCharacter by subtracting movementSpeed.

I also created an `addFishAround()` function that would randomly display images of fish swimming around, getting each image created as a new character with the class Character, from the fishImages array and set an interval of 2 seconds between.

Code snippet to display fish species swimming around randomly.

```javascript
let swimmingFishArray = [];

function addFishAround() {
  setTimeout(() => {
    const fishImages = [
      "img/—Pngtree—yellow fish isolated on white_9144140.png",
      "img/10582592.png",
      "img/10582595.png",
      "img/10582611.png",
      "img/fishing-png-41470.png",
      "img/10717802.png",
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
```

Then I created the gameLoop() function where all the game logic happens with the characters

```javascript
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
```

The `gameLoop()` function checks for the player controls the chicoCharacter to avoid being eaten by the shark.
It is called repeatedly to update the game state and render the characters and fish on the canvas.

Inside the function, the canvas is cleared, the swimming fish are rendered, and the current position of chicoCharacter is displayed.

If the `chicoCharacter` reaches the right edge of the game screen, the score is updated gaining 100 points, the `chicoCharacter` is moved to the left edge of the screen, the shark interval is decreased, and the shark's position is updated.

If `chicoCharacter` reaches the score of 300, `the winGame()` function is called.

If the time elapsed since the last shark spawn is greated than the shark interval, a new shark is added, the previous shark time is updated, and the shark interval is increased.

If the shark is still alive, it is moved to the right by 5 units and rendered. The `detectHit()` function is called to check if there is a collision between the `chicoCharacter` and the `shark`. Finally, the chicoCharacter is rendered on the canvas.

The `detectHit()` function is called to check if there is a collision between the `chicoCharacter` and the `shark`.

```javascript
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
```

The `detectHit()` function checks for a collision between two objects represented by the `player` and the `opp`(opponent). If a collision is detected, it changes chico's image `fishImg` source to the `fishImg.src = "./img/bones.png"` appearing dead from the shark's attack. Moves chicoCharacter to a specific position, triggers the `lostGame()` function, removes the keydown event listener, and returns a new Shark. Otherwise, it returns false.

The `restart()` function is called when either chicoCharacter is killed or the player wants to restart the game.

```javascript
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
```

The `restart()` function resets the game state when is called. It changes chico's image to the original image at the start of the game, clears the `swimmingfishArray`, resets the score, sets the shark intervals, adds an event listener for keydown, updates the `shark` and `chicoCharacter`'s position, removes any win or lost messages, and then calls itself recursively.

The `winGame()`function is evaluated in the `gameLoop()` function when chicoCharacter newScore is === 300 or higher

```javascript
if (newScore === 300) {
  winGame();
}
```

then the `wingGame()` function is called.

```javascript
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
```

If you score 300 points or higher and scaped the shark, You Win!!
![save-chico-the-fish](img/save-chico-wireframe-win.jpeg)

Otherwise, the `lostGame()` function is evaluated when in the function `detectit()`, a collision is detected when the shark's position is too close to chicoCharacter and it creates a collision and kills chico, then the function `lostGame()` is called, displaying the lostMessage on the screen:

```javascript
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
```

Otherwise, if the shark gets 🦈 you.. You die! :(
![save-chico-the-fish](img/save-chico-wireframe-lost.jpeg)

## Steps to install on local computer

`Fork` and `clone` the repository
https://github.com/AlejandraValdivia/save-chico-the-fish to your computer and run the following command in the terminal:

`open index.html`

and view the game in the browser.

## Game Instructions

Help our friend Chico escape the hungry shark before he eats him!

Use `W`, `S`, `A`, `D` keys and or `Arrow keys` to swim through the game.

### Save chico the fish game screenshot

![save-chico-the-fish](img/save-chico-screenshot.jpeg)

## Unsolved problems

🔴 Making the game longer and more complicated to win including levels of complexity and speed.

🔴 I was not able to find free sound effects to include in the game.

## Future Additions

🎮 More levels of complexity and speed

🔊 Sound effects
