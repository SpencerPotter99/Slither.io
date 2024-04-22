// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('canvas-main');
    let context = canvas.getContext('2d')
    let playerX = 0
    let playerY = 0

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

    function updatePlayer(player){
        playerX = player.position.x
        playerY = player.position.y
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

    function drawText(text, positionX, positionY, font, color) {
        let localCenter = {
            x: positionX * canvas.width,
            y: positionY * canvas.width
        };

        context.font = font; // Set the font style and size
        context.fillStyle = color;
        context.fillText(text, localCenter.x- 40, localCenter.y - 40); // Draw the text at the specified position
    };
     // --------------------------------------------------------------
    //
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    size: { width: , height: }
    //
    // --------------------------------------------------------------
    function drawTexture(image, center, rotation, size) {
        let localCenter = {
            x: center.x * canvas.width,
            y: center.y * canvas.width
        };
        let localSize = {
            width: size.x * canvas.width,
            height: size.y * canvas.height
        };
        context.save();

        context.translate(localCenter.x, localCenter.y);
        context.rotate(rotation);
        context.translate(-localCenter.x, -localCenter.y);

        context.drawImage(
            image,
            localCenter.x - localSize.width / 2,
            localCenter.y - localSize.height / 2,
            localSize.width, localSize.height);

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
        canvas: canvas,
        updatePlayer, updatePlayer,
        clear: clear,
        drawText: drawText,
        saveContext: saveContext,
        restoreContext: restoreContext,
        rotateCanvas: rotateCanvas,
        drawImage: drawImage,
        drawTexture: drawTexture,
        drawImageSpriteSheet: drawImageSpriteSheet,
        drawCircle: drawCircle
    };
}());