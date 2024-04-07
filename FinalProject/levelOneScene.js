class levelOneScene extends Scene {
    constructor(gameCanvas, gameState) {
        super(gameCanvas, gameState);
    }

    draw() {
           
            this.context.drawImage(this.gameState.backgroundImage, 0, 0, this.gameCanvas.width , this.gameCanvas.height );
            //Draw everything using that classes .draw method. Ie a player.draw or terrain.draw or particlemanager.draw should be done here, 
            //and in the order we want these things to appear in layers
        
        
            
    }

    onKeyPress(event) {
        
    }

    update() {
       
   
    }

    onLoad(){
        const gameSpace = document.getElementById("gameSpace");
        this.gameCanvas = document.createElement("canvas");
        this.gameCanvas.id = "gameCanvas";
        this.gameCanvas.width = window.innerWidth;
        this.gameCanvas.height = window.innerHeight;
        this.context = this.gameCanvas.getContext('2d');
        gameSpace.appendChild(this.gameCanvas);
        //Load player objects, connect to servers, Make a particle managers class here

    }
    
   
}
