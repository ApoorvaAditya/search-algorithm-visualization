const cellWidth = 50;
const spacingBtwCells = 20;
const spacingBtwCellAndIndex = 20;
const indexTextSize = 14;
const spacingForInputs = 50;
const spacingBtwTopAndInputs = 20;
const widthOfNumberInput = 30;
const spacingBtwInputs = 20;
const horizontalMargin = 16;
const verticalMargin = 20;
const customFramerate = 5;
var minRangeOfRandom = 0; // Inclusive
var maxRangeOfRandom = 10; // Inclusive
var lengthOfArray = 50;
var framesPerSecond = 10;
var arrayOfCells;
var arrayOfInputs;
var arrayOfInputData = [{
        text: "Search Algorithm: ",
        type: "dropdown"
    },
    {
        text: "Array Length: ",
        type: "number"
    },
    {
        text: "Value to search: ",
        type: "number"
    },
    {
        text: "Speed: ",
        type: "number"
    },
    {
        text: "Start",
        type: "button"
    },
    {
        text: "Pause",
        type: "button"
    },
    {
        text: "Randomize",
        type: "button"
    },
    {
        text: "Sort",
        type: "button"
    },
    {
        text: "Find Multiple: ",
        type: "checkbox"
    },
    {
        text: "Unique Values: ",
        type: "checkbox"
    }
];
var arrayOfSearchAlgos = ['Linear Search',
    'Binary Search',
    'Jump Search',
    'Interpolation Search',
    'Exponential Search',
    'Ubiquitous Binary Search'
]
var arrayOfDescriptions = [];
var isRunning = true;
var isPaused = false;

// the index linsearch is currently on
var currIndex = 0;

//----------------------------------------------------------------------------Classes--------------------------------------------------------------------------------

class Cell {
    constructor(number) {
        this.number = number;
        this.hasBeenVisited = false;
    }

    show(x, y, index) {
        if (this.isBeingSearched) {
            setFill("green");
            this.hasBeenVisited = true;
        } else if (this.isSearchValue) {
            setFill("red");
        } else if (this.isLowOrHigh) {
            setFill("blue");
        } else if (this.hasBeenVisited) {
            setFill("yellow")
        } else {
            setFill("white");
        }
        // draw the cell rectangle
        rect(x, y, cellWidth, cellWidth);
        setFill("black");

        textAlign(CENTER, CENTER);
        textSize(cellWidth / 2);
        // draw the number in the cell
        text(this.number, x + cellWidth / 2, y + cellWidth / 2);
        // draw the index below the cell
        textSize(indexTextSize);
        text(index, x + cellWidth / 2, y + cellWidth + spacingBtwCellAndIndex);
    }

    getNumber() {
        return this.number;
    }

    setIsBeingSearched(isBeingSearched) {
        this.isBeingSearched = isBeingSearched;
    }

    setIsSearchValue(isSearchValue) {
        this.isSearchValue = isSearchValue;
    }

    setIsLowOrHigh(isLowOrHigh) {
        this.isLowOrHigh = isLowOrHigh;
    }

    setHasBeenVisited(hasBeenVisited) {
        this.hasBeenVisited = hasBeenVisited;
    }
}

class TextNInput {
    constructor(text, type) {
        this.text = text;
        this.type = type;
    }

    create() {
        switch (this.type) {
            case "number":
                this.inputElement = createInput(1, this.type);
                break;
            case "dropdown":
                this.inputElement = createSelect();
                for (var i in arrayOfSearchAlgos)
                    this.inputElement.option(arrayOfSearchAlgos[i]);
                break;
            case "button":
                this.inputElement = createButton(this.text);
                break;
            case "checkbox":
                this.inputElement = createCheckbox('', false);
                break;
        }
        this.setWidth();
    }

    drawText(x, y) {
        if (this.type != "button") {
            textAlign(LEFT, CENTER);
            text(this.text, x, y + 3);
        }
    }

    getWidth() {
        if (this.type == "checkbox") return textWidth(this.text) + 40;
        else if (this.type == "button") return this.width;
        return textWidth(this.text) + this.width;
    }

