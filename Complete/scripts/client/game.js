//------------------------------------------------------------------
//
// This function provides the "game" code.
//
//------------------------------------------------------------------
MyGame.main = (function(graphics, renderer, input, components) {
    'use strict';
    let playerName = ""
    let currentScores = {}
    let lastTimeStamp = performance.now(),
        myKeyboard = input.Keyboard(),
        playerSelf = {
            model: components.Player(),
            texture: MyGame.assets['player-self'],
            segmentTexure: MyGame.assets['player-segment']
        },
        playerOthers = {},
        foods = {},
        explosions = {},
        AnimatedFoods = {},
        messageHistory = Queue.create(),
        messageId = 1,
        nextExplosionId = 1,
        socket = io(),
        networkQueue = Queue.create();
        if(!localStorage.getItem('controls')){
            var TMPcontrols = {"Up":"KeyW","Right":"KeyD","Left":"KeyA","Down":"KeyS","addSegment":"KeyT"};
            localStorage.setItem('controls', JSON.stringify(TMPcontrols))
        }
        let controls = JSON.parse(localStorage.getItem('controls'))
        let particles = {}
        let particlesFire = components.ParticleSystem({
            center: { x: playerSelf.model.position?.x, y: playerSelf.model.position.y },
            size: { mean: 10, stdev: 4 },
            speed: { mean: 50, stdev: 25 },
            lifetime: { mean: 2, stdev: 1 }
        },
        graphics);
    
    socket.on(NetworkIds.CONNECT_ACK, data => {
        networkQueue.enqueue({
            type: NetworkIds.CONNECT_ACK,
            data: data
        });
    });

    socket.on(NetworkIds.CONNECT_SNAKE, data => {
        networkQueue.enqueue({
            type: NetworkIds.CONNECT_SNAKE,
            data: data
        });
    });

    socket.on(NetworkIds.CONNECT_OTHER, data => {
        networkQueue.enqueue({
            type: NetworkIds.CONNECT_OTHER,
            data: data
        });
    });

    socket.on(NetworkIds.DISCONNECT_OTHER, data => {
        networkQueue.enqueue({
            type: NetworkIds.DISCONNECT_OTHER,
            data: data
        });
    });

    socket.on(NetworkIds.TUTORIAL_START, data => {
        networkQueue.enqueue({
            type: NetworkIds.TUTORIAL_START,
            data: data
        });
    });

    socket.on(NetworkIds.UPDATE_SELF, data => {
        networkQueue.enqueue({
            type: NetworkIds.UPDATE_SELF,
            data: data
        });
    });

    socket.on(NetworkIds.UPDATE_OTHER, data => {
        networkQueue.enqueue({
            type: NetworkIds.UPDATE_OTHER,
            data: data
        });
    });

    socket.on(NetworkIds.FOOD_NEW, data => {
       
        networkQueue.enqueue({
            type: NetworkIds.FOOD_NEW,
            data: data
        });
    });

    socket.on(NetworkIds.SNAKE_HIT, data => {
        networkQueue.enqueue({
            type: NetworkIds.SNAKE_HIT,
            data: data
        });
    });

    socket.on(NetworkIds.DEAD_SNAKE, data => {
        networkQueue.enqueue({
            type: NetworkIds.DEAD_SNAKE,
            data: data
        });
    });

    socket.on(NetworkIds.FOOD_HIT, data => {
        networkQueue.enqueue({
            type: NetworkIds.FOOD_HIT,
            data: data
        });
    });

    //------------------------------------------------------------------
    //
    // Handler for when the server ack's the socket connection.  We receive
    // the state of the newly connected player model.
    //
    //------------------------------------------------------------------
    function connectPlayerSelf(data) {
        playerSelf.model.playerName = data.playerName
        playerSelf.model.position.x = data.position.x;
        playerSelf.model.position.y = data.position.y;

        playerSelf.model.segments = data.segments

        playerSelf.model.size.x = data.size.x;
        playerSelf.model.size.y = data.size.y;

        playerSelf.model.direction = data.direction;
        playerSelf.model.speed = data.speed;
        playerSelf.model.rotateRate = data.rotateRate;
    }

    //------------------------------------------------------------------
    //
    // Handler for when the server ack's the socket connection.  We receive
    // the state of the newly connected player model.
    //
    //------------------------------------------------------------------
    function connectPreName(data) {
        getName()
    }

    //------------------------------------------------------------------
    //
    // Handler for when a new player connects to the game.  We receive
    // the state of the newly connected player model.
    //
    //------------------------------------------------------------------
    function connectPlayerOther(data) {
        let model = components.PlayerRemote();
        model.state.playerName = data.name
        model.state.position.x = data.position.x;
        model.state.position.y = data.position.y;
        model.state.direction = data.direction;
        model.state.segments = data.segments
        model.state.lastUpdate = performance.now();
        

        model.goal.position.x = data.position.x;
        model.goal.position.y = data.position.y;
        model.goal.direction = data.direction;
        model.goal.segments = data.segments
        model.goal.updateWindow = 0;

        model.size.x = data.size.x;
        model.size.y = data.size.y;

        playerOthers[data.clientId] = {
            model: model,
            texture: MyGame.assets['player-other'],
            segmentTexure: MyGame.assets['player-segment-other']
        };
        console.log("connected other")
    }

    //------------------------------------------------------------------
    //
    // Handler for when another player disconnects from the game.
    //
    //------------------------------------------------------------------
    function disconnectPlayerOther(data) {
        delete currentScores[data.name]
        delete playerOthers[data.clientId];
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving state updates about the self player.
    //
    //------------------------------------------------------------------
    function updatePlayerSelf(data) {

        if(!data.dead){
            playerSelf.model.position.x = data.position.x;
            playerSelf.model.position.y = data.position.y;
            playerSelf.model.direction = data.direction;
            playerSelf.model.segments = data.segments

            //
            // Remove messages from the queue up through the last one identified
            // by the server as having been processed.
            let done = false;
            while (!done && !messageHistory.empty) {
                if (messageHistory.front.id === data.lastMessageId) {
                    done = true;
                }
                messageHistory.dequeue();
            }

            //
            // Update the client simulation since this last server update, by
            // replaying the remaining inputs.
            let memory = Queue.create();
            while (!messageHistory.empty) {
                let message = messageHistory.dequeue();
                switch (message.type) {
                    case NetworkIds.MOVE:
                        playerSelf.model.move(message.elapsedTime);
                        break;
                    case NetworkIds.ROTATE_UP:
                        playerSelf.model.rotateUp(message.elapsedTime);
                        break;
                    case NetworkIds.ROTATE_DOWN:
                        playerSelf.model.rotateDown(message.elapsedTime);
                        break;
                    case NetworkIds.ROTATE_RIGHT:
                        playerSelf.model.rotateRight(message.elapsedTime);
                        break;
                    case NetworkIds.ROTATE_LEFT:
                        playerSelf.model.rotateLeft(message.elapsedTime);
                        break;
                    case NetworkIds.ADD_SEGMENT:
                        playerSelf.model.addSegment();
                        break;
                }
                memory.enqueue(message);
            }
            messageHistory = memory;
        } else{
            playerSelf.model.dead = true
        }
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving state updates about other players.
    //
    //------------------------------------------------------------------
    function updatePlayerOther(data) {
        if (playerOthers.hasOwnProperty(data.clientId)) {
            let model = playerOthers[data.clientId].model;
            model.state.playerName = data.name
            model.goal.updateWindow = data.updateWindow;
            model.goal.dead = data.dead
            model.goal.segments = data.segments
            model.goal.position.x = data.position.x;
            model.goal.position.y = data.position.y
            model.goal.direction = data.direction;
        }
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving notice of a new food in the environment.
    //
    //------------------------------------------------------------------
    function foodNew(data) {
        console.log("revieving Food" + data)
        foods[data.id] = components.Food({
            id: data.id,
            radius: data.radius,
            position: {
                x: data.position.x,
                y: data.position.y
            },
            timeRemaining: data.timeRemaining
            
        });

        let randSize = 0.025 + Math.random() * (0.05 - 0.025);
        
        AnimatedFoods[data.id] = components.AnimatedSprite({
            id: data.id,
            spriteSheet: MyGame.assets['SpinnyYellow'],
            spriteSize: {width: randSize, height: randSize},
            spriteCenter: data.position,
            spriteCount: 4,
            spriteTime: [300,300,300,300]
        })

        
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving notice that a food has hit a player.
    //
    //------------------------------------------------------------------
    function foodHit(data, elapsedTime) {
        //replace with animation for eating food and adding a segment
        /*explosions[nextExplosionId] = components.AnimatedSprite({
            id: nextExplosionId++,
            spriteSheet: MyGame.assets['explosion'],
            spriteSize: { width: 0.07, height: 0.07 },
            spriteCenter: data.position,
            spriteCount: 16,
            spriteTime: [ 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250]
        });
        */
        let message = {
            id: messageId++,
            elapsedTime: elapsedTime,
            type: NetworkIds.INPUT_ADD_SEGMENT
        };
        socket.emit(NetworkIds.INPUT, message);
        messageHistory.enqueue(message);
        playerSelf.model.addSegment();
        
        //
        // When we receive a hit notification, go ahead and remove the
        // associated missle from the client model.
        delete foods[data.foodId];
        delete AnimatedFoods[data.foodId];
    }

    function snakeHit(data) {
        explosions[nextExplosionId] = components.AnimatedSprite({
            id: nextExplosionId++,
            spriteSheet: MyGame.assets['explosion'],
            spriteSize: { width: 0.07, height: 0.07 },
            spriteCenter: data.position,
            spriteCount: 16,
            spriteTime: [ 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150]
        });

        //
        // When we receive a hit notification, go ahead and remove the
        // associated missle from the client model.
        //delete missiles[data.missileId];
        particles[nextExplosionId] = components.ParticleSystem({
            center: { x: data.position.x, y: data.position.y },
            size: { mean: .05, stdev: .05 },
            speed: { mean: .005, stdev: .05 },
            lifetime: { mean: 4, stdev: 1 },
            totalParticles: 20
        },
        graphics);

    }

    function getName() {
        let winGameContainer = document.getElementById('new-game');
        winGameContainer.innerHTML = '';
        
        // Create a heading element
        let winGameText = document.createElement('h2');
        winGameText.textContent = "Please Enter the name of your Train";
        
        // Create a text input element
        let nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Enter name...';
        
        // Create a button element
        let saveNameButton = document.createElement('button');
        saveNameButton.textContent = "Save Name";
        
        // Add click event listener to the button
        saveNameButton.addEventListener('click', function() {
            // Check if nameInput has a value
            if (nameInput.value.trim() !== '') {
                playerName = nameInput.value;
                let message = {
                    id: messageId++,
                    type: NetworkIds.SNAKE_NAME,
                    playerName: playerName
                };
                socket.emit(NetworkIds.SNAKE_NAME, message);
                winGameContainer.innerHTML = "";
                winGameContainer.style.visibility = 'hidden';
            } else {
                // Handle the case when nameInput is empty
                alert("Please enter a name before you continue");
            }
        });
        
        // Style the container
        winGameContainer.style.backgroundColor = "rgba(0, 217, 255, 0.5)";
        winGameContainer.style.border = "1px solid rgba(0, 204, 255, 0.5)";
        winGameContainer.style.backdropFilter = "blur(10px)";
        winGameContainer.style.boxShadow = "0 1px 12px rgba(0,0,0,0.25)";
        
        // Append elements to the container
        winGameContainer.appendChild(winGameText);
        winGameContainer.appendChild(nameInput);
        winGameContainer.appendChild(saveNameButton);
    }

    function showTutorial() {
        
        let winGameContainer = document.getElementById('new-game');
        winGameContainer.style.visibility = 'visible';
        winGameContainer.innerHTML = '';
        
        // Create a heading element
        let winGameText = document.createElement('h2');
        winGameText.textContent = "The Snake Will Change Direction based on Keypress";
        
        
        function delayedFunction() {
            let message = {
                id: messageId++,
                type: NetworkIds.TUTORIAL_DONE,
            };
            socket.emit(NetworkIds.TUTORIAL_DONE, message);
            winGameContainer.innerHTML = "";
            winGameContainer.style.visibility = 'hidden';
        }
        
        // Style the container
        winGameContainer.style.backgroundColor = "rgba(0, 217, 255, 0.5)";
        winGameContainer.style.border = "1px solid rgba(0, 204, 255, 0.5)";
        winGameContainer.style.backdropFilter = "blur(10px)";
        winGameContainer.style.boxShadow = "0 1px 12px rgba(0,0,0,0.25)";
        
        // Append elements to the container
        winGameContainer.appendChild(winGameText);
        setTimeout(delayedFunction, 3000);
    }

    function renderHighscoreInfo() {

        let fuelContainer = document.getElementById('highscore-info');
        fuelContainer.innerHTML = '';
        
        if(playerSelf?.model?.segments?.length>0){
            fuelContainer.style.visibility = 'visible';
            let yourScore = document.createElement('h2');
            // Set the text content to be name and associated score
            yourScore.textContent = "Your Score" + ': ' + playerSelf.model.segments?.length;
            // Append the <h2> element to the fuelContainer
            fuelContainer.appendChild(yourScore);
        }

       // Loop through each name and score in currentScores
       if(Object.keys(currentScores).length>0){
            fuelContainer.style.visibility = 'visible';
            for (let name in currentScores) {
                if (currentScores.hasOwnProperty(name) && name !== 'undefined' && name !== '') {
                    // Create an <h2> element for the name and score
                    let highscoreElement = document.createElement('h2');
                    // Set the text content to be name and associated score
                    highscoreElement.textContent = name + ': ' + currentScores[name];
                    // Append the <h2> element to the fuelContainer
                    fuelContainer.appendChild(highscoreElement);
                }
            }
        } else if(playerSelf?.model?.segments?.length>0){
            fuelContainer.style.visibility = 'visible';
        } else {
            fuelContainer.style.visibility = 'hidden';
        }
    }


    function dead(data) {
        
        let winGameContainer = document.getElementById('new-game');
        winGameContainer.innerHTML = '';
        winGameContainer.style.visibility = 'visible';
        
        // Create a heading element
        let winGameText = document.createElement('h2');
        winGameText.textContent = "You DIED!";
        
        // Create a button element
        let returnToMenuButton = document.createElement('button');
        returnToMenuButton.textContent = "Return to Menu";
        
        // Add click event listener to the button
        returnToMenuButton.addEventListener('click', function() {
            // Redirect to /menu
            window.location.href = '/';
        });
        
        // Style the container
        winGameContainer.style.backgroundColor = "rgba(0, 217, 255, 0.5)";
        winGameContainer.style.border = "1px solid rgba(0, 204, 255, 0.5)";
        winGameContainer.style.backdropFilter = "blur(10px)";
        winGameContainer.style.boxShadow = "0 1px 12px rgba(0,0,0,0.25)";
        
        // Append elements to the container
        winGameContainer.appendChild(winGameText);
        winGameContainer.appendChild(returnToMenuButton);

    }

    //------------------------------------------------------------------
    //
    // Process the registered input handlers here.
    //
    //------------------------------------------------------------------
    function processInput(elapsedTime) {
        //
        // Start with the keyboard updates so those messages can get in transit
        // while the local updating of received network messages are processed.
        myKeyboard.update(elapsedTime);

        //
        // Double buffering on the queue so we don't asynchronously receive messages
        // while processing.
        let processMe = networkQueue;
        networkQueue = networkQueue = Queue.create();
        while (!processMe.empty) {
            let message = processMe.dequeue();
            switch (message.type) {
                case NetworkIds.CONNECT_ACK:
                    connectPreName(message.data);
                    break;
                case NetworkIds.TUTORIAL_START:
                    showTutorial();
                    break;
                case NetworkIds.CONNECT_OTHER:
                    connectPlayerOther(message.data);
                    break;
                case NetworkIds.DISCONNECT_OTHER:
                    disconnectPlayerOther(message.data);
                    break;
                case NetworkIds.UPDATE_SELF:
                    updatePlayerSelf(message.data);
                    break;
                case NetworkIds.UPDATE_OTHER:
                    updatePlayerOther(message.data);
                    break;
                case NetworkIds.FOOD_NEW:
                    foodNew(message.data);
                    break;
                case NetworkIds.FOOD_HIT:
                    foodHit(message.data, elapsedTime);
                    break;
                case NetworkIds.SNAKE_HIT:
                    snakeHit(message.data);
                    break;
                case NetworkIds.DEAD_SNAKE:
                    dead(message.data);
                    break;
                case NetworkIds.CONNECT_SNAKE:
                    connectPlayerSelf(message.data);
                    break;
            }
        }
    }

    function sortScoresDescending() {
        // Convert currentScores to an array of key-value pairs
        let scoresArray = Object.entries(currentScores);
    
        // Sort the array based on the score values in descending order
        scoresArray.sort((a, b) => b[1] - a[1]);
    
        // Convert the sorted array back into an object
        let sortedScores = {};
        for (let [name, score] of scoresArray) {
            sortedScores[name] = score;
        }
    
        // Update currentScores with the sorted scores
        currentScores = sortedScores;
    }

    //------------------------------------------------------------------
    //
    // Update the game simulation
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        playerSelf.model.update(elapsedTime);
        graphics.updatePlayer(playerSelf.model)
        if (!currentScores.hasOwnProperty(playerSelf.model.playerName)){
            currentScores[playerSelf?.model?.playerName] = playerSelf?.model?.segments?.length
        }
        else(
            currentScores[playerSelf?.model?.playerName] = playerSelf?.model?.segments?.length
        )
        for (let id in playerOthers) {
            playerOthers[id].model.update(elapsedTime);
            if (!currentScores.hasOwnProperty(playerOthers[id].model.state.playerName)){
                currentScores[playerOthers[id].model.state.playerName] = playerOthers[id].model.state.segments.length
            }
            else(
                currentScores[playerOthers[id].model.state.playerName] = playerOthers[id].model.state.segments.length
            )
        }

        sortScoresDescending()

        let removefoods = [];
       
        for (let food in foods) {
            
            if (!foods[food].update(elapsedTime)) {
                removefoods.push(foods[food]);
            }
        }

        for (let food = 0; food < removefoods.length; food++) {
            delete foods[removefoods[food].id];
        }
        for (let id in AnimatedFoods){
            AnimatedFoods[id].update(elapsedTime);
        }

        for (let id in explosions) {
            //particlesFire.update(elapsedTime)
  
            if (!explosions[id].update(elapsedTime)) {
                
                
                delete explosions[id];
                //delete particles[id]
            }
        }

        for(let id in particles){
            particles[id].update(elapsedTime)
        }
    }

    //------------------------------------------------------------------
    //
    // Render the current state of the game simulation
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        
        if(!playerSelf.model.dead && playerSelf.model.playerName){
            const canvasSize = { width: graphics.canvas.width, height: graphics.canvas.height };
            renderer.Player.render(playerSelf.model, playerSelf.texture, playerSelf.segmentTexure, canvasSize);

            
        }
        for (let id in playerOthers) {
            let player = playerOthers[id];

            if(!player.model.goal.dead){
                renderer.PlayerRemote.render(player.model, player.texture, player.segmentTexure);
            }
        }
        
        for (let food in foods) {
            
            renderer.AnimatedSprite.render(AnimatedFoods[food])
        }

        for (let id in explosions) {
            
            renderer.AnimatedSprite.render(explosions[id]);
            
            //renderFire.render()
        }
        for (let id in particles){
            renderer.ParticleSystem.render(particles[id], graphics, MyGame.assets['particle-fire'])
        }
        renderHighscoreInfo()
        
    }

    //------------------------------------------------------------------
    //
    // Client-side game loop
    //
    //------------------------------------------------------------------
    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        requestAnimationFrame(gameLoop);
    };

    //------------------------------------------------------------------
    //
    // Public function used to get the game initialized and then up
    // and running.
    //
    //------------------------------------------------------------------
    function initialize() {
        console.log('game initializing...');
        //
        // Registering the 'wd' key combination handler
        myKeyboard.registerHandler(elapsedTime => {
            let message = {
                id: messageId++,
                elapsedTime: elapsedTime,
                type: NetworkIds.INPUT_ROTATE_SOUTH_EAST
            };
            socket.emit(NetworkIds.INPUT, message);
            messageHistory.enqueue(message);
            playerSelf.model.rotateSouthEast(elapsedTime);
        },
        [controls.Up,controls.Right], true);

        myKeyboard.registerHandler(elapsedTime => {
                let message = {
                    id: messageId++,
                    elapsedTime: elapsedTime,
                    type: NetworkIds.INPUT_ROTATE_UP
                };
                socket.emit(NetworkIds.INPUT, message);
                messageHistory.enqueue(message);
                playerSelf.model.rotateUp(elapsedTime);
            },
            [controls.Up], true);

        myKeyboard.registerHandler(elapsedTime => {
                let message = {
                    id: messageId++,
                    elapsedTime: elapsedTime,
                    type: NetworkIds.INPUT_ROTATE_RIGHT
                };
                socket.emit(NetworkIds.INPUT, message);
                messageHistory.enqueue(message);
                playerSelf.model.rotateRight(elapsedTime);
            },
            [controls.Right], true);


            myKeyboard.registerHandler(elapsedTime => {
                let message = {
                    id: messageId++,
                    elapsedTime: elapsedTime,
                    type: NetworkIds.INPUT_ADD_SEGMENT
                };
                socket.emit(NetworkIds.INPUT, message);
                messageHistory.enqueue(message);
                playerSelf.model.addSegment();

            },
            controls.addSegment, true);

        myKeyboard.registerHandler(elapsedTime => {
                let message = {
                    id: messageId++,
                    elapsedTime: elapsedTime,
                    type: NetworkIds.INPUT_ROTATE_LEFT
                };
                socket.emit(NetworkIds.INPUT, message);
                messageHistory.enqueue(message);
                playerSelf.model.rotateLeft(elapsedTime);
            },
            controls.Left, true);
        myKeyboard.registerHandler(elapsedTime => {
            let message = {
                id: messageId++,
                elapsedTime: elapsedTime,
                type: NetworkIds.INPUT_ROTATE_DOWN
            };
            socket.emit(NetworkIds.INPUT, message);
            messageHistory.enqueue(message);
            playerSelf.model.rotateDown(elapsedTime);
        },
        controls.Down, true);

        //
        // Get the game loop started
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize
    };
 
}(MyGame.graphics, MyGame.renderer, MyGame.input, MyGame.components));
