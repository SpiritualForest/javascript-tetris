/* JavaScript tetris game.
 * File: main.js */

/* TODO: Maybe a config file? Maybe attach this shit to an actual website */

function main() {
    /* Add an event listener for key pressed and mouse focus.
     * handleInput() is defined in game.js */
    gridCanvas.addEventListener("keydown", handleInput);
    /* Create a new grid object.
     * gridHeight and gridWidth are defined in graphics.js */
    var gameObject = {
        grid: {
            height: gridHeight,
            width: gridWidth,
            positions: {},
        },
        gameStarted: false, // Is the game on?
        lines: 0, // How many lines completed
        points: 0, // How many points
        level: 1, // Which level (drop speed)
        blocks: [], // List of upcoming blocks
        automoveMilliseconds: 1000, // automove delay for setTimeout()
    };
    /* Spawn 5 random blocks and add them to game.blocks */
    for(var i = 0; i < 5; i++) {
        gameObject.blocks.push(getRandomBlock(gameObject));
    }
    // Add the game object into handleInput.
    handleInput.gameObject = gameObject;
    //console.log(gameObject.grid.this);
    startGame(gameObject);
}

main();
