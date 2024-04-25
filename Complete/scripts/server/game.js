// ------------------------------------------------------------------
//
// Nodejs module that provides the server-side game model.
//
// ------------------------------------------------------------------
'use strict';

let present = require('present');
let Player = require('./player');
let Food = require('./food');
let NetworkIds = require('../shared/network-ids');
let Queue = require('../shared/queue.js');
let FoodAMT = 20;
const SIMULATION_UPDATE_RATE_MS = 50;
const STATE_UPDATE_RATE_MS = 100;
let lastUpdate = 0;
let quit = false;
let activeClients = {};
let newFoods = [];
let activeFood = [];
let hits = [];
let segmentHits = []
let inputQueue = Queue.create();
let nextFoodId = 1;

//------------------------------------------------------------------
//
// Used to create a food in response to user input.
//
//------------------------------------------------------------------
function createFood(position) {
    let food = Food.create({
        id: nextFoodId++,
        position: {
            x: position.x,
            y: position.y
        }
    });
    newFoods.push(food);
    
    
}  

//------------------------------------------------------------------
//
// Process the network inputs we have received since the last time
// the game loop was processed.
//
//------------------------------------------------------------------
function processInput(elapsedTime) {
    //
    // Double buffering on the queue so we don't asynchronously receive inputs
    // while processing.
    let processMe = inputQueue;
    inputQueue = Queue.create();

    while (!processMe.empty) {
        let input = processMe.dequeue();
        let client = activeClients[input.clientId];
        client.lastMessageId = input.message.id;
        switch (input.message.type) {
            case NetworkIds.INPUT_MOVE:
                client.player.move(input.message.elapsedTime);
                break;
            case NetworkIds.INPUT_ROTATE_LEFT:
                client.player.rotateLeft(input.message.elapsedTime);
                break;
            case NetworkIds.INPUT_ROTATE_RIGHT:
                client.player.rotateRight(input.message.elapsedTime);
                break;
            case NetworkIds.INPUT_ROTATE_SOUTH_EAST:
                client.player.rotateSouthEast(input.message.elapsedTime);
                break;
            case NetworkIds.INPUT_ROTATE_UP:
                client.player.rotateUp(input.message.elapsedTime);
                break;
            case NetworkIds.INPUT_ROTATE_DOWN:
                client.player.rotateDown(input.message.elapsedTime);
                break;
            case NetworkIds.INPUT_FIRE:
                createMissile(input.clientId, client.player);
                break;
            case NetworkIds.INPUT_ADD_SEGMENT:
                client.player.addSegment();
                break;
            case NetworkIds.CONNECT_SNAKE:
                client.player.updatePlayerName(input.message.playerName);
                break;
        }
    }
}

//------------------------------------------------------------------
//
// Utility function to perform a hit test between two objects.  The
// objects must have a position: { x: , y: } property and radius property.
//
//------------------------------------------------------------------
function collided(obj1, obj2) {
    let distance = Math.sqrt(Math.pow(obj1.position.x - obj2.position.x, 2) + Math.pow(obj1.position.y - obj2.position.y, 2));
    let radii = obj1.radius + obj2.radius;

    return distance <= radii;
}

//------------------------------------------------------------------
//
// Update the simulation of the game.
//
//------------------------------------------------------------------
function update(elapsedTime, currentTime) {
    for (let clientId in activeClients) {

        if( !activeClients[clientId].player.dead){
            activeClients[clientId].player.update(currentTime);
            activeClients[clientId].player.move(elapsedTime)
            for (let otherClientId in activeClients){
                if(otherClientId !== activeClients[clientId].player.clientId && !activeClients[otherClientId].player.dead && activeClients[otherClientId].player.invincibility <= 0 && activeClients[clientId].player.invincibility<=0 ){
                    if(collided(activeClients[clientId].player, activeClients[otherClientId].player)){
                        console.log("HIT")
                        //REMEBVER YOU CHANGED THE RADIUS FOR THE PLAYER!!!!!
                        //you need to mess around with the radius
                        segmentHits.push({
                            position: activeClients[clientId].player.position,
                            clientId: clientId
                        })
                        for (let i = 0; i < activeClients[clientId].player.segments.length; i++){
                            segmentHits.push({
                                position: activeClients[clientId].player.segments[i].position,
                                clientId: clientId
                            })
                        }
                    }

                    for(let i = 0; i < activeClients[otherClientId].player.segments.length; i++){
                        let obj1 = { position:{
                            x:activeClients[otherClientId].player.segments[i].position.x, 
                            y: activeClients[otherClientId].player.segments[i].position.y,
                            },
                            radius: activeClients[otherClientId].player.segments[i].size.radius
                        }
                        if (collided(obj1, activeClients[clientId].player)) {
                            console.log("HIT segment")
                           segmentHits.push({
                                position: activeClients[clientId].player.position,
                                clientId: clientId
                            })
                            for (let j = 0; j < activeClients[clientId].player.segments.length; j++){
                                segmentHits.push({
                                    position: activeClients[clientId].player.segments[j].position,
                                    clientId: clientId
                                })
                            }

                        }
                        
                    }
                }
            }
        }else{
            
            activeClients[clientId].player.snakeHit(currentTime);
           
        }
    }

    for (let food = 0; food < newFoods.length; food++) {
        newFoods[food].update(elapsedTime);
    }
    
   
    let keepFoods = [];
    for (let food = 0; food < activeFood.length; food++) {
        //
        // If update returns false, that means the food lifetime ended and
        if (activeFood[food].update(elapsedTime)) {
            keepFoods.push(activeFood[food]);
        }
    }
    activeFood = keepFoods;
    

    //
    // Check to see if any missiles collide with any players (no friendly fire)
    keepFoods = [];
    for (let food = 0; food < activeFood.length; food++) {
        let hit = false;
        for (let clientId in activeClients) {
                if (collided(activeFood[food], activeClients[clientId].player)) {
                    hit = true;
                    hits.push({
                        clientId: clientId,
                        foodId: activeFood[food].id,
                        position: activeClients[clientId].player.position
                    });
                }
        }
        if (!hit) {
            keepFoods.push(activeFood[food]);
        }
    }
    activeFood = keepFoods;
    if ((activeFood.length + newFoods.length) < FoodAMT){
        while (activeFood.length + newFoods.length < FoodAMT) {
            // Generate a new food item
            let x = Math.random(); // Random x-coordinate between 0 (inclusive) and 1 (exclusive)
            let y = Math.random();
            let position = {x:x, y:y};
            createFood(position);
            

            
        }
    }
    
}

