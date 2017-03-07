/* JavaScript tetris game.
 * File: main.js */

/* TODO: Maybe a config file? Maybe attach this shit to an actual website */

function startGame() {
    /* Create a new grid object.
     * gridHeight and gridWidth are defined in graphics.js */
    var gameObject = {
        /* Methods from game.js */
        moveBlock: moveBlock,
        rotateBlock: rotateBlock,
        dropBlock: dropBlock,
        isCollision: isCollision,
        isLineCompleted: isLineCompleted,
        removeLine: removeLine,
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
        /* Methods from main.js (this file) */
        autoMove: autoMove,
        restartAutoMove: restartAutoMove,
        /* End of methods */
        grid: {
            height: gridHeight,
            width: gridWidth,
            positions: {},
        },
        gameStarted: true, // Is the game on?
        lines: 0, // How many lines completed
        score: 0, // How many points
        level: 0, // Which level (drop speed)
        autoMoveMilliseconds: 1000, // automove delay for setTimeout()
    };
    /* We have to set the game blocks here, since "this" points to the window */
    gameObject.block = gameObject.getBlock();
    gameObject.nextblock = gameObject.getBlock();
    gameObject.drawBlock();
    return gameObject;
}

function autoMove() {
    var drop = this.moveBlock(D_DOWN);
    if (drop) {
        /* We encountered a collision. Drop the block. */
        this.dropBlock();
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
    /* Add an event listener for keyboard input */
    gridCanvas.addEventListener("keydown", handleInput);
    var gameObject = startGame();
    handleInput.gameObject = gameObject;
    gameObject.autoMoveTimer = setTimeout(function() { gameObject.autoMove() }, gameObject.autoMoveMilliseconds);
    /* Draw the next block */
    gameObject.drawNextBlock();
    gameObject.drawStats();
}

main();
