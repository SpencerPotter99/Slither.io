class CreditsScene extends Scene {
    constructor(gameCanvas, gameState) {
        super(gameCanvas, gameState);
        this.creditText = "Everything : Caleb Leavitt"; // Dummy credit text
    }

    draw() {
        super.draw();
        this.context.fillStyle = 'black'; // Set background color to black
        this.context.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height); // Fill canvas with black color
        this.context.fillStyle = 'white';
        this.context.font = '20px Arial';

        // Calculate center position for the credit text
        let creditTextWidth = this.context.measureText(this.creditText).width;
        let creditTextX = (this.gameCanvas.width - creditTextWidth) / 2;
        this.context.fillText(this.creditText, creditTextX, 30); // Draw credit text
    }

    onKeyPress(event) {
        super.onKeyPress(event);
        if (event === this.gameState.controls.back) {
            this.gameState.changeScene(new MainMenuScene(this.gameCanvas, this.gameState));
        }
    }

    onLoad() {
        super.onLoad();
        // Set up canvas and context
        const gameSpace = document.getElementById("gameSpace");
        this.gameCanvas = document.createElement("canvas");
        this.gameCanvas.id = "gameCanvas";
        this.gameCanvas.width = window.innerWidth;
        this.gameCanvas.height = window.innerHeight;
        this.context = this.gameCanvas.getContext('2d');
        gameSpace.appendChild(this.gameCanvas);
    }
}
