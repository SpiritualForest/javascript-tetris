/* JavaScript tetris game.
 * File: main.js */

/* TODO: Maybe a config file? Maybe attach this shit to an actual website */

function startGame(inputFunction) {
    /* Create a new grid object.
     * gridHeight and gridWidth are defined in graphics.js */
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
        level: parseInt(document.getElementById("startlevel").value), // Which level (drop speed)
        autoMoveMilliseconds: 1000, // automove delay for setTimeout()
        previousLineCount: 1, // For calculating the score when lines are completed
        softdrop: 0, // For allowing the user to soft drop. Needs to press down-key twice.
        allowMovement: true, // Can the movement and rotation keys be used? This is only to avoid problems when redrawing the grid.
        randomizerHeight: parseInt(document.getElementById("gridheight").value), // For the block randomizer function
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
            document.getElementById("gridheight").value = "8";
        }
        gameObject.randomizeGrid();
    }
    /* Set the automove milliseconds according to the start level */
    gameObject.autoMoveMilliseconds -= gameObject.level * 80;
    console.log(gameObject.autoMoveMilliseconds);
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
        this.block = Object.create(this.nextblock);
        this.drawBlock();
        this.nextblock = this.getBlock();
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
