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
        graphics.restoreContext();
        let segments = model.segments
        for (let i = 0; i < segments?.length; i++) {
            graphics.saveContext();
            graphics.rotateCanvas(segments[i].position, segments[i].direction);
            graphics.drawImage(segmentTexure, segments[i].position, segments[i].size)
            graphics.restoreContext();
        }
        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics));
