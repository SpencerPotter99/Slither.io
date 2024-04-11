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
    that.render = function(model, texture, segmentTexure) {
        graphics.saveContext();
        graphics.rotateCanvas(model.position, model.direction);
        graphics.drawImage(texture, model.position, model.size);
        let segments = model.segments
        console.log(segments)
        for (let i = 0; i < segments?.length; i++) {
            graphics.drawImage(segmentTexure, segments[i].position, segments[i].size)
        }
        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics));
