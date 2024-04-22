MyGame.renderer.ParticleSystem = function(graphics) {
    'use strict';
    let that = {}

    

    //------------------------------------------------------------------
    //
    // Render all particles
    //
    //------------------------------------------------------------------
    that.render = function(components, graphics, imageSrc) {
        Object.getOwnPropertyNames(components.particles).forEach( function(value) {
            let particle = components.particles[value];

            graphics.drawTexture(imageSrc, particle.center, particle.rotation, particle.size);
        });
    }

    return that
}(MyGame.graphics);