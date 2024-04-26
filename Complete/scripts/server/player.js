// ------------------------------------------------------------------
//
// Nodejs module that represents the model for a player.
//
// ------------------------------------------------------------------
'use strict';

let random = require('./random');

//------------------------------------------------------------------
//
// Public function used to initially create a newly connected player
// at some random location.
//
//------------------------------------------------------------------
function createPlayer(name) {
    let that = {};

    let position = {
        x: random.nextDouble() ,
        y: random.nextDouble() 
    };

    if (position.x < 0.5) {
    position.x = 0.5;
} else if (position.x > 2.5) {
    position.x = 2.5;
}

// Adjusting y value
if (position.y < 0.5) {
    position.y = 0.5;
} else if (position.y > 2.5) {
    position.y = 2.5;
}

    let size = {
        width: 0.15,
        height: 0.15,
        radius: 0.075
    };
    let direction = 0; // Angle in radians
    let rotateRate = Math.PI / 1000; // radians per millisecond
    let speed = 0.0002; // unit distance per millisecond
    let segments = []; // Array to store snake segments
    let reportUpdate = false; // Indicates if this model was updated during the last update
    let targetLocations = []
    let dead = false
    let playerName = name
    let invincibility = 100


    

    Object.defineProperty(that, 'direction', {
        get: () => direction
    });

    Object.defineProperty(that, 'position', {
        get: () => position
    });

    Object.defineProperty(that, 'playerName', {
        get: () => playerName
    });

    Object.defineProperty(that, 'size', {
        get: () => size
    });

    Object.defineProperty(that, 'speed', {
        get: () => speed
    })

    Object.defineProperty(that, 'rotateRate', {
        get: () => rotateRate
    });

    Object.defineProperty(that, 'segments', {
        get: () => segments
    });

    Object.defineProperty(that, 'invincibility', {
        get: () => invincibility
    });

    Object.defineProperty(that, 'reportUpdate', {
        get: () => reportUpdate,
        set: value => reportUpdate = value
    });

    Object.defineProperty(that, 'radius', {
        get: () => size.radius
    });


    Object.defineProperty(that, 'dead', {
        get: () => dead,
        set: value => {dead = value}
    });

    //------------------------------------------------------------------
    //
    // Moves the player forward based on how long it has been since the
    // last move took place.
    //
    //------------------------------------------------------------------
    that.positionCheck = function()
    {
        if((position.x > 3) || (position.x < 0)){
            dead = true
        }
        if((position.y > 3) || (position.y < 0)){
            dead = true
        }

    };




    that.move = function(elapsedTime) {
        reportUpdate = true;
        let vectorX = Math.cos(direction);
        let vectorY = Math.sin(direction);
    
        position.x += (vectorX * elapsedTime * speed);
        position.y += (vectorY * elapsedTime * speed);
        this.positionCheck();
    
        // Update target locations for segments
        targetLocations.unshift({ x: position.x, y: position.y });
    
        // Update snake segments' positions
        for (let i = 0; i < segments.length; i++) {
            let segment = segments[i];
            if (targetLocations.length > i + 1) {
                let target = targetLocations[i + 1];
                // Calculate direction for the segment
                let deltaX = target.x - segment.position.x;
                let deltaY = target.y - segment.position.y;
                let segmentDirection = Math.atan2(deltaY, deltaX);
                segment.addTarget({ x: target.x, y: target.y, direction: segmentDirection });
            }
        }
    
        // Update snake segments' positions
        for (let i = 0; i < segments.length; i++) {
            let segment = segments[i];
            if (i === 0) {
                segment.move(elapsedTime);
            } else {
                segment.move(elapsedTime, segments[i - 1]);
            }
        }
    };

    //------------------------------------------------------------------
    //
    // Rotates the player right based on how long it has been since the
    // last rotate took place.
    //
    //------------------------------------------------------------------
    that.rotateRight = function(elapsedTime) {
        reportUpdate = true;
        direction = 0;
    };

    that.snakeHit = function(elapsedTime){
        reportUpdate = true;
        dead = true
    }

    that.rotateUp = function(elapsedTime) {
        reportUpdate = true;
        direction = 4.71239
    };
    that.rotateSouthEast = function(elapsedTime) {
        reportUpdate = true;
        direction = 0.785398
    };

    that.updatePlayerName = function(name) {
        reportUpdate = true;
        playerName = name
    };

    //------------------------------------------------------------------
    //
    // Rotates the player left based on how long it has been since the
    // last rotate took place.
    //
    //------------------------------------------------------------------
    that.rotateLeft = function(elapsedTime) {
        reportUpdate = true;
        direction = 3.14159;
    };
    that.rotateDown = function(elapsedTime) {
        reportUpdate = true;
        
        direction =1.5708
    };

    //------------------------------------------------------------------
    //
    // Function used to update the player during the game loop.
    //
    //------------------------------------------------------------------
    that.update = function(when) {
        if(invincibility>0){
            invincibility--
        }
        if(direction>6.283 || direction < -6.283){
            direction = 0
        }
        // Update snake segments
        for (let i = 0; i < segments.length; i++) {
            let segment = segments[i];
            segment.update(when);
        }
    };

    //------------------------------------------------------------------
    //
    // Function to add a new segment to the snake.
    //
    //------------------------------------------------------------------
    that.addSegment = function() {
        reportUpdate = true;
        let newSegment;
        if (segments.length === 0) {
            newSegment = createSegment(position, direction);
        } else {
            // Get target locations from the last segment
            let lastSegment = segments[segments.length - 1];
            let lastSegmentTargets = lastSegment.getTargetLocations();
    
            // Pass target locations to the new segment
            newSegment = createSegment(lastSegment.position, direction, lastSegmentTargets);
        }
    
        segments.push(newSegment);
    };

    //------------------------------------------------------------------
    //
    // Function to retrieve all segments of the snake.
    //
    //------------------------------------------------------------------
    that.getSegments = function() {
        return segments;
    };

    return that;
    
}