//------------------------------------------------------------------
//
// Send state of the game to any connected clients.
//
//------------------------------------------------------------------
function updateClients(elapsedTime) {
    //
    // For demonstration purposes, network updates run at a slower rate than
    // the game simulation.
    lastUpdate += elapsedTime;
    if (lastUpdate < STATE_UPDATE_RATE_MS) {
        return;
    }

    //
    // Build the food messages one time, then reuse inside the loop
    let foodMessages = [];
    for (let item = 0; item < newFoods.length; item++) {
        let food = newFoods[item];
        foodMessages.push({
            id: food.id,
            position: {
                x: food.position.x,
                y: food.position.y
            },
            radius: food.radius,
            timeRemaining: food.timeRemaining
        });
    }

    //
    // Move all the new missiles over to the active missiles array

    for (let food = 0; food < newFoods.length; food++) {
        
        activeFood.push(newFoods[food]);
    }
    newFoods.length = 0;

    for (let clientId in activeClients) {
        let client = activeClients[clientId];
        let update = {
            clientId: clientId,
            lastMessageId: client.lastMessageId,
            direction: client.player.direction,
            position: client.player.position,
            segments: client.player.segments,
            name: client.player.playerName,
            dead: client.player.dead,
            updateWindow: lastUpdate
        };
        if (client.player.reportUpdate) {
            client.socket.emit(NetworkIds.UPDATE_SELF, update);

            //
            // Notify all other connected clients about every
            // other connected client status...but only if they are updated.
            for (let otherId in activeClients) {
                if (otherId !== clientId) {
                    activeClients[otherId].socket.emit(NetworkIds.UPDATE_OTHER, update);
                }
            }
        }

        //
        // Report any new missiles to the active clients
        for (let food = 0; food < foodMessages.length; food++) {
            
            client.socket.emit(NetworkIds.FOOD_NEW, foodMessages[food]);
        }
      
      for (let hit = 0; hit < segmentHits.length; hit++) {
            let hitInfo = segmentHits[hit]
            client.socket.emit(NetworkIds.SNAKE_HIT, hitInfo);
            if(hitInfo.clientId === clientId){
                client.socket.emit(NetworkIds.DEAD_SNAKE, clientId)
                client.player.reportUpdate = true
                //handlePlayerDisconnect(clientId, client)
                client.player.dead = true
                //delete activeClients[clientId];
                createFood(segmentHits[hit].position);
                
            }
            
                
            
        }

        //
        // Report any food hits to this client
        for (let hit = 0; hit < hits.length; hit++) {
            console.log(hits[hit])
            client.socket.emit(NetworkIds.FOOD_HIT, hits[hit]);
        }
        
    }

    for (let clientId in activeClients) {
        activeClients[clientId].player.reportUpdate = false;
        
    }

    //
    // Don't need these anymore, clean up
    hits.length = 0;
    segmentHits.length = 0;
    //
    // Reset the elapsed time since last update so we can know
    // when to put out the next update.
    lastUpdate = 0;
   
    
}

