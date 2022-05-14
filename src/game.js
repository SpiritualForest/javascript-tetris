/* JavaScript tetris game.
 * File: game.js
 * This file contains all the game logic. */

/* Directional constants (arrow key codes for keydown event; D stands for direction).
 * The numbers are the ASCII values for the keys. */
var D_LEFT = 37;   // Left arrow
var D_ROTATE = 38; // Up arrow
var D_RIGHT = 39;  // Right arrow
var D_DOWN = 40;   // Down arrow
var D_LIST = [D_LEFT, D_RIGHT, D_DOWN];
/* Other input constants */
var K_PAUSE = 80;   // P
var K_QUIT = 27;    // Esc
var K_QUIT2 = 81;   // Q
var K_RESTART = 13; // Enter
var K_LEVELUP = 76; // L
var K_HARDDROP = 32; // Spacebar
// Function keys list
var FK_LIST = [K_PAUSE, K_QUIT, K_QUIT2, K_RESTART]

function handleDocumentInput(ev) {
    if (ev.keyCode == K_RESTART) {
        if ((handleInput.gameObject === undefined) || (!handleInput.gameObject.gameStarted)) {
            // Start the game when the user presses Enter
            gridCanvas.focus() // gridCanvas comes from graphics.js
            startGame(handleInput)
        }
    }
}

function handleInput(ev) {
    /* Handles input from keyboard and mouse.
     * Every key press and mouse click triggers this function. */
    ev = ev || window.event;
    
    var go = handleInput.gameObject;
    
    if (ev.type === "click") {
        /* Start or restart the game by clicking on the canvas */
        if (go !== undefined) { 
            /* Restart the game if it's not paused.
             * A click while paused could be an indication that
             * the canvas element lost focus, and the user is trying to refocus it,
             * so that they can unpause and continue the game. */
            if (!go.paused) {
                go.endGame();
                startGame(handleInput);
            }
        }
        else { 
            /* New game */
            startGame(handleInput);
        }
    }
    var keyCode = ev.keyCode;
    if ((go !== undefined) && (go.gameStarted)) {
        if (go.paused && FK_LIST.indexOf(keyCode) === -1) {
            /* The pressed key was not found in the function keys list, and the game is paused.
             * Only the function keys can work when the game is paused. */
            return;
        }
        /* These ones can only work if the game is in progress */
        if (D_LIST.indexOf(keyCode) !== -1 && go.allowMovement) {
            /* Movement keys. */
            var drop = go.moveBlock(keyCode);
            if (drop) {
                /* If the user pressed the down key twice in a row and there was a collision, we drop the block */
                go.softdrop++;
                if (go.softdrop === 2) {
                    /* Drop the block, clear the automatic movement timer, and then restart it.
                     * If we don't clear it first, there will be two active timers. */
                    go.dropBlock();
                    clearTimeout(go.autoMoveTimer);
                    go.restartAutoMove(true); // passing true means it'll spawn a new block
                    go.softdrop = 0;
                }
            }
        }
        else if (keyCode === K_RESTART) {
            go.endGame();
            startGame(handleInput);
        }
        else if (keyCode === K_HARDDROP) {
            /* Hard drop the block */
            go.block.coordinates = go.hardDrop(go.block.coordinates.slice());
            go.redrawGrid();
            go.dropBlock();
            clearTimeout(go.autoMoveTimer);
            go.restartAutoMove(true);
        }
        else if ((keyCode === D_ROTATE) && (go.allowMovement)) {
            /* Rotate the block */
            go.rotateBlock();
        }
        else if (keyCode === K_PAUSE) {
            /* Pause and unpause */
            if (!go.paused) {
                // Pause
                go.paused = true;
                clearTimeout(go.autoMoveTimer);
                go.clearGrid();
                go.drawTextOnGrid("PAUSE", 30);
            }
            else {
                // Unpause
                go.paused = false;
                go.redrawGrid();
                go.drawBlock();
                go.restartAutoMove();
            }
        }
        else if ((keyCode === K_QUIT) || (keyCode === K_QUIT2)) {
            /* Quit the game */
            go.endGame();
        }
        else if (keyCode == K_LEVELUP) {
            /* Allow the user to increase the level and drop speed */
            if (go.autoMoveMilliseconds - go.dropSpeedReduction > go.minAutoMoveMilliseconds) {
                go.level++;
                go.autoMoveMilliseconds -= go.dropSpeedReduction;
                go.drawStats();
            }
        }
    }
}

