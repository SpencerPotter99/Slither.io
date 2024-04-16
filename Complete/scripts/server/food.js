// ------------------------------------------------------------------
//
// Nodejs module that represents the model for a missile.
//
// ------------------------------------------------------------------
'use strict';

//------------------------------------------------------------------
//
// Public function used to initially create a newly fired missile.
//
//------------------------------------------------------------------
function create(spec) {
    let that = {};

    let radius = 0.0025;   
    let timeRemaining = 1500;   // milliseconds

    Object.defineProperty(that, 'id', {
        get: () => spec.id
    });

    Object.defineProperty(that, 'position', {
        get: () => spec.position
    });

    Object.defineProperty(that, 'radius', {
        get: () => radius
    });

    Object.defineProperty(that, 'timeRemaining', {
        get: () => timeRemaining
    });

    //------------------------------------------------------------------
    //
    // Function used to update the missile during the game loop.
    //
    //------------------------------------------------------------------
    that.update = function(elapsedTime) {
        timeRemaining -= elapsedTime;
        if (timeRemaining <= 0) {
            return false;
        } else {
            return true;
        }
    };

    return that;
}

module.exports.create = (spec) => create(spec);
