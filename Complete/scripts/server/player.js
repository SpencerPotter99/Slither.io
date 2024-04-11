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
let headPath = {};
function createPlayer() {
    let that = {};

    let position = {
        x: random.nextDouble(),
        y: random.nextDouble()
    };

    let size = {
        width: 0.10,
        height: 0.10,
        radius: 0.05
    };
    let direction = random.nextDouble() * 2 * Math.PI; // Angle in radians
    let rotateRate = Math.PI / 1000; // radians per millisecond
    let speed = 0.0002; // unit distance per millisecond
    let segments = []; // Array to store snake segments
    let reportUpdate = false; // Indicates if this model was updated during the last update
    

    Object.defineProperty(that, 'direction', {
        get: () => direction
    });

    Object.defineProperty(that, 'position', {
        get: () => position
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

    Object.defineProperty(that, 'reportUpdate', {
        get: () => reportUpdate,
        set: value => reportUpdate = value
    });

    Object.defineProperty(that, 'radius', {
        get: () => size.radius
    });

    //------------------------------------------------------------------
    //
    // Moves the player forward based on how long it has been since the
    // last move took place.
    //
    //------------------------------------------------------------------
    that.move = function(elapsedTime) {
        reportUpdate = true;
        let vectorX = Math.cos(direction);
        let vectorY = Math.sin(direction);

        position.x += (vectorX * elapsedTime * speed);
        position.y += (vectorY * elapsedTime * speed);
        headPath = {x: position.x, y: position.y, direction: direction}
        // Update snake segments' positions
        for (let i = 0; i < segments.length; i++) {
            let segment = segments[i];
            segment.move( elapsedTime);

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
        direction += (rotateRate * elapsedTime);
    };

    //------------------------------------------------------------------
    //
    // Rotates the player left based on how long it has been since the
    // last rotate took place.
    //
    //------------------------------------------------------------------
    that.rotateLeft = function(elapsedTime) {
        reportUpdate = true;
        direction -= (rotateRate * elapsedTime);
    };

    //------------------------------------------------------------------
    //
    // Function used to update the player during the game loop.
    //
    //------------------------------------------------------------------
    that.update = function(when) {
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
        let newSegment
        if(segments.length===0){
            newSegment = createSegment(position);
        }
        else{
            newSegment = createSegment(segments[segments.length - 1].position);
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
function createSegment(playerPosition) {
    let segment = {};

    // Initialize the segment with the player's position
    segment.position = {
        x: playerPosition.x-.1,
        y: playerPosition.y
    };
    segment.direction = 0; // Direction of the segment
    segment.size = {
        width: 0.10,
        height: 0.10,
        radius: 0.05
    };
    segment.speed = 0.0002; // Speed of the segment

    //------------------------------------------------------------------
    //
    // Moves the segment based on the given vector and elapsed time.
    //
    //------------------------------------------------------------------
    segment.move = function(elapsedTime) {
        console.log(headPath)
        console.log("break")
        let nextPos = headPath
        headPath = {x: segment.position.x, y: segment.position.y, direction: segment.direction}
        console.log(headPath)
        segment.position.x = (nextPos.x);
        segment.position.y = (nextPos.y);
      segment.direction= nextPos.direction
    };

    //------------------------------------------------------------------
    //
    // Function used to update the segment during the game loop.
    //
    //------------------------------------------------------------------
    segment.update = function(when) {
        // Update segment's behavior if needed
    };

    return segment;
}

module.exports.create = () => createPlayer();
