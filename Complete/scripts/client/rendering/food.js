// ------------------------------------------------------------------
//
// Rendering function for a Food object.
//
// ------------------------------------------------------------------
MyGame.renderer.Food = (function(graphics) {
    'use strict';
    let that = {};

    // ------------------------------------------------------------------
    //
    // Renders a Food model.
    //
    // ------------------------------------------------------------------
    that.render = function(model, texture) {
        graphics.drawCircle(model.position, model.radius, '#000000');
        console.log("rendering")
    };

    return that;

}(MyGame.graphics));
