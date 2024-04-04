//------------------------------------------------------------------
//
// This function provides the "game" code.
//
//------------------------------------------------------------------
MyGame.main = (function(graphics, renderer, input, components) {
    'use strict';

    let lastTimeStamp = performance.now(),
        myKeyboard = input.Keyboard(),
        playerSelf = {
            model: components.Player(),
            texture: MyGame.assets['player-self']
        },
        playerOthers = {},
        socket = io();

    //------------------------------------------------------------------
    //
    // Handler for when the server ack's the socket connection.  We receive
    // the state of the newly connected player model.
    //
    //------------------------------------------------------------------
    socket.on('connect-ack', function(data) {
        playerSelf.model.position.x = data.position.x;
        playerSelf.model.position.y = data.position.y;

        playerSelf.model.size.width = data.size.width;
        playerSelf.model.size.height = data.size.height;

        playerSelf.model.direction = data.direction;
    });

    //------------------------------------------------------------------
    //
    // Handler for when a new player connects to the game.  We receive
    // the state of the newly connected player model.
    //
    //------------------------------------------------------------------
    socket.on('connect-other', function(data) {
        console.log('connect-other: ', data.id);
        let model = components.Player();
        model.position.x = data.position.x;
        model.position.y = data.position.y

        model.size.width = data.size.width;
        model.size.height = data.size.height;

        model.direction = data.direction;

        playerOthers[data.id] = {
            model: model,
            texture: MyGame.assets['player-other']
        };
    });

    //------------------------------------------------------------------
    //
    // Handler for when another player disconnects from the game.
    //
    //------------------------------------------------------------------
    socket.on('disconnect-other', function(data) {
        delete playerOthers[data.id];
    });

    //------------------------------------------------------------------
    //
    // Handler for receiving state updates about the self player.
    //
    //------------------------------------------------------------------
    socket.on('update-self', function(data) {
        playerSelf.model.position.x = data.position.x;
        playerSelf.model.position.y = data.position.y;

        playerSelf.model.direction = data.direction;
    });

    //------------------------------------------------------------------
    //
    // Handler for receiving state updates about other players.
    //
    //------------------------------------------------------------------
    socket.on('update-other', function(data) {
        if (playerOthers.hasOwnProperty(data.id)) {
            let model = playerOthers[data.id].model;

            model.position.x = data.position.x;
            model.position.y = data.position.y
    
            model.direction = data.direction;
        }
    });

    //------------------------------------------------------------------
    //
    // Process the registered input handlers here.
    //
    //------------------------------------------------------------------
    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }
    
    //------------------------------------------------------------------
    //
    // Update the game simulation
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
    }

    //------------------------------------------------------------------
    //
    // Render the current state of the game simulation
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        renderer.Player.render(playerSelf.model, playerSelf.texture);
        for (let id in playerOthers) {
            let player = playerOthers[id];
            renderer.Player.render(player.model, player.texture);
        }
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
        // Create the keyboard input handler and register the keyboard commands
        myKeyboard.registerHandler(elapsedTime => {
                socket.emit('input', {
                    type: 'move',
                    elapsedTime: elapsedTime 
                });
            },
            'w', true);

        myKeyboard.registerHandler(elapsedTime => {
                socket.emit('input', {
                    type: 'rotate-right',
                    elapsedTime: elapsedTime 
                });
            },
            'd', true);

        myKeyboard.registerHandler(elapsedTime => {
                socket.emit('input', {
                    type: 'rotate-left',
                    elapsedTime: elapsedTime 
                });
            },
            'a', true);

        //
        // Get the game loop started
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize
    };
 
}(MyGame.graphics, MyGame.renderer, MyGame.input, MyGame.components));