//------------------------------------------------------------------
//
// Function to create a new segment of the snake.
//
//------------------------------------------------------------------
function createSegment(position, direction, targetLocations) {
    let segment = {};

    let oppositeDirection = direction + Math.PI;

    // Adjust the position based on the opposite direction
    segment.position = {
        x: position.x - 0.15 * Math.cos(direction),
        y: position.y - 0.15 * Math.sin(direction)
    }; 
    

    segment.direction = direction; // Direction of the segment
    segment.size = {
        width: 0.15,
        height: 0.15,
        radius: 0.075
    };
    segment.speed = 0.0002; // Speed of the segment
    segment.targetsQueue = targetLocations || [];
    segment.targetsQueue.unshift({ x: position.x, y: position.y, direction: direction })

    //------------------------------------------------------------------
    //
    // Moves the segment based on the given vector and elapsed time.
    //
    //------------------------------------------------------------------
    segment.move = function(elapsedTime, previousSeg) {
        if (segment.targetsQueue.length > 0) {
            let target = segment.targetsQueue[0];
            let deltaX = target.x - segment.position.x;
            let deltaY = target.y - segment.position.y;
            let distanceToTarget = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            let vectorX = deltaX / distanceToTarget;
            let vectorY = deltaY / distanceToTarget;
    
            segment.position.x += (vectorX * elapsedTime * segment.speed);
            segment.position.y += (vectorY * elapsedTime * segment.speed);
    
            // Update the segment's direction to point towards the next target
            segment.direction = Math.atan2(deltaY, deltaX);
    
            // Check if the segment has reached the target
            if (distanceToTarget < 0.1) {
                // Remove the reached target from the queue
                segment.targetsQueue.shift();
            }
        }
    };

    //------------------------------------------------------------------
    //
    // Function used to update the segment during the game loop.
    //
    //------------------------------------------------------------------
    segment.update = function(when) {
        // Update segment's behavior if needed
    };

    segment.getTargetLocations = function() {
        let targetLocations = [];
        for (let target of segment.targetsQueue) {
            targetLocations.push({ x: target.x, y: target.y });
        }
        return targetLocations;
    };

    segment.addTarget = function(newTarget) {
        segment.targetsQueue.push(newTarget);
    };


    return segment;
}

module.exports.create = () => createPlayer();