    getValue() {
        if (this.type != "checkbox") return this.inputElement.value();
        else return this.inputElement.checked();
    }

    setWidth() {
        if (this.type == "number") {
            this.inputElement.size(widthOfNumberInput);
        }
        this.width = this.inputElement.size().width + spacingBtwInputs;
    }

    setValue(val) {
        this.inputElement.value(val);
    }

    setPosition(x, y) {
        this.inputElement.position(this.type != "button" ? textWidth(this.text) + x + spacingBtwInputs : x + spacingBtwInputs, y);
    }
}

//-----------------------------------------------------------------------------Setup and Draw--------------------------------------------------------------------------

// runs once before draw loop
function setup() {
    //create the canvas of the size of browser window + some margins
    createCanvas(window.innerWidth - horizontalMargin, window.innerHeight - verticalMargin);
    // create the inputs
    createInputs();
    // create the cells array
    createCells(getInput("Array Length: ").getValue());
    // sets framerate
    frameRate(60);
}

//runs every frame
function draw() {
    getInput('Array Length: ').inputElement.input(updateCells);
    setFill("white")

    //draws background rectangle
    rect(0, 0, width, height);
    //draws the text for the inputs
    drawInputs();

    getInput('Start').inputElement.mousePressed(startSearch);
    getInput('Pause').inputElement.mousePressed(pause);
    getInput('Sort').inputElement.mousePressed(sortCells);
    getInput('Randomize').inputElement.mousePressed(randomizeCells);

    if (frameCount % (60 / framesPerSecond) == 0) {
        if (!isPaused) {
            switch (getInput("Search Algorithm: ").getValue()) {
                case "Linear Search":
                    stepLinearSearch(lengthOfArray);
                    break;
                case "Binary Search":
                    binarySearch();
                    break;
                case "Jump Search":
                    JumpSearch();
                    break;
                case "Interpolation Search":
                    interpolationSearch();
                    break;
                case "Exopential Search":
                    exponentialSearch();
                    break;
            }
        }
    }
    showCells(lengthOfArray);
}

//-----------------------------------------------------------------------------Input Functions----------------------------------------------------------------------------

// creates the inputs for the constants
function createInputs() {
    arrayOfInputs = new Array();
    for (var obj in arrayOfInputData) {
        arrayOfInputs.push(new TextNInput(arrayOfInputData[obj].text, arrayOfInputData[obj].type));
    }

    var cursor = spacingBtwInputs / 2;
    for (var i = 0; i < arrayOfInputs.length; i++) {
        arrayOfInputs[i].create();
        cursor += arrayOfInputs[i].getWidth();
    }
    getInput("Array Length: ").setValue(50);
}

function drawInputs() {
    var cursor = spacingBtwInputs / 2;
    for (var i = 0; i < arrayOfInputs.length; i++) {
        setFill("black");
        arrayOfInputs[i].drawText(cursor, spacingBtwTopAndInputs);
        arrayOfInputs[i].setPosition(cursor, spacingBtwTopAndInputs);
        cursor += arrayOfInputs[i].getWidth();
    }
}

function getInput(text) {
    for (var i in arrayOfInputs) {
        if (arrayOfInputData[i].text == text) return arrayOfInputs[i];
    }
}

//-----------------------------------------------------------------------------Cell Functions--------------------------------------------------------------------------------

// create the cell array with the correct positions
function createCells(len) {
    if (len > 0) {
        // initialize cells
        arrayOfCells = new Array();

        for (var i = 0; i < len; i++) {
            // add the new cell to the cells array
            arrayOfCells.push(new Cell(int(random(minRangeOfRandom, maxRangeOfRandom + 1)), i));
        }
    }
}

