//------------------------------------------------------------------
//
// Model for each player in the game.
//
//------------------------------------------------------------------
let headPath = {}
MyGame.components.Player = function() {
    'use strict';
    let that = {};
    let position = {
        x: 0,
        y: 0
    };
    let size = {
        width: 0.10,
        height: 0.10
    };
    let direction = 0;
    let rotateRate = 0;
    let speed = 0;
    let segments = []; // Array to store segments

    Object.defineProperty(that, 'direction', {
        get: () => direction,
        set: (value) => { direction = value }
    });

    Object.defineProperty(that, 'speed', {
        get: () => speed,
        set: value => { speed = value; }
    });

    Object.defineProperty(that, 'rotateRate', {
        get: () => rotateRate,
        set: value => { rotateRate = value; }
    });

    Object.defineProperty(that, 'position', {
        get: () => position
    });

    Object.defineProperty(that, 'size', {
        get: () => size
    });

    //------------------------------------------------------------------
    //
    // Public function to add a new segment to the player.
    //
    //------------------------------------------------------------------
    that.addSegment = function() {
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
    // Public function to retrieve all segments of the player.
    //
    //------------------------------------------------------------------
    that.getSegments = function() {
        return segments;
    };

    //------------------------------------------------------------------
    //
    // Public function that moves the player in the current direction.
    //
    //------------------------------------------------------------------
    that.move = function(elapsedTime) {
        let vectorX = Math.cos(direction);
        let vectorY = Math.sin(direction);

        position.x += (vectorX * elapsedTime * speed);
        position.y += (vectorY * elapsedTime * speed);
        headPath = {x: position.x-.1, y: position.y, direction: direction}

        // Update snake segments' positions
        for (let i = 0; i < segments.length; i++) {
            let segment = segments[i];
            segment.move(elapsedTime);
        }

    };

    //------------------------------------------------------------------
    //
    // Public function that rotates the player right.
    //
    //------------------------------------------------------------------
    that.rotateRight = function(elapsedTime) {
        direction += (rotateRate * elapsedTime);
    };

    //------------------------------------------------------------------
    //
    // Public function that rotates the player left.
    //
    //------------------------------------------------------------------
    that.rotateLeft = function(elapsedTime) {
        direction -= (rotateRate * elapsedTime);
    };

    //------------------------------------------------------------------
    //
    // Public function that updates the player.
    //
    //------------------------------------------------------------------
    that.update = function(elapsedTime) {
        // Update segment behaviors if needed
        for (let i = 0; i < segments.length; i++) {
            let segment = segments[i];
            segment.update(elapsedTime);
        }
    };

    //------------------------------------------------------------------
    //
    // Function to create a new segment of the player.
    //
    //------------------------------------------------------------------
    function createSegment(playerPosition) {
        let segment = {};

        segment.position = {x: playerPosition.x-.1,
            y: playerPosition.y}; // Position of the segment
        segment.direction = 0; // Direction of the segment
        segment.speed = 0.0002; // Speed of the segment
        segment.size = {
            width: 0.10,
            height: 0.10,
            radius: 0.05
        };

        //------------------------------------------------------------------
        //
        // Moves the segment based on the given vector and elapsed time.
        //
        //---------------------a---------------------------------------------
        segment.move = function(headPath, elapsedTime) {
            let nextPos = headPath
            headPath = {x: segment.position.x, y: segment.position.y, direction: segment.direction}
            console.log(segment)
            segment.position.x = (nextPos.x);
            segment.position.y = (nextPos.y);
          segment.direction= nextPos.direction
        };

        //------------------------------------------------------------------
        //
        // Function used to update the segment during the game loop.
        //
        //------------------------------------------------------------------
        segment.update = function(elapsedTime) {
            // Update segment's behavior if needed
        };

        return segment;
    }

    return that;
};

