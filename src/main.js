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
        /* Methods from main.js (this file) */
        autoMove: autoMove,
        restartAutoMove: restartAutoMove,
        /* End of methods */
        grid: {
            height: gridHeight,
            width: gridWidth,
            positions: {},
        },
        gameStarted: false, // Is the game on?
        lines: 0, // How many lines completed
        points: 0, // How many points
        level: 0, // Which level (drop speed)
        blocks: [], // List of upcoming blocks
        autoMoveMilliseconds: 1000, // automove delay for setTimeout()
        inputFunction: inputFunction, // Function that handles keyboard input
        block: getBlock() // Initial block
    };
    /* Spawn 2 random blocks and add them to game.blocks */
    for(var i = 0; i < 2; i++) {
        gameObject.blocks.push(gameObject.getBlock());
    }
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
        this.block = this.blocks.shift();
        this.blocks.push(this.getBlock());
    }
    this.drawBlock();
    var gameObject = this;
    this.autoMoveTimer = setTimeout(function() { gameObject.autoMove() }, this.autoMoveMilliseconds);
}

function main() {
    gridCanvas.addEventListener("keydown", handleInput);
    var gameObject = startGame(handleInput);
    handleInput.gameObject = gameObject;
    gameObject.autoMoveTimer = setTimeout(function() { gameObject.autoMove() }, gameObject.autoMoveMilliseconds);
}

main();
