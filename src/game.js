/* JavaScript tetris game.
 * File: game.js
 * This file contains all the game logic. */

/* Directional constants (arrow key codes for keydown event; D stands for direction) */
var D_LEFT = 37;
var D_ROTATE = 38;
var D_RIGHT = 39;
var D_DOWN = 40;
/* Other input constants */
var K_PAUSE = 80;
var K_QUIT = 81;
var K_STARTNEW = 13;
/* TODO: Maybe a level-up feature? So that the player can increase the difficulty at will */
/* TODO: Improve graphics. Make completed lines flash once or twice before deleting them and redrawing the grid. */

/* TODO: Must implement a game over scenario when the blocks reach the top.
 * Do this by checking the grid's y positions. */

function handleInput(ev) {
    /* Handles keyboard input */
    ev = ev || window.event;
    var keyCode = ev.keyCode;
    var go = handleInput.gameObject;
    console.log("key code: " + keyCode);
    if (keyCode === K_STARTNEW) {
        if (typeof go === "undefined") {
            /* First game */
            startGame(handleInput);
        }
        else {
            go.endGame();
            startGame(handleInput);
        }
        return;
    }
    if (go.gameStarted) {
        /* These ones can only work if the game is in progress */
        if ((keyCode === D_LEFT) || (keyCode === D_RIGHT) || (keyCode === D_DOWN)) {
            /* Movement keys.
            * FIXME: Allow soft drop */
            drop = go.moveBlock(keyCode);
        }
        else if (keyCode === D_ROTATE) {
            /* Rotate the block */
            go.rotateBlock();
        }
        else if (keyCode === K_PAUSE) {
            /* TODO: Pause the game */
            console.log("Pause");
        }
        else if (keyCode === K_QUIT) {
            /* TODO: Quit the game */
            go.endGame();
        }
    }
}

function rotateBlock() {
    /* Rotates the block */
    // TODO: Need area based collision detection. Currently we only have grid based.
    var block = this.block;
    var rotationCoordinates = block.rotations[block.currentRotation].slice();
    if (this.isCollision(rotationCoordinates)) {
        /* Cannot perform the rotation due to a collision or out-of-bounds squares. */
        return;
    }
    this.deleteBlock(); // Clear the block's old squares from the screen
    block.coordinates = rotationCoordinates;
    block.currentRotation += 1;
    if (block.currentRotation === block.rotations.length) {
        /* Reset block.currentRotation back to zero, all rotations have been cycled through */
        block.currentRotation = 0;
    }
    this.drawBlock(); // Draw the block's new squares
}

function moveBlock(direction) {
    /* Moves the block.
     * The function shiftCoordinates() is defined in blocks.js
     * deleteBlock() and drawBlock() are defined in graphics.js */
    var block = this.block;
    var newCoordinates = this.shiftCoordinates(block.coordinates.slice(), direction);
    if (this.isCollision(newCoordinates)) {
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
    this.deleteBlock();
    block.coordinates = newCoordinates;
    this.drawBlock();
    /* Update all the block's rotation coordinates as well */
    var len = block.rotations.length;
    for(var i = 0; i < len; i++) {
        block.rotations[i] = shiftCoordinates(block.rotations[i].slice(), direction);
    }
}

function isCollision(coordinates) {
    /* Checks whether the given coordinates collide with any other coordinates
     * that already exist in the grid, or whether they go off the grid altogether. */
    var grid = this.grid;
    for(let xy of coordinates) {
        var x = xy[0], y = xy[1];
        /* Check y first */
        if (y >= grid.height) {
            /* This one goes off limits. Abort operation */
            return true;
        }
        if ((y in grid.positions) && (typeof grid.positions[y] !== "undefined")) {
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
        if ((x < 0) || (x >= grid.width * squareSize)) {
            /* Out of bounds */
            return true;
        }
    }
    /* If execution reached here, there were no collisions. */
    return false;
}

function isLineCompleted(y) {
    /* Checks if line y on the grid is full. */
    if (this.grid.positions[y].length === this.grid.width) {
        /* TODO: Flashy graphics. Draw the line using a gradient to make it look nice before removal. */
        return true;
    }
    else {
        return false;
    }
}

function removeLine(y) {
    /* Removes the line at y from the grid's positions sub-object
     * and pushes downwards all lines above it. */
    var grid = this.grid;
    var min = Math.min(parseInt(Object.keys(grid.positions)));
    for(var y; y >= min; y -= squareSize) {
        grid.positions[y] = grid.positions[parseInt(y-squareSize)];
    }
    delete grid.positions[min];
    this.redrawGrid();
}

function dropBlock() {
    /* This function adds the block's coordinates to the grid. */
    var block = this.block, grid = this.grid;
    var linecount = 0;
    for(let xy of block.coordinates.slice()) {
        var x = xy.shift(), y = xy.shift();
        if (!(y in grid.positions) || (typeof grid.positions[y] === "undefined")) {
            /* This row either doesn't exist, or had its x coordinates previously cleared.
             * We create a new array of arrays.
             * We don't check for line completion here because it's an entirely new line,
             * and therefore it can never be a completed line. */
            grid.positions[y] = [];
            grid.positions[y].push([x, block.color]);
        }
        else {
            /* Append this x position to the y row on the grid. */
            grid.positions[y].push([x, block.color]);
            if (this.isLineCompleted(y)) {
                /* Line completed.
                 * Remove it from the grid.
                 * Increase line count by one.
                 * Decrease the timeout for automove by 10 milliseconds. */
                this.removeLine(y);
                this.lines++;
                linecount++;
                this.autoMoveMilliseconds -= 10;
                if (this.lines % 10 === 0) {
                    /* Increase the level after 10 lines */
                    this.level++;
                }
            }
        }
    }
    if (linecount >= 1) {
        /* Scoring after line completion */
        console.log(linecount);
        var scoreMultiplication = [40, 100, 300, 1200];
        this.score += scoreMultiplication[linecount-1] * (this.level + 1);
    }
    /* Scoring based on grid cells soft dropped */
    this.score += (y + squareSize) / squareSize;
    this.drawStats();
    /* Check for game ending */
    if ("0" in grid.positions) {
        /* top row reached. End the game */
        this.endGame();
        return true;
    }
}

function endGame() {
    /* Cancel automatic movement */
    clearTimeout(this.autoMoveTimer);
    this.gameStarted = false;
    /* Write "GAME OVER" in the center of the grid */
    var ctx = gridCanvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.font = "30px Sans Serif";
    var string = "GAME OVER";
    ctx.fillText(string, (gridCanvas.width / 2) - (string.length * 10), gridCanvas.height / 2);
}