//------------------------------------------------------------------
//
// Server side game loop
//
//------------------------------------------------------------------
function gameLoop(currentTime, elapsedTime) {
    processInput(elapsedTime);
    update(elapsedTime, currentTime);
    updateClients(elapsedTime);

    if (!quit) {
        setTimeout(() => {
            let now = present();
            gameLoop(now, now - currentTime);
        }, SIMULATION_UPDATE_RATE_MS);
    }
}

//------------------------------------------------------------------
//
// Get the socket.io server up and running so it can begin
// collecting inputs from the connected clients.
//
//------------------------------------------------------------------
function initializeSocketIO(httpServer) {
    let io = require('socket.io')(httpServer);

    //------------------------------------------------------------------
    //
    // Notifies the already connected clients about the arrival of this
    // new client.  Plus, tell the newly connected client about the
    // other players already connected.
    //
    //------------------------------------------------------------------
    function notifyConnect(socket, newPlayer, name) {
        for (let clientId in activeClients) {
            let client = activeClients[clientId];
            if (newPlayer.clientId !== clientId) {
                //
                // Tell existing about the newly connected player
                client.socket.emit(NetworkIds.CONNECT_OTHER, {
                    clientId: newPlayer.clientId,
                    direction: newPlayer.direction,
                    position: newPlayer.position,
                    rotateRate: newPlayer.rotateRate,
                    speed: newPlayer.speed,
                    size: newPlayer.size,
                    name: name,
                    segments: newPlayer.getSegments(),
                });
               

                //
                // Tell the new player about the already connected player
                socket.emit(NetworkIds.CONNECT_OTHER, {
                    clientId: client.player.clientId,
                    direction: client.player.direction,
                    position: client.player.position,
                    rotateRate: client.player.rotateRate,
                    speed: client.player.speed,
                    size: client.player.size,
                    segments: client.player.getSegments()
                });
               
                
                
                    
                        
                  
                
            }
        }
    }

    //------------------------------------------------------------------
    //
    // Notifies the already connected clients about the disconnect of
    // another client.
    //
    //------------------------------------------------------------------
    function notifyDisconnect(playerId) {
        for (let clientId in activeClients) {
            let client = activeClients[clientId];
            if (playerId !== clientId) {
                client.socket.emit(NetworkIds.DISCONNECT_OTHER, {
                    clientId: playerId,
                    name: activeClients[playerId]?.player?.playerName
                });
            }
        }
        delete activeClients[playerId];
    }
    
    io.on('connection', function(socket) {
        console.log('Connection established: ', socket.id);
        //
        // Create an entry in our list of connected clients
        
        socket.emit(NetworkIds.CONNECT_ACK, {

        });

        socket.on(NetworkIds.SNAKE_NAME, data => {
            socket.emit(NetworkIds.TUTORIAL_START, {
            });

            socket.on(NetworkIds.TUTORIAL_DONE, dataTUT => {
                inputQueue.enqueue({
                    clientId: socket.id,
                    message: data
                });
                let newPlayer
                
                inputQueue.enqueue({
                    clientId: socket.id,
                    message: data
                });
                newPlayer = Player.create(data.playerName)
                newPlayer.updatePlayerName(data.playerName)
                console.log(newPlayer.playerName)
                newPlayer.clientId = socket.id;
                activeClients[socket.id] = {
                    socket: socket,
                    player: newPlayer
                };
                let foodMessages = [];
                for (let item = 0; item < activeFood.length; item++) {
                    let food = activeFood[item];
                    foodMessages.push({
                        id: food.id,
                         position: {
                        x: food.position.x,
                         y: food.position.y
                        },
                        radius: food.radius,
                        timeRemaining: food.timeRemaining
                    });
                }

                for (let food = 0; food < foodMessages.length; food++) {

                socket.emit(NetworkIds.FOOD_NEW, foodMessages[food]);
                }
                newPlayer.addSegment();
                socket.emit(NetworkIds.CONNECT_SNAKE, {
                    playerName: data.playerName,
                    direction: newPlayer.direction,
                    position: newPlayer.position,
                    size: newPlayer.size,
                    rotateRate: newPlayer.rotateRate,
                    speed: newPlayer.speed,
                    segments: newPlayer.getSegments(),
                    id: socket.id,

                },
                notifyConnect(socket, newPlayer, data.playerName));
                socket.on(NetworkIds.INPUT, data => {
                    inputQueue.enqueue({
                        clientId: socket.id,
                        message: data
                    });
                });
            }); 
            
        });



        socket.on('disconnect', function() {
            notifyDisconnect(socket.id);
        });

        
    });
}

//------------------------------------------------------------------
//
// Entry point to get the game started.
//
//------------------------------------------------------------------
function initialize(httpServer) {
    initializeSocketIO(httpServer);
    gameLoop(present(), 0);
}

//------------------------------------------------------------------
//
// Public function that allows the game simulation and processing to
// be terminated.
//
//------------------------------------------------------------------
function terminate() {
    this.quit = true;
}

module.exports.initialize = initialize;
