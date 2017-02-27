/* JavaScript tetris game.
 * File: main.js */

function main() {
    /* Add an event listener for key pressed.
     * handleInput() is defined in game.js */
    gridCanvas.addEventListener("keydown", handleInput);
    var b = getRandomBlock(); // This function is defined in blocks.js
    /* Create a new grid object.
     * gridHeight and gridWidth are defined in graphics.js */
    var grid = {
        height: gridHeight,
        width: gridWidth,
        positions: {},
    };
    console.log(grid);
    b.grid = grid;
    handleInput.block = b;
    handleInput.grid = grid;
    console.log(b);
    drawBlock(b);
}

main();
