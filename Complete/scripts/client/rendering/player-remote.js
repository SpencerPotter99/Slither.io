// ------------------------------------------------------------------
//
// Rendering function for a PlayerRemote object.
//
// ------------------------------------------------------------------
MyGame.renderer.PlayerRemote = (function(graphics) {
    'use strict';
    let that = {};

    // ------------------------------------------------------------------
    //
    // Renders a PlayerRemote model.
    //
    // ------------------------------------------------------------------
    that.render = function(model, texture, segmentTexure, tailTexture) {
        graphics.saveContext();
        graphics.rotateCanvas(model.state.position, model.state.direction);
        graphics.drawImage(texture, model.state.position, model.size);
        graphics.restoreContext();
        let segments = model.state.segments
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
        graphics.rotateCanvas(model.state.position, model.state.direction);
        graphics.drawText(model.state.playerName, model.state.position.x, model.state.position.y, "25px Arial", "#750000")
        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics));
