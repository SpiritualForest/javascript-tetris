/* JavaScript tetris game.
 * File: game.js */

/* TODO: MUST USE SETTIMEOUT() TO ACHIEVE NON-BLOCKING */

/* Directional constants (arrow key codes for keydown event) */
var D_LEFT = 37;
var D_ROTATE = 38;
var D_RIGHT = 39;
var D_DOWN = 40;
/* Other input constants */
var K_PAUSE = 80;
var K_QUIT = 81;
/* TODO: Maybe a level-up feature? So that the player can increase the difficulty at will */

function initGrid() {
    /* Initializes a grid to empty lists.
     * Each index of the grid will correspond to a "y" location,
     * and its given subarray will corrspond to "x" locations on that particular row.
     * gridCanvas is defined in graphics.js */
    var grid = [];
    var height = gridCanvas.height / squareSize;
    for(var i = 0; i < height; i++) {
        grid.push(new Array());
    }
    return grid;
}

function handleInput(ev) {
    /* Handles general input */
    ev = ev || window.event;
    var keyCode = ev.keyCode;
    console.log("key code: " + keyCode);
    if ((keyCode === D_LEFT) || (keyCode === D_RIGHT) || (keyCode === D_DOWN)) {
        /* Trying to move the block */
        moveBlock(handleInput.block, keyCode);
    }
    else if (keyCode === D_ROTATE) {
        /* Rotate the block */
        rotateBlock(handleInput.block);
    }
    else if (keyCode === K_PAUSE) {
        /* TODO: Pause the game */
        console.log("Pause");
    }
    else if (keyCode === K_QUIT) {
        /* TODO: Quit the game */
        console.log("Quit");
    }
}

function rotateBlock(block) {
    /* Rotates the block */
    /* FIXME: This function needs to have collision detection! */
    deleteBlock(block);
    block.coordinates = block.rotations[block.currentRotation];
    block.currentRotation += 1;
    if (block.currentRotation === block.rotations.length) {
        /* Reset block.currentRotation back to zero, all rotations have been cycled through */
        block.currentRotation = 0;
    }
    drawBlock(block);
}

function moveBlock(block, direction) {
    /* Moves the block.
     * The function shiftCoordinates() is defined in blocks.js
     * deleteBlock() and drawBlock() are defined in graphics.js */
    if (direction === D_RIGHT) {
        /* x += squareSize */
        if (isxCollision(block, direction)) {
            /* There is a collision. */
            return;
        }
    }
    else if (direction === D_LEFT) {
        /* x -= squareSize */
        if (isxCollision(block, direction)) {
            /* Collision */
            return;
        }
    }
    else if (direction === D_DOWN) {
        /* y -= squareSize */
        if (isyCollision(block)) {
            /* Collision when moving downwards.
             * This is a special scenario, because it could mean the block hit the floor,
             * or some other object, and we need to "drop" it and then create a new block. */
            // FIXME: dropBlock() should only be executed on automove completion or when the player presses down arrow twice in a row.
            dropBlock(block);
            return;
        }
    }
    /* First we delete the squares that are at the block's current coordinates.
     * Then we update the block's coordinates and draw it at the next position. */
    deleteBlock(block);
    block.coordinates = shiftCoordinates(block.coordinates, direction)
    drawBlock(block);
    /* Update all the block's rotation coordinates as well */
    for(var i = 0; i < block.rotations.length; i++) {
        /* FIXME: Potential bug when the updated coordinates' values are out of screen */
        block.rotations[i] = shiftCoordinates(block.rotations[i], direction);
    }
    console.log(block);
}

function isyCollision(block) {
    /* Collision checking only for downwards movement */
    var result = -1;
    for(var i = 0; i < block.coordinates.length; i++) {
        var xy = block.coordinates[i];
        var x = xy[0], y = xy[1];
        if (block.grid.indexOf(y+squareSize) !== -1) {
            // Row exists on the grid
            var gridRow = getGridColumns(block.grid, y+squareSize);
            result = gridRow.indexOf(x);
        }
        if ((result !== -1) || (y === (gridCanvas.height - squareSize))) {
             /* We have a collision. */
            return true;
        }
        // We have to reset result to -1,
        // otherwise the if statement will always be evaluated to true.
        result = -1;
    }
    return false;
}

function getGridColumns(grid, y) {
    /* The game's grid is composed of:
     * [ y: [[x, c], [x, c], [x, c]]] where c stands for colour. */
    var columns = [];
    for(let xc of grid[y]) {
        var x = xc[0];
        columns.push(x);
    }
    return columns;
}

function isxCollision(block, direction) {
    /* Collision checking only for left and right movement */
    var result = -1;
    for(var i = 0; i < block.coordinates.length; i++) {
        var xy = block.coordinates[i]
        var x = xy[0], y = xy[1];
        if (direction === D_LEFT) {
            /* x - squareSize */
            if (block.grid.indexOf(y) !== -1) {
                // This row exists in the grid.
                result = getGridColumns(block.grid, y).indexOf(x-squareSize);
            }
            if ((result !== -1) || (x-squareSize < 0)) {
                /* We have a collision. */
                return true;
            }
            /* Reset result to -1, otherwise the if statement will always be true */
            result = -1;
        }
        else if (direction === D_RIGHT) {
            /* x + squareSize */
            if (block.grid.indexOf(y) !== -1) {
                // Row exists
                result = getGridColumns(block.grid, y).indexOf(x+squareSize);
            }
            if ((result !== -1) || (x+(squareSize*2) > (gridWidth * squareSize))) {
                /* Collision */
                return true;
            }
            result = -1;
        }
    }
    /* If we reached this point, there were no collisions */
    return false;
}

function dropBlock() {
    return true;
}
