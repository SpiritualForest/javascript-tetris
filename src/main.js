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
        endGame: endGame,
        clearLine: clearLine,
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
        drawText: drawText,
        /* Methods from main.js (this file) */
        autoMove: autoMove,
        restartAutoMove: restartAutoMove,
        /* End of methods */
        grid: {
            height: gridHeight,
            width: gridWidth,
            positions: {},
        },
        /* Stats attributes */
        gameStarted: true, // Is the game on?
        lines: 0, // How many lines completed
        score: 0, // How many points
        level: 0, // Which level (drop speed)
        autoMoveMilliseconds: 1000, // automove delay for setTimeout()
        previousLineCount: 1,
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
    /* Clear the grid */
    gameObject.redrawGrid();
    /* Draw the current and next blocks */
    gameObject.drawBlock();
    gameObject.drawNextBlock();
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
    drawText("CLICK HERE", 20);
    /* Add an event listener for keyboard input */
    gridCanvas.addEventListener("keydown", handleInput);
    gridCanvas.addEventListener("click", handleInput);
}

main();
