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
    var rotationCoordinates = block.rotations[block.currentRotation].slice();
    if (isCollision(rotationCoordinates, block.grid)) {
        /* Cannot perform the rotation */
        return;
    }
    deleteBlock(block);
    block.coordinates = rotationCoordinates;
    block.currentRotation += 1;
    if (block.currentRotation === block.rotations.length) {
        /* Reset block.currentRotation back to zero, all rotations have been cycled through */
        block.currentRotation = 0;
    }
    drawBlock(block);
}

function moveBlock(block, direction) {
    // FIXME: This function is currently ugly as fuck. Refactor it somewhat.
    /* Moves the block.
     * The function shiftCoordinates() is defined in blocks.js
     * deleteBlock() and drawBlock() are defined in graphics.js */
    var newCoordinates = shiftCoordinates(block.coordinates.slice(), direction);
    if (isCollision(newCoordinates, block.grid)) {
        if (direction === D_DOWN) {
            /* Downwards collision means that the block needs be added into the grid. */
            dropBlock(block);
        }
        // Since there was a collision, we do not proceed.
        return;
    }
    /* First we delete the squares that are at the block's current coordinates.
     * Then we update the block's coordinates and draw it at the next position. */
    deleteBlock(block);
    block.coordinates = newCoordinates;
    drawBlock(block);
    /* Update all the block's rotation coordinates as well */
    for(var i = 0; i < block.rotations.length; i++) {
        block.rotations[i] = shiftCoordinates(block.rotations[i].slice(), direction);
    }
    console.log(block);
}

function isCollision(coordinates, grid) {
    /* Checks whether the given coordinates collide with any other coordinates
     * that already exist in the grid, or whether they go off the grid altogether. */
    for(let xy of coordinates) {
        var x = xy[0], y = xy[1];
        /* Check y first */
        if (y >= grid.length * squareSize) {
            /* This one goes off limits. Abort operation */
            return true;
        }
        /* We divide y by squareSize here because the y value is a pixel,
         * but the grid is represented by squares, not pixels. */
        var columns = grid.indexOf(y / squareSize);
        if (columns !== -1) {
            /* This y position exists in the grid. Check if it contains x. */
            if (columns.indexOf(x) !== -1) {
                /* Collision on grid */
                return true;
            }
        }
        /* Here we don't divide x by squareSize because we're comparing pixels rather than squares */
        else if ((x < 0) || (x >= gridCanvas.width)) {
            /* FIXME: We should NOT use gridCanvas here. Find another way. */
            return true;
        }
    }
    /* If execution reached here, there were no collisions. */
    return false;
}

function dropBlock(block) {
    /* This function adds the block's coordinates to the grid. */
    return true;
}
