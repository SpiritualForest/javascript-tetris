/* JavaScript tetris game.
 * File: blocks.js
 * Handles the block objects */

// We're using the Nintendo Rotation System: http://tetris.wikia.com/wiki/Nintendo_Rotation_System?file=NESTetris-pieces.png */
// I, O, J, L, T, S, Z

// Block type constants
var I = 1;
var O = 2;
var J = 3;
var L = 4;
var T = 5;
var S = 6;
var Z = 7;
var BLOCKS = [I, O, J, L, T, S, Z]; // For randomly spawning a block of some type

function getRandomBlock() {
    return getBlock(BLOCKS[Math.floor(Math.random() * 8)]);
}

function getCenter(blockWidth, canvas) {
    /* Returns the center position in <canvas> according to the given block width */
    /* squareSize is defined in graphics.js */
    var totalSquares = canvas.width / squareSize; // Total possible amount of squares that can fit in a single line on the canvas
    return Math.floor((totalSquares / 2) - (blockWidth / 2)) * squareSize;
}

function convertCoordinatesMap(cmap, width) {
    /* Converts the coordinates map into (x, y) topleft values and returns the array */
    /* gridCanvas is defined in graphics.js */
    var coordinates = [];
    var y = 0;
    for(let columns of cmap) {
        // The starting point of x is determined by the getCenter() function
        var x = getCenter(width, gridCanvas);
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
    for(var i = 0; i < coordinates.length; i++) {
        var x = coordinates[i].shift(), y = coordinates[i].shift();
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

function _IBlockConstructor() {
    var block = {
        /* Coordinates is a list of arrays */
        coordinatesMap: [
            new Array(1, 1, 1, 1)
        ],
        /* Rotations is a list of lists of arrays.
         * Each sublist refers to one complete rotation */
        rotationsMap: [
            [ 
                new Array(0, 0, 1, 0),
                new Array(0, 0, 1, 0),
                new Array(0, 0, 1, 0),
                new Array(0, 0, 1, 0)
            ],
            [
                new Array(1, 1, 1, 1)
            ]
        ],
        color: "green",
        width: 4 // Needed for positioning
    };
    return block;
}

function _OBlockConstructor() {
    var block = {
        coordinatesMap: [
            new Array(1, 1),
            new Array(1, 1)
        ],
        rotationsMap: [
            [
                new Array(1, 1),
                new Array(1, 1)
            ]
        ],
        color: "darkblue",
        width: 2
    };
    return block;
}

function _TBlockConstructor(){
    var block = {
        coordinatesMap: [
            new Array(1, 1, 1),
            new Array(0, 1, 0)
        ],
        rotationsMap: [
            // First rotation
            [
                new Array(0, 1, 0),
                new Array(1, 1, 0),
                new Array(0, 1, 0)
            ],
            // Second rotation
            [
                new Array(0, 1, 0),
                new Array(1, 1, 1)
            ],
            // Third rotation
            [
                new Array(0, 1, 0),
                new Array(0, 1, 1),
                new Array(0, 1, 0)
            ],
            // Fourth rotation (original form)
            [
                new Array(1, 1, 1),
                new Array(0, 1, 0)
            ]
        ],
        color: "red",
        width: 3
    };
    return block;
}

function _JBlockConstructor() {
    var block = {
        coordinatesMap: [
            new Array(1, 0, 0),
            new Array(1, 1, 1)
        ],
        rotationsMap: [
            // First rotation
            [
                new Array(0, 1, 0),
                new Array(0, 1, 0),
                new Array(1, 1, 0)
            ],
            // Second rotation
            [
                new Array(1, 1, 1),
                new Array(0, 0, 1)
            ],
            // Third rotation
            [
                new Array(0, 1, 1),
                new Array(0, 1, 0),
                new Array(0, 1, 0)
            ],
            // Original shape
            [
                new Array(1, 0, 0),
                new Array(1, 1, 1)
            ]
        ],
        color: "yellow",
        width: 3
    };
    return block;
}

function _LBlockConstructor() {
    var block = {
        coordinatesMap: [
            new Array(1, 1, 1),
            new Array(0, 0, 1)
        ],
        rotationsMap: [
            // First rotation
            [
                new Array(1, 1, 1),
                new Array(1, 0, 0)
            ],
            // Second rotation
            [
                new Array(0, 1, 0),
                new Array(0, 1, 0),
                new Array(0, 1, 1)
            ],
            // Third rotation
            [
                new Array(0, 0, 1),
                new Array(1, 1, 1)
            ],
            // Original shape
            [
                new Array(1, 1, 1),
                new Array(0, 0, 1)
            ]
        ],
        color: "pink",
        width: 3
    };
    return block;
}

function _SBlockConstructor() {
    var block = {
        coordinatesMap: [
            new Array(0, 1, 1),
            new Array(1, 1, 0)
        ],
        rotationsMap: [
            /* First */
            [
                new Array(0, 1, 0),
                new Array(0, 1, 1),
                new Array(0, 0, 1)
            ],
            /* Original */
            [
                new Array(0, 1, 1),
                new Array(1, 1, 0)
            ]
        ],
        color: "brown",
        width: 3
    };
    return block;
}

function _ZBlockConstructor() {
    var block = {
        coordinatesMap: [
            new Array(1, 1, 0),
            new Array(0, 1, 1)
        ],
        rotationsMap: [
            /* First */
            [
                new Array(0, 0, 1),
                new Array(0, 1, 1),
                new Array(0, 1, 0)
            ],
            /* Original */
            [
                new Array(1, 1, 0),
                new Array(0, 1, 1)
            ]
        ],
        color: "magenta",
        width: 3
    };
    return block;
}

function getBlock(blockName) {
    /* Meta-function to create new blocks:
     * getBlock(O) returns a new "O" block */
    var block;
    if (blockName === I) {
        block = _IBlockConstructor();
    }
    else if (blockName === O) {
        block = _OBlockConstructor();
    }
    else if (blockName === J) {
        block = _JBlockConstructor();
    }
    else if (blockName === L) {
        block = _LBlockConstructor();
    }
    else if (blockName === T) {
        block = _TBlockConstructor();
    }
    else if (blockName === S) {
        block = _SBlockConstructor();
    }
    else if (blockName === Z) {
        block = _ZBlockConstructor();
    }
    /* Convert the block's coordinates map into actual [x,y] positions. */
    block.coordinates = convertCoordinatesMap(block.coordinatesMap, block.width);
    /* Now convert the block's rotations map into actual [x,y] positions,
     * and push them into a rotations list-of-lists. */
    block.rotations = [];
    block.currentRotation = 0; // We stand at the first rotation
    for(let rmap of block.rotationsMap) {
        block.rotations.push(convertCoordinatesMap(rmap, block.width));
    }
    /* We no longer need the coordinates or rotations maps.
     * To save memory, we will delete them from our object. */
    delete block.rotationsMap;
    delete block.coordinatesMap;
    /* Return the constructed block object */
    return block;
}
