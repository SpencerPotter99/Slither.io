MyGame.renderer.ParticleSystem = function(components, graphics, imageSrc) {
    'use strict';

 

    //------------------------------------------------------------------
    //
    // Render all particles
    //
    //------------------------------------------------------------------
    function render() {
        console.log("TEST RENDER PARTICLES")
        console.log(graphics)
        console.log("TESTTTTTTT")
        Object.getOwnPropertyNames(components.particles).forEach( function(value) {
            let particle = components.particles[value];
            graphics.drawTexture(imageSrc, particle.center, particle.rotation, particle.size);
        });
    }

    let api = {
        render: render
    };

    return api;
};