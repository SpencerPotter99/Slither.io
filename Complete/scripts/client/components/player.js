//------------------------------------------------------------------
//
// Model for each player in the game.
//
//------------------------------------------------------------------
MyGame.components.Player = function() {
    'use strict';
    let that = {};
    let position = {
        x: 0,
        y: 0
    };
    let size = {
        width: 0.15,
        height: 0.15
    };
    let direction = 0;
    let rotateRate = 0;
    let speed = 0;
    let segments = []; // Array to store segments
    let targetLocations = []

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

        // Update target locations for segments
        targetLocations.unshift({ x: position.x, y: position.y });

        // Update snake segments' positions
        for (let i = 0; i < segments.length; i++) {
            let segment = segments[i];
            if (targetLocations.length > i + 1) {
                let target = targetLocations[i + 1];
                segment.addTarget(target);
            }
        }
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
        if(direction>6.283 || direction < -6.283){
            console.log("TEST")
            direction = 0
        }
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

        segment.position = {x: playerPosition.x-.15,
            y: playerPosition.y}; // Position of the segment
        segment.direction = 0; // Direction of the segment
        segment.speed = 0.0002; // Speed of the segment
        segment.size = {
            width: 0.15,
            height: 0.15,
            radius: 0.15
        };

        //------------------------------------------------------------------
        //
        // Moves the segment based on the given vector and elapsed time.
        //
        //------------------------------------------------------------------
        segment.move = function(vectorX, vectorY, elapsedTime) {
            if (targetsQueue.length > 0) {
                let target = targetsQueue[0];
                let deltaX = target.x - segment.position.x;
                let deltaY = target.y - segment.position.y;
                let distanceToTarget = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                let vectorX = deltaX / distanceToTarget;
                let vectorY = deltaY / distanceToTarget;
    
                segment.position.x += (vectorX * elapsedTime * segment.speed);
                segment.position.y += (vectorY * elapsedTime * segment.speed);
    
                // Check if the segment has reached the target
                if (distanceToTarget < 0.1) {
                    // Remove the reached target from the queue
                    targetsQueue.shift();
                }
            }
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

