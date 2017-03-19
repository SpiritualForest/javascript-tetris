/* JavaScript tetris game.
 * File: blocks.js
 * Handles the block objects */

/* We're using the Nintendo Rotation System: http://tetris.wikia.com/wiki/Nintendo_Rotation_System?file=NESTetris-pieces.png */
// I, O, J, L, T, S, Z

// Block type constants
var BLOCKS = [I, O, J, L, T, S, Z]; // For randomly spawning a block of some type

function getCenter(canvasWidth, blockWidth) {
    /* Returns the center position in <canvas> according to the given block width */
    /* squareSize is defined in graphics.js */
    return Math.floor((canvasWidth / 2) - (blockWidth / 2)) * squareSize;
}

function convertCoordinatesMap(cmap, canvasWidth, width) {
    /* Converts the coordinates map (cmap) into (x, y) topleft values
     * according to the given width (which is some block's width).
     * This function is only used when constructing a new block object. */
    var coordinates = [];
    var y = 0;
    for(let columns of cmap) {
        // The starting point of x is determined by the getCenter() function
        var x = this.getCenter(canvasWidth, width);
        for (let column of columns) {
            if (column === 0) {
                // Skip this position.
                x += squareSize;
                continue;
            }
            else {
                // We want to draw a square here. Append this position to our coordinates array
                coordinates.push([x, y]);
                x += squareSize;
            }
        }
        // This row finished. Move to the next one.
        y += squareSize;
    }
    // Return the coordinates array of arrays.
    return coordinates;
}

function shiftCoordinates(coordinates, direction) {
    /* Takes the coordinates and changes them according to the direction given.
     * D_LEFT == x-squareSize 
     * D_RIGHT == x+squareSize 
     * D_DOWN == y+squareSize
     * Those are just constants. But for purposes of reference, they're defined in game.js currently.
     */
    var newCoordinates = [];
    var len = coordinates.length;
    for(var i = 0; i < len; i++) {
        var x = coordinates[i][0], y = coordinates[i][1];
        if (direction === D_LEFT) {
            newCoordinates.push([x-squareSize, y]);
        }
        else if (direction === D_RIGHT) {
            newCoordinates.push([x+squareSize, y]);
        }
        else if (direction === D_DOWN) {
            newCoordinates.push([x, y+squareSize]);
        }
        else {
            /* Function called with wrong direction argument */
            console.log("shiftCoordinates() called with unusual direction: " + direction);
            return;
        }
    }
    /* Return the modified coordinates */
    return newCoordinates;
}

function I() {
    var block = {
        /* Coordinates is a list of arrays */
        coordinatesMap: [
            [1, 1, 1, 1]
        ],
        /* Rotations is a list of lists of arrays.
         * Each sublist refers to one complete rotation */
        rotationsMap: [
            [ 
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ],
            [
                [1, 1, 1, 1]
            ]
        ],
        color: "cyan", // Block color
        width: 4,// Needed for positioning
        type: "I",
    };
    return block;
}

function O() {
    var block = {
        coordinatesMap: [
            [1, 1],
            [1, 1]
        ],
        rotationsMap: [
            [
                [1, 1],
                [1, 1]
            ]
        ],
        color: "yellow",
        width: 2,
        type: "O",
    };
    return block;
}

function T(){
    var block = {
        coordinatesMap: [
            [0, 1, 0],
            [1, 1, 1]
        ],
        rotationsMap: [
            // First rotation
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0]
            ],
            // Second rotation
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ],
            // Third rotation
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0]
            ],
            // Fourth rotation (original form)
            [
                [0, 1, 0],
                [1, 1, 1]
            ]
        ],
        color: "purple",
        width: 3,
        type: "T",
    };
    return block;
}

function J() {
    var block = {
        coordinatesMap: [
            [1, 0, 0],
            [1, 1, 1]
        ],
        rotationsMap: [
            // First rotation
            [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0]
            ],
            // Second rotation
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 1]
            ],
            // Third rotation
            [
                [0, 1, 1],
                [0, 1, 0],
                [0, 1, 0]
            ],
            // Original shape
            [
                [1, 0, 0],
                [1, 1, 1]
            ]
        ],
        color: "blue",
        width: 3,
        type: "J",
    };
    return block;
}

function L() {
    var block = {
        coordinatesMap: [
            [0, 0, 1],
            [1, 1, 1]
        ],
        rotationsMap: [
            // First rotation
            [
                [1, 1, 0],
                [0, 1, 0],
                [0, 1, 0]
            ],
            // Second rotation
            [
                [0, 0, 0],
                [1, 1, 1],
                [1, 0, 0]
            ],
            // Third rotation
            [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1]
            ],
            // Original shape
            [
                [0, 0, 1],
                [1, 1, 1]
            ]
        ],
        color: "orange",
        width: 3,
        type: "L",
    };
    return block;
}

function S() {
    var block = {
        coordinatesMap: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        rotationsMap: [
            /* First */
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 0, 1]
            ],
            /* Original */
            [
                [0, 1, 1],
                [1, 1, 0]
            ]
        ],
        color: "lime",
        width: 3,
        type: "S",
    };
    return block;
}

function Z() {
    var block = {
        coordinatesMap: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        rotationsMap: [
            /* First */
            [
                [0, 0, 1],
                [0, 1, 1],
                [0, 1, 0]
            ],
            /* Original */
            [
                [1, 1, 0],
                [0, 1, 1]
            ]
        ],
        color: "red",
        width: 3,
        type: "Z",
    };
    return block;
}

function getBlock() {
    /* Meta-function to create new blocks */
    var blockType = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
    var block = blockType();
    /* Convert the block's coordinates map into actual [x,y] positions. */
    block.coordinates = this.convertCoordinatesMap(block.coordinatesMap, this.grid.width, block.width);
    /* Now convert the block's rotations map into actual [x,y] positions,
     * and push them into a rotations list-of-lists. */
    block.rotations = [];
    block.currentRotation = 0; // We stand at the first rotation
    for(let rmap of block.rotationsMap) {
        block.rotations.push(this.convertCoordinatesMap(rmap, this.grid.width, block.width));
    }
    /* We no longer need the rotations map.
     * To save memory, we will delete it from our object. */
    delete block.rotationsMap;
    /* Return the constructed block object */
    return block;
}