function rotateBlock() {
    /* Rotates the block */
    var block = this.block;
    var rotationCoordinates = block.rotations[block.currentRotation].slice();
    if (this.isCollision(rotationCoordinates)) {
        /* Cannot perform the rotation due to a collision or out-of-bounds squares. */
        return;
    }
    /* The rotation is possible. There was no collision. */
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
             * It means that dropBlock() needs to be called. */
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

function hardDrop(coordinates) {
    /* Shifts the coordinates downwards repeatedly until a collision occurs,
     * and then returns the down-most uncollided coordinates */
    var newCoordinates = [];
    while (!this.isCollision(coordinates)) {
        /* If there's no collision, we copy the uncollided coordinates into newCoordinates.
         * Then we shift the uncollided coordinates downwards again. */
        newCoordinates = coordinates.slice();
        coordinates = this.shiftCoordinates(coordinates, D_DOWN);
    }
    return newCoordinates;
}

function isCollision(coordinates) {
    /* Checks whether the given coordinates collide with any other coordinates
     * that already exist in the grid, or whether they go off the grid altogether. */
    var grid = this.grid;
    var gridWidthPixels = gridWidth * squareSize;
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
        /* Here we check x against the grid's width in pixels because
         * the width is represented in squares, whereas x is in pixels. */
        if ((x < 0) || (x >= gridWidthPixels)) {
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
        return true;
    }
    return false;
}

function pushLines(max) {
    /* Push all lines downwards after completing lines. */
    var min = Math.min(parseInt(Object.keys(this.grid.positions))); // top most line on the grid
    /* We have to loop backwards from max towards min.
     * If we encounter a key whose value is undefined,
     * we increase the step by squareSize.
     * If it IS defined, we copy its values to whatever key i+step is
     * and delete it from the grid. */
    var step = 0;
    for(var i = max; i >= min; i -= squareSize) {
        var values = this.grid.positions[i];
        if (values === undefined) {
            /* Empty line. Increase step by squareSize */
            step += squareSize;
        }
        else {
            /* This line is not empty. Push its values downwards by <step>
             * and then delete it from the grid. */
            this.grid.positions[i+step] = values;
            delete this.grid.positions[i];
        }
    }
}

function clearLine(y) {
    /* Line clearing animation function. */
    var timeoutMs = 0; // timeout delay for setTimeout(), in milliseconds
    /* Get the center x position on the grid */
    var decreasingCenterx = this.grid.width / 2 - 1;
    var increasingCenterx = decreasingCenterx + 1;
    /* Now we loop until both x variables have reached the limits (0 and 9 by default; the grid width is set to 10 squares by default) */
    var gameObject = this;
    var width = this.grid.width - 1;
    while((decreasingCenterx >= 0) && (increasingCenterx <= width)) {
        /* Set the x array and call clearxPositions with a timeout.
         * The center x positions are multiplied by squareSize
         * because they need to be treated as pixels, not as single concrete squares. */
        var xarray = [decreasingCenterx * squareSize, increasingCenterx * squareSize];
        setTimeout(gameObject.clearxPositions.bind(this, xarray, y), timeoutMs);
        /* Adjust the values */
        decreasingCenterx--;
        increasingCenterx++;
        timeoutMs += 50;
    }
    /* Redraw the entire grid 5 milliseconds after clearing the final line.
     * redrawGrid() is defined in graphics.js */
    setTimeout(gameObject.redrawGrid.bind(this), timeoutMs + 5);
}

function dropBlock() {
    /* This function adds the block's coordinates to the grid. */
    var block = this.block, grid = this.grid;
    var linecount = 0, maxy = 0;
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
                 * Call the line clearing animation function.
                 * Remove the line from the grid.
                 * Increase line count by one. */
                this.clearLine(y);
                delete this.grid.positions[y];
                maxy = y; // Required for pushLines()
                linecount++; // Only required for calculating the score multipliction
                this.lines++;
                if (this.lines % 10 === 0) {
                    /* Increase the level after 10 lines and reduce
                     * the drop speed by the amount of milliseconds
                     * set in the game object's dropSpeedReduction property.
                     * (Only if it's still above the minimum limit) */
                    this.level++;
                    if (this.autoMoveMilliseconds > this.minAutoMoveMilliseconds) {
                        this.autoMoveMilliseconds -= this.dropSpeedReduction;
                    }
                }
            }
        }
    }
    if (linecount > 0) {
        /* Scoring after line completion */
        var scoreMultiplication = [40, 100, 300, 1200];
        this.score += scoreMultiplication[linecount-1] * (this.level + 1) * this.previousLineCount;
        this.previousLineCount = linecount;
        /* Rearrange the grid after the completed lines have been removed.
         * Prohibit movement and rotation until all the lines have been cleared. */
        this.pushLines(parseInt(maxy));
        this.allowMovement = false;
    }
    /* Scoring based on grid cells soft dropped */
    this.score += ((y + squareSize) / squareSize) * ((this.randomizerHeight * 2) + 1);
    this.drawStats(); // Defined in graphics.js
}

