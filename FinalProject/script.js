
// Variables to track elapsed time
let lastTime = 0;
let elapsedTime = 0;
var isKeyHeld = false;
let keysPressed = {};

function gameLoop(timestamp) {
    if (lastTime !== 0) {
        elapsedTime += timestamp - lastTime;
    }
    lastTime = timestamp;

    while (elapsedTime >= 16.67) {
        update();
        render();  // Update the game state
        processInput();
        elapsedTime -= 16.67;
    }
    // Render the game state
    requestAnimationFrame(gameLoop);
}
function processInput(){
    // Process each pressed key
    for (let keyCode in keysPressed) {
        if (keysPressed[keyCode]) {
            gameState.currentScene.onKeyPress((keyCode));
        }
    }
}

function update() {
    gameState.totalTime += elapsedTime;
    gameState.updateScene();
    // Update the game state here
} 

function render() {
    gameState.drawCurrentScene();
}

function keyDownHandler(event) {
    const keyCode = event.code;
    keysPressed[keyCode] = true; // Set the key state to true when pressed
}

function keyUpHandler(event) {
    const keyCode = event.code;
    keysPressed[keyCode] = false; // Set the key state to false when released
}

var resources = {};
//Put in sprites that need loaded here, these sprites should be sorted. IE Resources.Audio.Thrust or Resouces.Sprites.Player


const gameState = new GameState("gameSpace", resources);
gameState.changeScene(new MainMenuScene("gameSpace", gameState))
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
requestAnimationFrame(gameLoop);
