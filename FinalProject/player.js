class Player {
    constructor(spriteSrc, initialX, initialY, context) {
        this.sprite = new Image();
        this.sprite.src = spriteSrc;
        
    }

    move() {


        
    }
    updateDir(movevector){
        

    }

    rotate(degrees) {

    }

    draw() {
        // Draw the player sprite on the canvas context
        this.context.save();
        
        var centerX = this.x;
        var centerY = this.y;
        
        this.context.translate(centerX, centerY);
        this.context.rotate((Math.PI / 180) * this.rotation);
        
        
        this.context.drawImage(this.sprite, -this.spriteWidth/2, -this.spriteHeight/2, this.spriteWidth, this.spriteHeight);
        this.context.translate(-centerX, -centerY);1
        this.context.restore();
    }
 
    
}
