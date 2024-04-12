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
    that.render = function(model, texture, segmentTexure) {
        graphics.saveContext();
        graphics.rotateCanvas(model.state.position, model.state.direction);
        graphics.drawImage(texture, model.state.position, model.size);
        graphics.restoreContext();
        let segments = model.state.segments
        for (let i = 0; i < segments?.length; i++) {
            graphics.rotateCanvas(segments[i].position, segments[i].direction);
            graphics.drawImage(segmentTexure, segments[i].position, segments[i].size)
            graphics.restoreContext();
        }
        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics));