function endGame() {
    /* Cancel automatic movement */
    clearTimeout(this.autoMoveTimer);
    this.gameStarted = false;
    /* Write "GAME OVER" in the center of the grid.
     * drawText() is defined in graphics.js */
    this.drawTextOnGrid("GAME OVER", 20);
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomizeGrid() {
    /* Adds random coordinates to the grid based on gameObject.randomizerHeight. */
    var colors = ["lime", "red", "cyan", "yellow", "purple", "blue", "orange"]; // Block colours
    var clen = colors.length; // For performance reasons.
    /* Generate the xlist according to the grid width and square size */
    var xlist = [];
    for(var x = 0; x < this.grid.width; x++) {
        /* Remember that the width is represented in whole squares, but the x positions we need to push should be in pixels. */
        xlist.push(x * squareSize);
    }
    var splicedList = [];
    /* Now loop from lowestPosition until we reach topPosition. */
    var lowestPosition = this.grid.height - squareSize; // Lowest y position we can draw on, in pixels
    var topPosition = lowestPosition - ((this.randomizerHeight * 2 * squareSize) + squareSize); // Highest y position we can draw on, in pixels
    for(var y = lowestPosition; y > topPosition; y -= squareSize) {
        /* Generate a random number between grid.width / 3 and grid.width.
         * This will determine how many x positions we'll draw on in this y position */
        var iterations = getRandomNumber(Math.floor(this.grid.width / 3), this.grid.width);
        this.grid.positions[y] = []; // Initialize the list-of-lists on this y position
        for(var x = 0; x < iterations; x++) {
            /* Fetch a random colour and a random x value */
            var color = colors[getRandomNumber(0, clen)];
            
            /* We splice here to avoid the possibility of drawing duplicate values at random.
             * We will readd the spliced values into the original xlist array after we're done with this loop.
             * We must first get the x position as a single value, because array.splice() returns another array.
             * So we call splice() only to remove the value from xlist, but discard the result of that operation. */
            var xposIndex = getRandomNumber(0, xlist.length);
            var xpos = xlist[xposIndex];
            xlist.splice(xposIndex, 1);
            splicedList.push(xpos);
            this.grid.positions[y].push([xpos, color]);
        }
        /* Readd the spliced values back to our main xlist */
        xlist = xlist.concat(splicedList);
        /* Reset the spliced list */
        splicedList = [];
    }
}
