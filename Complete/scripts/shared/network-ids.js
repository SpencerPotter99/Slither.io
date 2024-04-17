// ------------------------------------------------------------------
//
// Shared module between Nodejs and the browser that defines constants
// used for network communication.
//
// The use of the IIFE is to create a module that works on both the server
// and the client.
// Reference for this idea: https://caolan.org/posts/writing_for_node_and_the_browser.html
//
// ------------------------------------------------------------------
(function(exports) {
    'use strict';

    Object.defineProperties(exports, {
        'INPUT': {
            value: 'input',
            writable: false
        },
        'INPUT_MOVE': {
            value: 'move',
            writable: false
        },
        'INPUT_ROTATE_LEFT': {
            value: 'rotate-left',
            writable: false
        },
        'INPUT_ROTATE_SOUTH_EAST': {
            value: 'rotate-south_east',
            writable: false
        },
        'INPUT_ROTATE_RIGHT': {
            value: 'rotate-right',
            writable: false
        },
        'INPUT_ROTATE_UP': {
            value: 'rotate-up',
            writable: false
        },
        'INPUT_ROTATE_DOWN': {
            value: 'rotate-down',
            writable: false
        },
        'INPUT_ADD_SEGMENT': {
            value: 'add-segment',
            writable: false
        },
        
        'CONNECT_ACK': {
            value: 'connect-ack',
            writable: false
        },
        'CONNECT_OTHER': {
            value: 'connect-other',
            writable: false
        },
        'DISCONNECT_OTHER': {
            value: 'disconnect-other',
            writable: false
        },
        'UPDATE_SELF': {
            value: 'update-self',
            writable: false
        },
        'UPDATE_OTHER': {
            value: 'update-other',
            writable: false
        },
        'FOOD_NEW': {
            value: 'food-new',
            writable: false
        },
        'FOOD_HIT': {
            value: 'food-hit',
            writable: false
        },
        'SNAKE_HIT': {
            value: 'snake-hit',
            writable: false
        },
        'DEAD_SNAKE': {
            value: 'dead-snake',
            writable: false
        }
    });

})(typeof exports === 'undefined' ? this['NetworkIds'] = {} : exports);
