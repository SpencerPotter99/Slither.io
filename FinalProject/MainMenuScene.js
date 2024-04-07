class MainMenuScene extends Scene {
    constructor(gameCanvas, gameState) {
        super(gameCanvas, gameState); // Call the constructor of the parent class
        
        // Set properties specific to the main menu scene
        this.name = "Main Menu";
        this.drawnBefore = false; // Flag to track whether the scene has been drawn before
    }

    // Override the draw method to customize the drawing for the main menu
    draw() {
        // Check if the scene has been drawn before
        if (!this.drawnBefore) {
            // Create and append div element for buttons
            const gameSpaceDiv = document.getElementById('gameSpace');
            gameSpaceDiv.innerHTML = ''; // Clear previous content
            const div = document.createElement('div');
            div.style.backgroundColor = "black";
            div.style.position = "absolute";
            div.style.top = "0";
            div.style.left = "0";
            div.style.width = "100%"; // Fill entire width of the page
            div.style.height = "100%"; // Fill entire height of the page
            div.style.display = "flex";
            div.style.alignItems = "center";
            div.style.justifyContent = "center";
            gameSpaceDiv.appendChild(div);
    
            const buttonContainer = document.createElement('div');
            buttonContainer.style.backgroundColor = "black";
            buttonContainer.style.padding = "20px";
            buttonContainer.style.borderRadius = "10px";
            buttonContainer.style.display = "flex";
            buttonContainer.style.flexDirection = "column";
            div.appendChild(buttonContainer);
    
            // Create and append View High Scores button
            const playButton = document.createElement('button');
            playButton.textContent = "Play";
            playButton.style.width = "200px"; // Adjusted width
            playButton.style.fontSize = "1.5em"; // Enlarged font size
            
            playButton.addEventListener('click', () => {
                this.gameState.changeScene(new levelOneScene(this.gameCanvas, this.gameState))
            });
            buttonContainer.appendChild(playButton);
            

            const controlsButton = document.createElement('button');
            controlsButton.textContent = "Change controls";
            controlsButton.style.width = "200px"; // Adjusted width
            controlsButton.style.fontSize = "1.5em"; // Enlarged font size
            
            controlsButton.addEventListener('click', () => {
                // Handle Play button click event
                this.gameState.changeScene(new ChangeControlsScene(this.gameCanvas, this.gameState))
            });
            buttonContainer.appendChild(controlsButton);

            const creditsButton = document.createElement('button');
            creditsButton.textContent = "Credits";
            creditsButton.style.width = "200px"; // Adjusted width
            creditsButton.style.marginBottom = "20px";
            creditsButton.style.fontSize = "1.5em"; // Enlarged font size
            
            creditsButton.addEventListener('click', () => {
                // Handle Play button click event
                this.gameState.changeScene(new CreditsScene(this.gameCanvas, this.gameState))
            });
            buttonContainer.appendChild(creditsButton);

            const viewHighScoresButton = document.createElement('button');
            viewHighScoresButton.textContent = "View High Scores";
            viewHighScoresButton.style.marginBottom = "20px"; // Increased margin
            viewHighScoresButton.style.width = "200px"; // Adjusted width
            viewHighScoresButton.style.fontSize = "1.5em"; // Enlarged font size
    
            viewHighScoresButton.addEventListener('click', () => {
                // Handle View High Scores button click event
                this.gameState.changeScene(new HighScoreScene(this.gameCanvas, this.gameState))
            });
            buttonContainer.appendChild(viewHighScoresButton);
    
            // Create and append Play button

    
            // Update the flag to indicate that the scene has been drawn
            this.drawnBefore = true;
        }
    }
    

    // Override the onKeyPress method if you need to handle key press events differently
    onKeyPress(event) {
        // Handle key press events specific to the main menu scene
    }

    // Override the update method if you need to update the scene differently
    update() {
        // Update main menu scene elements, such as animations, etc.
    }

    onLoad(){
        
    }
}
 