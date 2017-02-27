/* JavaScript tetris game.
 * File: graphics.js. 
 * This stuff handles all the drawing */

/* Get the canvas we're going to draw on, and set the square size according to its width.
 * A traditional tetris grid is composed of 22 rows (y) and 10 columns (x) */
var gridCanvas = document.getElementById("grid");
var gridWidth = 10; // How many squares one row can contain
var gridHeight = gridCanvas.height; // Only required for collision detection - this is pixels
var squareSize = gridCanvas.width / gridWidth;
var bgColor = gridCanvas.style.backgroundColor;

function drawSquare(x, y, size, color) {
    /* Draws a square of <size>,
     * with colour <color>, at topleft (x, y) */
    var ctx = gridCanvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(x+1, y+1, size-1, size-1);
}

function drawCoordinates(coordinates, color) {
    /* Draws squares at the given top-left positions. */
    for(let position of coordinates) {
        var x = position[0], y = position[1];
        drawSquare(x, y, squareSize, color);
    }
}

function drawBlock(block) {
    /* Draws a block on the grid */
    drawCoordinates(block.coordinates, block.color);
}

function deleteBlock(block) {
    /* Overwrites the squares specified by the block's coordinates with the canvas' background colour */
    drawCoordinates(block.coordinates, bgColor);
}

function redrawGrid(grid) {
    /* Clears the grid and redraws all the squares */
    var context = gridCanvas.getContext("2d");
    context.clearRect(0, 0, grid.width * squareSize, grid.height);
    /* Now loop on the grid's positions and redraw them one by one */
    for(let ypos of Object.keys(grid.positions)) {
        for(let xyc of grid.positions[ypos]) {
            var x = xyc[0], y = parseInt(ypos), color = xyc[1];
            drawSquare(x, y, squareSize, color);
        }
    }
}
