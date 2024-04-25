// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('canvas-main');
    let context = canvas.getContext('2d')

    //------------------------------------------------------------------
    //
    // Place a 'clear' function on the Canvas prototype, this makes it a part
    // of the canvas, rather than making a function that calls and does it.
    //
    //------------------------------------------------------------------
    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    function drawText(text, positionX, positionY, font, color) {
        let localCenter = {
            x: positionX * canvas.width,
            y: positionY * canvas.width
        };

        context.font = font; // Set the font style and size
        context.fillStyle = color;
        context.fillText(text, localCenter.x- 40, localCenter.y - 40); // Draw the text at the specified position
    };

    //------------------------------------------------------------------
    //
    // Public function that allows the client code to clear the canvas.
    //
    //------------------------------------------------------------------
    function clear() {
        context.clear();
    }

    //------------------------------------------------------------------
    //
    // Simple pass-through to save the canvas context.
    //
    //------------------------------------------------------------------
    function saveContext() {
        context.save();
    }

    //------------------------------------------------------------------
    //
    // Simple pass-through the restore the canvas context.
    //
    //------------------------------------------------------------------
    function restoreContext() {
        context.restore();
    }

    //------------------------------------------------------------------
    //
    // Rotate the canvas to prepare it for rendering of a rotated object.
    //
    //------------------------------------------------------------------
    function rotateCanvas(center, rotation) {
        context.translate(center.x * canvas.width, center.y * canvas.width);
        context.rotate(rotation);
        context.translate(-center.x * canvas.width, -center.y * canvas.width);
    }

    //------------------------------------------------------------------
    //
    // Draw an image into the local canvas coordinate system.
    //
    //------------------------------------------------------------------
    function drawImage(texture, center, size) {
        let localCenter = {
            x: center.x * canvas.width,
            y: center.y * canvas.width
        };
        let localSize = {
            width: size.width * canvas.width,
            height: size.height * canvas.height
        };

        context.drawImage(texture,
            localCenter.x - localSize.width / 2,
            localCenter.y - localSize.height / 2,
            localSize.width,
            localSize.height);
    }

    function updatePlayer(player) {
        let playerX = player.position.x;
        let playerY = player.position.y;
    
        // Calculate the new viewport dimensions
        let viewportWidth = canvas.width / 3;
        let viewportHeight = canvas.height / 3;
    
        // Calculate the new viewport center based on player position
        let viewportCenterX = playerX * canvas.width - viewportWidth / 3;
        let viewportCenterY = playerY * canvas.height - viewportHeight / 3;
    
        // Adjust the transformation to center the viewport on the player and zoom in
        context.setTransform(1, 0, 0, 1, -viewportCenterX + canvas.width / 3, -viewportCenterY + canvas.height / 3);
    
        // Clear the canvas
        clear();
    }

    function drawBackground(tileImage) {
        // Calculate the number of tiles needed to fill the canvas
        let numTilesX = Math.ceil(canvas.width / tileImage.width);
        let numTilesY = Math.ceil(canvas.height / tileImage.height);
    
        // Loop through each row and column to draw the tiles
        for (let row = 0; row < numTilesY; row++) {
            for (let col = 0; col < numTilesX; col++) {
                // Calculate the position of the current tile
                let tileX = col * tileImage.width;
                let tileY = row * tileImage.height;
    
                // Draw the tile at the calculated position
                context.drawImage(tileImage, tileX, tileY);
            }
        }
    }

    //------------------------------------------------------------------
    //
    // Draw an image out of a spritesheet into the local canvas coordinate system.
    //
    //------------------------------------------------------------------
    function drawImageSpriteSheet(spriteSheet, spriteSize, sprite, center, size) {
        let localCenter = {
            x: center.x * canvas.width,
            y: center.y * canvas.width
        };
        let localSize = {
            width: size.width * canvas.width,
            height: size.height * canvas.height
        };

        context.drawImage(spriteSheet,
            sprite * spriteSize.width, 0,                 // which sprite to render
            spriteSize.width, spriteSize.height,    // size in the spritesheet
            localCenter.x - localSize.width / 2,
            localCenter.y - localSize.height / 2,
            localSize.width, localSize.height);
    }
     // --------------------------------------------------------------
    //
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    size: { width: , height: }
    //
    // --------------------------------------------------------------
    function drawTexture(image, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.x / 2,
            center.y - size.y / 2,
            size.x, size.y);

        context.restore();
    }

    //------------------------------------------------------------------
    //
    // Draw a circle into the local canvas coordinate system.
    //
    //------------------------------------------------------------------
    function drawCircle(center, radius, color) {
        context.beginPath();
        context.arc(center.x * canvas.width, center.y * canvas.width, 2 * radius * canvas.width, 2 * Math.PI, false);
        context.closePath();
        context.fillStyle = color;
        context.fill();
    }

    return {
        updatePlayer: updatePlayer,
        clear: clear,
        drawText, drawText,
        saveContext: saveContext,
        restoreContext: restoreContext,
        rotateCanvas: rotateCanvas,
        drawImage: drawImage,
        drawTexture: drawTexture,
        drawImageSpriteSheet: drawImageSpriteSheet,
        drawCircle: drawCircle,
        drawBackground: drawBackground
    };
}());
