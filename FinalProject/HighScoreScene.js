class HighScoreScene extends Scene {
    constructor(gameCanvas, gameState) {
        super(gameCanvas, gameState);
        this.highScores = [];
    }

    draw() {
        super.draw();
        this.context.fillStyle = 'black'; // Set background color to black
        this.context.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height); // Fill canvas with black color
        this.context.fillStyle = 'white';
        this.context.font = '20px Arial';
        
        // Calculate center position for the title text
        let titleText = 'High Scores:';
        let titleTextWidth = this.context.measureText(titleText).width;
        let titleTextX = (this.gameCanvas.width - titleTextWidth) / 2;
        this.context.fillText(titleText, titleTextX, 30); // Draw title text
        
        this.context.font = '16px Arial';
        for (let i = 0; i < this.highScores.length; i++) {
            let scoreText = `${i + 1}. ${this.highScores[i]}`;
            let scoreTextWidth = this.context.measureText(scoreText).width;
            let scoreTextX = (this.gameCanvas.width - scoreTextWidth) / 2;
            this.context.fillText(scoreText, scoreTextX, 60 + i * 20); // Draw score text
        }
    }

    onKeyPress(event) {
        super.onKeyPress(event);
        if (event === this.gameState.controls.back) {
            this.gameState.changeScene(new MainMenuScene(this.gameCanvas, this.gameState));
        }
    }

    update() {
        super.update();
        // You may add update logic here if needed
    }

    onLoad() {
        super.onLoad();
        // Load high scores from browser memory
        const gameSpace = document.getElementById("gameSpace");
        this.gameCanvas = document.createElement("canvas");
        this.gameCanvas.id = "gameCanvas";
        this.gameCanvas.width = window.innerWidth;
        this.gameCanvas.height = window.innerHeight;
        this.context = this.gameCanvas.getContext('2d');
        gameSpace.appendChild(this.gameCanvas);
        this.highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    }
}
