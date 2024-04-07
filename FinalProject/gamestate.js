class GameState {
    constructor(gameSpace, resources) {
        this.gameSpace = gameSpace;
        this.backgroundImage = new Image();
        this.controls = { // Example structure for controls

            //Put defualt Controls Here
            buttonOne: "ArrowUp",
            buttonTwo: "ArrowLeft",
            buttonThree: "ArrowRight",
            //Try and avoid chaning this back button ever, things kinda break
            back: "Escape"
        };
        this.resources = resources
        this.backgroundImage.src  = this.resources.backGroundImage;
        this.currentScene = null; // Reference to the current scene
        this.isKeyHeld = false;
        this.totalTime = null;
        this.score = 0;

        if (!localStorage.getItem('controls')) {
            // If it doesn't exist, create it and populate with default controls
            localStorage.setItem('controls', JSON.stringify(this.controls));
        } else {
            // If it exists, update this.controls with the stored controls
            this.controls = JSON.parse(localStorage.getItem('controls'));

        }
        
    }

    // Method to draw the current scene
    drawCurrentScene() {
        if (this.currentScene)
            this.currentScene.draw();
    }

    updateScene(){
        if (this.currentScene)
            this.currentScene.update();
    }

    // Method to change the current scene
    changeScene(scene) {
        if (this.currentScene){
            // Clear the gameSpace div if a scene is currently drawn
            const gameSpace = document.getElementById('gameSpace');
            gameSpace.innerHTML = '';
            this.currentScene = scene;
            this.currentScene.onLoad()
        }
        else {
            this.currentScene = scene;
            this.currentScene.onLoad()
        }
    }
    addHighScore(){
        if (!localStorage.getItem('highScores')) {
            
            localStorage.setItem('highScores', '[]');
        }
        let HighScoresList = JSON.parse(localStorage.getItem('highScores')) || [];
        HighScoresList.push(this.score.toFixed(0));
        HighScoresList.sort((a, b) => b - a);
        HighScoresList = HighScoresList.slice(0,5);
        localStorage.setItem('highScores', JSON.stringify(HighScoresList));
    }
    getControls() {
        const storedControls = JSON.parse(localStorage.getItem('controls'));
        if (storedControls) {
            this.controls = storedControls;
        }
    }


}
