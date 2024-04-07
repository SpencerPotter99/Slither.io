class ChangeControlsScene extends Scene {
    constructor(gameCanvas, gameState) {
        super(gameCanvas, gameState);
        this.name = "Change Controls";
        this.drawnBefore = false;
        this.div = document.createElement('div');
        this.gameSpaceDiv = null;
    }

    draw() {
        if (!this.drawnBefore) {

            //This draws buttons on screen
            this.buttons = [
                { label: "ButtonOne", control: JSON.parse(localStorage.getItem('controls')).buttonOne },
                { label: "ButtonTwo", control: JSON.parse(localStorage.getItem('controls')).buttonTwo},
                { label: "ButtonThree", control: JSON.parse(localStorage.getItem('controls')).buttonThree },
            ];
    
            this.div.style.backgroundColor = "black";
            this.div.style.position = "absolute";
            this.div.style.top = "0";
            this.div.style.left = "0";
            this.div.style.width = "100%";
            this.div.style.height = "100%";
            this.div.style.display = "flex";
            this.div.style.alignItems = "center";
            this.div.style.justifyContent = "center";
            this.gameSpaceDiv.appendChild(this.div);
    
            const buttonContainer = document.createElement('div');
            buttonContainer.style.backgroundColor = "black";
            buttonContainer.style.padding = "20px";
            buttonContainer.style.borderRadius = "10px";
            buttonContainer.style.display = "flex";
            buttonContainer.style.flexDirection = "column";
            buttonContainer.id = "buttonContainer";
            this.div.appendChild(buttonContainer);
    
            this.buttons.forEach(buttonInfo => {
                const button = document.createElement('button');
                button.textContent = `${buttonInfo.label}: ${(buttonInfo.control)}`;
                button.style.width = "200px";
                button.style.fontSize = "1.5em";
                button.addEventListener('click', () => {
                    button.style.background = "grey";
                    //Make sure to add button cases if we need to add more controls
                    const keypressHandler = function(event) {
                        let controls = JSON.parse(localStorage.getItem('controls')) || {};
                        if (buttonInfo.label == "ButtonOne") {
                            controls.buttonOne = event.code; // Update up control
                        } else if (buttonInfo.label == "ButtonTwo") {
                            controls.buttonTwo = event.code; // Update left control
                        } else if (buttonInfo.label == "ButtonThree") {
                            controls.buttonThree = event.code; // Update right control
                        }
                        localStorage.setItem('controls', JSON.stringify(controls)); // Store updated controls in local storage
                        button.textContent = `${buttonInfo.label}: ${(event.code)}`;
                        button.style.background = "white";
                        document.removeEventListener('keydown', keypressHandler);
                    };
                    document.addEventListener('keydown', keypressHandler);
                });
                buttonContainer.appendChild(button);
            });
    
        }
        this.drawnBefore = true;
    }
    
    
    
        
        //This listener checks for backspace and sets the controls and updates everything, sends us to main menu

    onKeyPress(event) {
        super.onKeyPress(event);
        if (event === this.gameState.controls.back) {
            this.gameState.getControls();
            this.gameState.changeScene(new MainMenuScene(this.gameCanvas, this.gameState));
        }
        
    }

    update() {
        // Update scene elements if needed
    }

    onLoad() {
            this.gameSpaceDiv = document.getElementById('gameSpace');
            this.gameSpaceDiv.innerHTML = '';
            
        // Perform actions when the scene is loaded
    }
}
