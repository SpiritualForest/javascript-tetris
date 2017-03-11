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
    var x = parseInt(xstr.slice(0, xstr.length - 2)) + (nextBlockCanvas.width / 2) - 3;
    nextBlockCanvas.style.top = y + "px";
    nextBlockCanvas.style.left = x + "px";
}

function positionStatsCanvas() {
    var ystr = gridCanvas.style.top;
    var xstr = gridCanvas.style.left;
    var y = parseInt(ystr.slice(0, ystr.length - 2));
    var x = parseInt(xstr.slice(0, xstr.length - 2)) - statsCanvas.width - 4;
    statsCanvas.style.top = y + "px";
    statsCanvas.style.left = x + "px";
    /* Now let's also draw lines to divide between the stats borders.
     * There are 3 types of stats, so we need two border lines. */
    var yposition = statsCanvas.height / 3;
    var ctx = statsCanvas.getContext("2d");
    ctx.strokeStyle = "black";
    for(var i = 0; i < 2; i++) {
        ctx.moveTo(0, yposition);
        ctx.lineTo(statsCanvas.width, yposition);
        ctx.stroke();
        yposition += yposition;
    }
}

function positionCanvases() {
    /* Meta function that calls each canvas' positioning function */
    positionGridCanvas();
    positionNextBlockCanvas();
    positionStatsCanvas();
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
            /* I block needs to be pushed rightwards and downwards by 10 pixels */
            x += 10;
            y += 10;
        }
        else if (blockObject.type === "O") {
            /* The O block also needs to be pushed to the right by 10 pixels */
            x += 10;
        }
        ctx.fillRect(x+1, y+1, squareSize-1, squareSize-1);
    }
}

function drawTextOnGrid(string, fontSize = 30) {
    /* Draws the given string in the center of the grid canvas.
     * Default font size is 30 pixels. */
    var ctx = gridCanvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.font = fontSize + "px Sans Serif";
    ctx.fillText(string, (gridCanvas.width / 2) - (string.length * (fontSize / 3.5)), gridCanvas.height / 2);
}

function drawStats() {
    /* Draws the score, lines completed, and current level on the stats canvas.
     * FIXME: this function is FUCKING UGLY AS FUCKING FUCK!!! REFACTOR IT ASAP!!! */

    /* First of all we clear the entire canvas */
    var ctx = statsCanvas.getContext("2d");
    ctx.clearRect(0, 0, statsCanvas.width, statsCanvas.height);
    /* Now we draw borders on the canvas, because there are 3 types of stats */
    var yposition = statsCanvas.height / 3;
    var fontSize = 12;
    ctx.strokeStyle = "black"; 
    for(var i = 0; i < 2; i++) {
        ctx.moveTo(0, yposition);
        ctx.lineTo(statsCanvas.width, yposition);
        ctx.stroke();
        yposition += yposition;
    }
    yposition = statsCanvas.height / 3;
    ctx.font = fontSize + "px Sans Serif";
    /* fillText draws from the bottom upwards, rather than from the top downwards */
    /* Draw the stats */
    ctx.fillStyle = "white";
    ctx.fillText("Lines: " + this.lines, 1, fontSize + 2);
    ctx.fillText("Score: " + this.score, 1, yposition + fontSize + 2);
    ctx.fillText("Level: " + this.level, 1, (yposition * 2) + (fontSize + 2));
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
    this.clearGrid();
    var grid = this.grid;
    /* Now loop on the grid's positions and redraw them one by one */
    for(let ypos of Object.keys(grid.positions)) {
        for(let xyc of grid.positions[ypos]) {
            var x = xyc[0], y = parseInt(ypos), color = xyc[1];
            drawSquare(x, y, squareSize, color);
        }
    }
}

function clearGrid() {
    /* All this does is call clearRect() on the grid canvas */
    var ctx = gridCanvas.getContext("2d");
    ctx.clearRect(0, 0, this.grid.width * squareSize, this.grid.height);
}
