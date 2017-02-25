/* JavaScript tetris game.
 * File: main.js */

function main() {
    /* Add an event listener for key pressed.
     * handleInput() is defined in game.js */
    gridCanvas.addEventListener("keydown", handleInput);
    var grid = initGrid();
    var b = getRandomBlock(); // This function is defined in blocks.js
    b.grid = grid;
    handleInput.block = b;
    console.log(b);
    drawBlock(b);
}

main();