function showCells(len) {
    if (len > 0) {
        // the maximum number of cells that can fit in the given canvas size
        maxNum = int((width - cellWidth) / (cellWidth + spacingBtwCells)) + 1;
        // whether len is bigger or smaller than the maxNum
        n = constrain(len, 0, maxNum);
        // Start position so that the cells are aligned to center (first row)
        startX = (width - n * cellWidth - (n - 1) * spacingBtwCells) / 2;

        for (var i = 0; i < len; i++) {
            // xpos of the cell
            x = startX + (i % maxNum) * (spacingBtwCells + cellWidth);
            // no. of row currently on
            j = int(i / maxNum);
            // ypos of the cell
            y = spacingForInputs + spacingBtwCells + j * (cellWidth + 2 * spacingBtwCellAndIndex);

            arrayOfCells[i].show(x, y, i);
        }
    }
}

function updateCells() {
    lengthOfArray = getInput('Array Length: ').getValue();
    createCells(lengthOfArray);
}

function resetCells() {
    for (var i in arrayOfCells) {
        arrayOfCells[i].setIsBeingSearched(false);
        arrayOfCells[i].setIsLowOrHigh(false);
        arrayOfCells[i].setIsSearchValue(false);
        arrayOfCells[i].setHasBeenVisited(false);
    }
}

function sortCells() {
    arrayOfCells.sort(function (cell1, cell2) {
        return cell1.number - cell2.number
    });
}

function randomizeCells() {
    for (let i = arrayOfCells.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arrayOfCells[i], arrayOfCells[j]] = [arrayOfCells[j], arrayOfCells[i]];
    }
}

//---------------------------------------------------------------------------Search Algorithms-----------------------------------------------------------------------------

var runLinSearch = false;

function initializeLinearSearch(start, len) {
    currIndex = start;
    linSearchLen = len;
    runLinSearch = true;
}

function stepLinearSearch(len) {
    if (runLinSearch && currIndex < len) {
        if (currIndex - 1 >= 0) {
            arrayOfCells[currIndex - 1].setIsBeingSearched(false);
        }
        // sets the cell to being currently searched
        arrayOfCells[currIndex].setIsBeingSearched(true);
        // if the cell contains the number to search, set its found to true
        if (arrayOfCells[currIndex].getNumber() == getInput("Value to search: ").getValue()) {
            arrayOfCells[currIndex].setIsSearchValue(true);
            if (currIndex == len - 1 || !getInput("Find Multiple: ").getValue()) {
                runLinSearch = false;
            }
        }
        // increment currIndex
        currIndex++;
        // make sure it doesn't exceed the array bounds
        currIndex = constrain(currIndex, 0, len);

        if (currIndex == len) {
            runLinSearch = false;
        }
    }
    else if (currIndex == len) {
        arrayOfCells[currIndex - 1].setIsBeingSearched(false);
    }
}

var low, mid, high;



function binarySearch() {
    if (flag) {
        low = 0;
        high = lengthOfArray - 1;
        flag = false;
    }
    if (low < high) {
        arrayOfCells[low].setIsLowOrHigh(false);
        arrayOfCells[high].setIsLowOrHigh(false);
        if (mid != undefined) arrayOfCells[mid].setIsBeingSearched(false);
        mid = int((low + high) / 2);
        arrayOfCells[low].setIsLowOrHigh(true);
        arrayOfCells[high].setIsLowOrHigh(true);
        arrayOfCells[mid].setIsBeingSearched(true);

        if (arrayOfCells[mid].getNumber() == getInput("Value to search: ").getValue()) {
            arrayOfCells[mid].setIsSearchValue(true);
        } else if (arrayOfCells[mid].getNumber() >= getInput("Value to search: ").getValue()) {
            high = mid - 1;
        } else if (arrayOfCells[mid].getNumber() <= getInput("Value to search: ").getValue()) {
            low = mid + 1;
        }
    }
}

//---------------------------------------------------------------------------Other Functions-----------------------------------------------------------------------------

// sets fill color depending on the color string

function startSearch() {
    resetCells();
    initializeLinearSearch(0, lengthOfArray);
}

function pause() {
    isPaused = isPaused ? false : true;
}

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
    resizeCanvas(window.innerWidth - horizontalMargin, window.innerHeight - verticalMargin);
    // recreate the cells array
    createCells(lengthOfArray);
};