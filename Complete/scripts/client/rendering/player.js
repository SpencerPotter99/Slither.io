// ------------------------------------------------------------------
//
// Rendering function for a Player object.
//
// ------------------------------------------------------------------
MyGame.renderer.Player = (function(graphics) {
    'use strict';
    let that = {};

    // ------------------------------------------------------------------
    //
    // Renders a Player model.
    //
    // ------------------------------------------------------------------
    that.render = function(model, texture, segmentTexure, tailTexture) {
        graphics.saveContext();
        let segments = model.segments
        for (let i = 0; i < segments?.length; i++) {
            graphics.saveContext();
            graphics.rotateCanvas(segments[i].position, segments[i].direction);
            
            if (i === segments.length - 1) {
                // Draw using tailTexture for the last segment
                graphics.drawImage(tailTexture, segments[i].position, segments[i].size);
            } else {
                // Draw using segmentTexture for other segments
                graphics.drawImage(segmentTexure, segments[i].position, segments[i].size);
            }
            
            graphics.restoreContext();
        }
        graphics.restoreContext();
        graphics.saveContext();
        graphics.rotateCanvas(model.position, model.direction);
        graphics.drawImage(texture, model.position, model.size)
        graphics.restoreContext();
        graphics.saveContext();
        graphics.rotateCanvas(model.position, model.direction);
        graphics.drawText(model.playerName, model.position.x, model.position.y, "25px Arial", "#0000ff")
        graphics.restoreContext();
    };
    

    return that;

}(MyGame.graphics));
