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
        graphics.drawCircle(model.position, model.radius, '#FFFFFF');
    };

    return that;

}(MyGame.graphics));
