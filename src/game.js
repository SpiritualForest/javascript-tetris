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
        grid.push([]);
    }
    console.log("The grid at first:");
    console.log(grid);
    return grid;
}

function handleInput(ev) {
    /* Handles general input */
    ev = ev || window.event;
    //console.log(ev.type === 'keydown');
    var keyCode = ev.keyCode;
    console.log("key code: " + keyCode);
    if ((keyCode === D_LEFT) || (keyCode === D_RIGHT) || (keyCode === D_DOWN)) {
        /* Trying to move the block */
        var drop = moveBlock(handleInput.block, keyCode);
        if (drop) {
            dropBlock(handleInput.block);
            var b = getRandomBlock();
            console.log("Spawned new object.");
            b.grid = handleInput.grid;
            handleInput.block = b;
            drawBlock(b);
        }
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

function automove(block) {
    /* Automatically moves the block one step downwards.
     * In case of a collision, calls dropBlock(),
     * which adds the block's coordinates to the grid,
     * and checks for line completions. */
    var drop = moveBlock(block, D_DOWN);
    if (drop) {
        /* Collision occured. Drop the block. */
        dropBlock(block);
    }
}

function rotateBlock(block) {
    /* Rotates the block */
    // TODO: Need area based collision detection. Currently we only have grid based.
    var rotationCoordinates = block.rotations[block.currentRotation].slice();
    if (isCollision(rotationCoordinates, block.grid)) {
        /* Cannot perform the rotation due to a collision or out-of-bounds squares. */
        return;
    }
    deleteBlock(block); // Clear the block's old squares from the screen
    block.coordinates = rotationCoordinates;
    block.currentRotation += 1;
    if (block.currentRotation === block.rotations.length) {
        /* Reset block.currentRotation back to zero, all rotations have been cycled through */
        block.currentRotation = 0;
    }
    drawBlock(block); // Draw the block's new squares
}

function moveBlock(block, direction) {
    // FIXME: This function is currently ugly as fuck. Refactor it somewhat.
    /* Moves the block.
     * The function shiftCoordinates() is defined in blocks.js
     * deleteBlock() and drawBlock() are defined in graphics.js */
    var newCoordinates = shiftCoordinates(block.coordinates.slice(), direction);
    if (isCollision(newCoordinates, block.grid)) {
        if (direction === D_DOWN) {
            /* Downwards collision means that the block possibly needs to be added into the grid.
             * Since this function can also be called by the automove() function,
             * we return true here to indicate that a collision occured.
             * The user input handling function will ignore this, 
             * but automove() will call dropBlock(), which adds the coordinates to the grid.
             * This means that the player cannot manually cause dropBlock() to be called. */
            return true;
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
    var len = block.rotations.length;
    for(var i = 0; i < len; i++) {
        block.rotations[i] = shiftCoordinates(block.rotations[i].slice(), direction);
    }
}

function isCollision(coordinates, grid) {
    /* Checks whether the given coordinates collide with any other coordinates
     * that already exist in the grid, or whether they go off the grid altogether. */
    for(let xy of coordinates) {
        var x = xy[0], y = xy[1];
        /* Check y first */
        if (y >= grid.height) {
            /* This one goes off limits. Abort operation */
            return true;
        }
        if ((y in grid.positions) && (grid.positions[y] !== undefined)) {
            // Row exists; Check all x positions
            for(let xc of grid.positions[y]) {
                if (x == xc[0]) {
                    /* Collision */
                    return true;
                }
            }
        }
        /* Here we multiply grid.width by squareSize because
         * the width is represented in squares, whereas x is in pixels. */
        else if ((x < 0) || (x >= grid.width * squareSize)) {
            /* Out of bounds */
            return true;
        }
    }
    /* If execution reached here, there were no collisions. */
    return false;
}

function isLineCompleted(grid, y) {
    /* Checks if line y on the grid is full. */
    if (grid.positions[y].length === grid.width) {
        return true;
    }
    else {
        return false;
    }
}

function removeLine(grid, y) {
    /* Removes the line at y from the grid's positions sub-object
     * and pushes downwards all lines above it. */
    var min = Math.min(parseInt(Object.keys(grid.positions)));
    delete grid.positions[y];
    for(var y; y >= min; y -= squareSize) {
        grid.positions[y] = grid.positions[parseInt(y-squareSize)];
    }
    console.log("New grid:");
    console.log(grid);
    redrawGrid(grid);
}

function dropBlock(block) {
    /* This function adds the block's coordinates to the grid. */
    for(let xy of block.coordinates.slice()) {
        var x = xy.shift(), y = xy.shift();
        if (!(y in block.grid.positions) || (block.grid.positions[y] === undefined)) {
            /* Create a new row.
             * We don't check for line completion here because it's an entirely new line,
             * and therefore it can never be a completed line. */
            block.grid.positions[y] = [];
            block.grid.positions[y].push([x, y, block.color]);
        }
        else {
            /* Append this x position to the y row on the grid. */
            block.grid.positions[y].push([x, y, block.color]);
            if (isLineCompleted(block.grid, y)) {
                /* Check for line completion */
                console.log("Line completed.");
                removeLine(block.grid, y);
            }
        }
    }
    console.log(block.grid);
}
