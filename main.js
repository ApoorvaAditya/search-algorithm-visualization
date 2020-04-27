// The length of the array
var arrLen = 50;
// Array of cells
var cells;
//width of a cell
const w = 50;
// space between each cell
const spacing = 20;
// space between bottom of cell and center of text containing the index
const indexOffset = 20;
// size of the text containing index
const indexSize = 14;
// space for all the inputs above the array
const topOffset = 50;
// top spacing for the inputs
const inputOffset = 20;
// width of number input field
const inputWidth = 30;

const inputSpacing = 20;

var inputArray;
// the index linsearch is currently on
var currIndex = 0;
// input components
var toSearch, method, setFramerate, findMultiple, sort, running = true;
var searchSpeed = 10;

class Cell {
    constructor(x, y, num, index) {
        // xpos of the cell
        this.x = x;
        // ypos of the cell
        this.y = y;
        // the value of the cell
        this.num = num;
        // index of the cell
        this.index = index;
        // whether the cell has been visited
        this.visited = false;
    }

    // sets whether it is being searched
    setSearching(searching) {
        this.searching = searching;
    }

    // returns the value of the num
    getNum() {
        return this.num;
    }

    // displays the cell
    show() {
        // if the cell is being searched
        if (this.searching == true) {
            setFill("green");
            this.visited = true;
        }
        // if the cell contain the value to find
        else if (this.found == true) {
            setFill("red");
        }
        // if cell has been visited
        else if (this.visited == true) {
            setFill("yellow")

        }
        // if cell has not been processed
        else {
            setFill("white");
        }
        // draw the cell rectangle
        rect(this.x, this.y, w, w);
        setFill("black");
        // text properties
        textAlign(CENTER, CENTER);
        textSize(w / 2);
        // draw the number in the cell
        text(this.num, this.x + w / 2, this.y + w / 2);
        // draw the index below the cell
        textSize(indexSize);
        text(this.index, this.x + w / 2, this.y + w + indexOffset);
    }
    // sets if the element has been found
    setFound(found) {
        this.found = found;
    }

}

class TextNInput {
    constructor(text, type) {
        this.text = text;
        this.type = type;
        this.setWidth();
    }

    create() {
        switch (this.type) {
            case "number":
                this.inp = createInput(1, this.type);
                break;
            case "dropdown":
                this.inp = createSelect();
                break;
            case "button":
                this.inp = createButton(this.text);
                break;
            case "checkbox":
                this.inp = createCheckbox(this.text, false);
                break;
        }
    }

    setPosition(x, y) {
        this.inp.position(textWidth(this.text) + x + inputSpacing, y);
    }

    getWidth() {
        return textWidth(this.text) + this.width;
    }

    setWidth() {
        this.width = this.inp.size()[0] + inputSpacing;
    }

}


// runs once before draw loop
function setup() {
    //create the canvas of the size of browser window + some margins
    createCanvas(window.innerWidth - 16, window.innerHeight - 20);
    // create the inputs
    createInputs();
    // create the cells array
    createCells(arrLen);
    // sets framerate
    frameRate(5);
}

//runs every frame
function draw() {
    //sets fill color to white
    fill(255);
    //draws background rectangle
    rect(0, 0, width, height);
    //draws the text for the inputs
    //drawInputText();

    if (frameCount % searchSpeed == 0) {
        running = true;
    }
    else {
        running = false;
    }

    if (running) {
        // sets the cell to being currently searched
        cells[currIndex].setSearching(true);
        // draws every cell
        for (var i = 0; i < arrLen; i++) {
            cells[i].show();
        }
        // sets cell to not being searched
        cells[currIndex].setSearching(false);
        // if the cell contains the number to search, set its found to true
        if (cells[currIndex].getNum() == toSearch.value()) {
            cells[currIndex].setFound(true);
        }
        // increment currIndex
        currIndex++;
        // make sure it doesn't exceed the array bounds
        currIndex = constrain(currIndex, 0, arrLen - 1);
    } else {
        for (var i = 0; i < arrLen; i++) {
            cells[i].show();
        }
    }
}


// create the cell array with the correct positions
function createCells(len) {
    // initialize cells
    cells = new Array();
    // the maximum number of cells that can fit in the given canvas size
    maxNum = int((width - w) / (w + spacing)) + 1;
    // whether len is bigger or smaller than the maxNum
    n = constrain(len, 0, maxNum);
    // Start position so that the cells are aligned to center (first row)
    startX = (width - n * w - (n - 1) * spacing) / 2;

    for (var i = 0; i < len; i++) {
        // xpos of the cell
        x = startX + (i % maxNum) * (spacing + w);
        // no. of row currently on
        j = int(i / maxNum);
        // ypos of the cell
        y = topOffset + spacing + j * (w + 2 * indexOffset);
        // add the new cell to the cells array
        cells.push(new Cell(x, y, int(random(0, 10)), i));
    }
}

// creates the inputs for the constants
function createInputs() {
    inputArray = new Array();
    inputArray.push(new TextNInput("Value to search: ", "number"));
    inputArray.push(new TextNInput("Search Algorithm: ", "dropdown"));
    inputArray.push(new TextNInput("Speed: ", "number"));
    inputArray.push(new TextNInput("Search Multiple: ", "checkbox"));
    inputArray.push(new TextNInput("Start", "button"));
    inputArray.push(new TextNInput("Sort", "button"));
    var cursor = inputSpacing / 2;
    for (var e in inputArray) {
        e.create();
        e.setPosition(cursor, inputOffset);
        cursor += e.getWidth();
    }

    /* // creates the input field for the no. to search for
    toSearch = createInput(7, "number");
    // positions the input field
    toSearch.position(textWidth("Value to search:") + 45, inputOffset);
    // set width of the input field
    toSearch.size(inputWidth);
    // creates the input field to set the
    setFramerate = createInput(1, "number")
    // positions the input field
    setFramerate.position(textWidth("Framerate:") + textWidth("Value to search:") + 100, inputOffset);
    // set the width of the input field
    setFramerate.size(inputWidth);
    // creates the dropdown for the search algorithm to use
    method = createSelect();
    // positions the dropdown
    method.position(500, inputOffset);
    // add the methods
    method.option("Linear Search");
    method.option("Binary Search"); */
}

function drawInputs() {
    for (var e in inputArray) {
        e.draw();
    }
}

/* function drawInputText() {
    setFill("black");
    // align text to center
    textAlign(LEFT, CENTER);
    textX = 20;
    var textArr = [];
    var inputTypes =
    for (vae i = 0; i < textArr.length; i++){

        textX += textWidth(textArr[i]);

    }
    // text for the no. to search for
    text("Value to search:", textX, inputOffset + 3);

    textX += textWidth("Value to search:");
    textX += inputWidth + 10;
    // text for the framerate input
    text("Framerate:", textX, inputOffset + 3);

    textX += textWidth("Framerate:");
    textX += inputWidth + 20;
    // text for search algorithm select
    text("Search Algorithm: ", textX, inputOffset + 3);
} */

// sets fill color depending on the color string
function setFill(color) {
    switch (color) {
        case "yellow":
            fill(255, 255, 0);
            break;
        case "blue":
            fill(0, 0, 255);
            break;
        case "red":
            fill(255, 0, 0);
            break;
        case "green":
            fill(0, 255, 0);
            break;
        case "white":
            fill(255);
            break;
        case "black":
            fill(0);
            break;
    }
}

// resizes cavas on window resize
window.onresize = function () {
    resizeCanvas(window.innerWidth - 15, window.innerHeight - 20);
    // recreate the cells array
    createCells(arrLen);
};