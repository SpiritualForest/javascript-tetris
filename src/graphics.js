/* JavaScript tetris game.
 * File: graphics.js. 
 * This stuff handles all the drawing */

/* Get the canvas we're going to draw on, and set the square size according to its width.
 * A traditional tetris grid is composed of 22 rows (y) and 10 columns (x) */
var gridCanvas = document.getElementById("grid");
var statsCanvas = document.getElementById("stats");
var nextBlockCanvas = document.getElementById("nextblock");
var gridWidth = 10; // How many squares one row can contain
var gridHeight = gridCanvas.height; // Only required for collision detection - this is pixels
var squareSize = gridCanvas.width / gridWidth;
var bgColor = gridCanvas.style.backgroundColor;

function positionGridCanvas() {
    /* Positions the grid canvas */
    var y = (window.innerHeight / 2) - (gridHeight / 2);
    var x = (window.innerWidth / 2) - (gridCanvas.width + statsCanvas.width / 2) + statsCanvas.width + 6;
    /* Add the styles */
    gridCanvas.style.top = y + "px";
    gridCanvas.style.left = x + "px";
}

function positionNextBlockCanvas() {
    /* Yes, I know this is an UGLY function name */
    var ystr = gridCanvas.style.top;
    var xstr = gridCanvas.style.left;
    var y = parseInt(ystr.slice(0, ystr.length - 2)) - nextBlockCanvas.height - 4;
    var x = parseInt(xstr.slice(0, xstr.length - 2)) + (nextBlockCanvas.width / 2);
    nextBlockCanvas.style.top = y + "px";
    nextBlockCanvas.style.left = x + "px";
}

function positionCanvases() {
    /* Meta function that calls each canvas' positioning function */
    positionGridCanvas();
    positionNextBlockCanvas();
}

function drawNextBlock() {
    /* Get the center x position on the next block canvas */
    var blockObject = this.nextblock;
    /* Make a copy of the upcoming block's coordinates */
    var coordinates = this.convertCoordinatesMap(blockObject.coordinatesMap, nextBlockCanvas.width / squareSize, blockObject.width);
    var ctx = nextBlockCanvas.getContext("2d");
    ctx.clearRect(0, 0, nextBlockCanvas.width, nextBlockCanvas.height);
    ctx.fillStyle = blockObject.color;
    for(let xy of coordinates) {
        var x = xy[0], y = xy[1];
        if (blockObject.type === "I") {
            /* I block is special. */
            x += 10;
            y += 10;
        }
        ctx.fillRect(x+1, y+1, squareSize-1, squareSize-1);
    }
}

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

function drawBlock() {
    /* Draws a block on the grid */
    drawCoordinates(this.block.coordinates, this.block.color);
}

function deleteBlock() {
    /* Overwrites the squares specified by the block's coordinates with the canvas' background colour */
    drawCoordinates(this.block.coordinates, bgColor);
}

function redrawGrid() {
    /* Clears the grid and redraws all the squares */
    var context = gridCanvas.getContext("2d");
    var grid = this.grid;
    context.clearRect(0, 0, grid.width * squareSize, grid.height);
    /* Now loop on the grid's positions and redraw them one by one */
    for(let ypos of Object.keys(grid.positions)) {
        for(let xyc of grid.positions[ypos]) {
            var x = xyc[0], y = parseInt(ypos), color = xyc[1];
            drawSquare(x, y, squareSize, color);
        }
    }
}
