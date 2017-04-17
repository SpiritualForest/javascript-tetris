/* JavaScript tetris game.
 * File: main.js */

/* TODO: Maybe a config file? Maybe attach this shit to an actual website */

function startGame(inputFunction) {
    /* Get the value for the starting height and drop speed forms.
     * We do this because further down we'll check whether the returned values
     * are of the NaN type, which we'd have to fix by resetting the values to 0. */
    var randomizerHeight = parseInt(document.getElementById("gridheight").value);
    var startlevel = parseInt(document.getElementById("startlevel").value);
    /* Create a new game object */
    var gameObject = {
        /* Methods from game.js */
        moveBlock: moveBlock,
        rotateBlock: rotateBlock,
        dropBlock: dropBlock,
        isCollision: isCollision,
        isLineCompleted: isLineCompleted,
        pushLines: pushLines,
        clearLine: clearLine,
        hardDrop: hardDrop,
        endGame: endGame,
        randomizeGrid: randomizeGrid,
        /* Methods from blocks.js */
        shiftCoordinates: shiftCoordinates,
        getBlock: getBlock,
        convertCoordinatesMap: convertCoordinatesMap,
        getCenter: getCenter,
        /* Methods from graphics.js */
        drawSquare: drawSquare,
        drawCoordinates: drawCoordinates,
        drawBlock: drawBlock,
        deleteBlock: deleteBlock,
        redrawGrid: redrawGrid,
        drawNextBlock: drawNextBlock,
        drawStats: drawStats,
        drawTextOnGrid: drawTextOnGrid,
        clearGrid: clearGrid,
        clearxPositions: clearxPositions,
        /* Methods from main.js (this file) */
        autoMove: autoMove,
        restartAutoMove: restartAutoMove,
        /* End of methods */
        /* Create a new grid object.
         * gridHeight and gridWidth are defined in graphics.js */
        grid: {
            height: gridHeight,
            width: gridWidth,
            positions: {},
        },
        /* Game procession attriutes */
        gameStarted: true, // Is the game on?
        paused: false, // Is the game paused?
        /* Stats attributes */
        lines: 0, // How many lines completed
        score: 0, // How many points
        level: isNaN(startlevel) ? 0 : startlevel, // Which level (drop speed).
        autoMoveMilliseconds: 1000, // automove delay for setTimeout()
        previousLineCount: 1, // For calculating the score when lines are completed
        softdrop: 0, // For allowing the user to soft drop. Needs to press down-key twice.
        allowMovement: true, // Can the movement and rotation keys be used? This is only to avoid problems when redrawing the grid.
        randomizerHeight: isNaN(randomizerHeight) ? 0 : randomizerHeight, // For the block randomizer function
        /* Canvas contexts. We don't actively need all of them yet */
        gridCtx: gridCanvas.getContext("2d"),
        statsCtx: statsCanvas.getContext("2d"),
        nextBlockCtx: nextBlockCanvas.getContext("2d"),
    };
    /* Add our newly created game object as a field of the input function */
    inputFunction.gameObject = gameObject;
    /* We have to set the game blocks here, since "this" points to the window */
    gameObject.block = gameObject.getBlock();
    gameObject.nextblock = gameObject.getBlock();
    /* If the randomizer height is more than 0, we call randomizeGrid() first */
    if (gameObject.randomizerHeight > 0) {
        if (gameObject.randomizerHeight > 8) {
            /* The highest value can be 8. Otherwise it becomes impossible to actually play. */
            gameObject.randomizerHeight = 8;
        }
        gameObject.randomizeGrid();
    }
    /* In case the user tried to be an idiot and enter non-number values on purpose, reset the form values */
    document.getElementById("gridheight").value = gameObject.randomizerHeight;
    document.getElementById("startlevel").value = gameObject.level;
    /* Set the automove milliseconds according to the start level */
    gameObject.autoMoveMilliseconds -= gameObject.level * 80;
    /* Clear the grid */
    gameObject.redrawGrid();
    /* Draw the current and blocks */
    gameObject.drawNextBlock();
    gameObject.drawBlock();
    /* Draw the stats */
    gameObject.drawStats();
    /* Initiate the automatic movement timer */
    gameObject.autoMoveTimer = setTimeout(function() { gameObject.autoMove() }, gameObject.autoMoveMilliseconds);
}

function autoMove() {
    var drop = this.moveBlock(D_DOWN);
    if (drop) {
        /* We encountered a collision. Drop the block. */
        var gameOver = this.dropBlock();
        if (gameOver) { return; }
    }
    this.restartAutoMove(drop);
}

function restartAutoMove(spawnNew) {
    /* if spawnNew is true, we spawn a new block */
    if (spawnNew) {
        /* We "clone" the existing next block into this.block.
         * Object.create() will create a new reference.
         * Then we set this.nextblock to an entirely new block.
         * Finally, we draw the new current block, and the new next block. */
        this.block = Object.create(this.nextblock);
        this.nextblock = this.getBlock();
        this.drawBlock();
        this.drawNextBlock();
    }
    var gameObject = this;
    this.autoMoveTimer = setTimeout(function() { gameObject.autoMove() }, this.autoMoveMilliseconds);
}

function main() {
    /* Position the canvases */
    positionCanvases();
    drawTextOnGrid("CLICK HERE", 20);
    /* Add an event listener for keyboard input */
    gridCanvas.addEventListener("keydown", handleInput);
    gridCanvas.addEventListener("click", handleInput);
}

main();
