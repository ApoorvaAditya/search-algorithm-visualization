const cellWidth = 50;
const spacingBtwCells = 20;
const spacingBtwCellAndIndex = 20;
const indexTextSize = 14;
const spacingBtwTopAndInputs = 20;
const widthOfNumberInput = 30;
const spacingBtwInputs = 20;
const horizontalMargin = 16;
const verticalMargin = 20;
const customFramerate = 5;
const heightOfInputs = 30;
var spacingForInputs = 50;
var spacingForDesc;
var minRangeOfRandom = 0; // Inclusive
var maxRangeOfRandom = 10; // Inclusive
var lengthOfArray = 50;
var framesPerSecond = 10;
var valueToSearch;
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
        text: "Frames per second: ",
        type: "number"
    },
    {
        text: "Minimum random value: ",
        type: "number"
    },
    {
        text: "Maximum random value: ",
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
        text: "Find multiple: ",
        type: "checkbox"
    }/* ,
    {
        text: "Unique values: ",
        type: "checkbox"
    } */
];
var arrayOfSearchAlgos = ['Linear Search',
    'Binary Search',
    'Jump Search',
    'Interpolation Search',
    'Exponential Search',
    'Fibonacci Search'
]
var arrayOfDescriptions = [{
        text: "Linear Search",
        description: "Starts from leftmost element and compares each element of the array with the value to find. asdhgkha sdashdohoau we a dhuao da osd a s",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
    },
    {
        text: "Binary Search",
        description: "This is binary search",
        timeComplexity: "O(log(n))",
        spaceComplexity: "O()"
    },
    {
        text: "Jump Search",
        description: "",
        timeComplexity: "O()",
        spaceComplexity: "O()"
    },
    {
        text: "Interpolation Search",
        description: "",
        timeComplexity: "O()",
        spaceComplexity: "O()"
    },
    {
        text: "Exponential Search",
        description: "",
        timeComplexity: "O()",
        spaceComplexity: "O()"
    },
    {
        text: "Fibonacci Search",
        description: "",
        timeComplexity: "O()",
        spaceComplexity: "O()"
    },
];
var isRunning = true;
var isPaused = true;

// the index linsearch is currently on

//----------------------------------------------------------------------------Classes--------------------------------------------------------------------------------

class Cell {
    constructor(number) {
        this.number = number;
        this.hasBeenVisited = false;
    }

    show(x, y, index) {
        if (this.isBeingSearched) {
            setFill("orange");
            this.hasBeenVisited = true;
        } else if (this.isSearchValue) {
            setFill("green");
        } else if (this.hasBeenVisited) {
            setFill("grey")
        } else if (this.isLowOrHigh) {
            setFill("light blue");
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
    getInput('Frames per second: ').setValue(10);
    getInput('Minimum random value: ').setValue(0);
    getInput('Maximum random value: ').setValue(10);
    print(textHeight(arrayOfDescriptions[0].description, width));

    // sets framerate
    frameRate(60);
}

//runs every frame
function draw() {
    getInput('Array Length: ').inputElement.input(updateCells);
    minRangeOfRandom = getInput('Minimum random value: ').getValue();
    maxRangeOfRandom = getInput('Maximum random value: ').getValue();
    getInput('Minimum random value: ').inputElement.input(recreateCells);
    getInput('Maximum random value: ').inputElement.input(recreateCells);
    framesPerSecond = getInput('Frames per second: ').getValue();
    valueToSearch = getInput('Value to search: ').getValue();
    getInput('Search Algorithm: ').inputElement.input(drawDescription);
    setFill("white")

    //draws background rectangle
    rect(0, 0, width, height);
    //draws the text for the inputs
    drawInputs();
    drawDescription();
    /* unique = getInput('Unique values: ').inputElement.input(setUnique);
    if (unique) {
        if (getInput('Unique values: ').getValue()) {
            lengthOfArray = maxRangeOfRandom - minRangeOfRandom;
            for (var i = 0; i < lengthOfArray; i++) {
                arrayOfCells[i] = i + minRangeOfRandom;
            }
            randomizeCells();
            unique = false
        }
    } */
    getInput('Start').inputElement.mousePressed(startSearch);
    getInput('Pause').inputElement.mousePressed(pause);
    getInput('Sort').inputElement.mousePressed(sortCells);
    getInput('Randomize').inputElement.mousePressed(randomizeCells);

    if (frameCount % (60 / framesPerSecond) == 0) {
        if (!isPaused && isRunning) {
            switch (getInput("Search Algorithm: ").getValue()) {
                case "Linear Search":
                    stepLinearSearch();
                    break;
                case "Binary Search":
                    stepBinarySearch();
                    break;
                case "Jump Search":
                    stepJumpSearch();
                    break;
                case "Interpolation Search":
                    stepInterpolationSearch();
                    break;
                case "Exponential Search":
                    stepExponentialSearch();
                    break;
                case "Fibonacci Search":
                    stepFibonacciSearch();
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
    var y = spacingBtwTopAndInputs;
    setFill("black");
    for (var i in arrayOfInputs) {
        if (cursor + arrayOfInputs[i].getWidth() > width) {
            cursor = spacingBtwInputs / 2;
            y += heightOfInputs;
        }
        arrayOfInputs[i].drawText(cursor, y);
        arrayOfInputs[i].setPosition(cursor, y);
        cursor += arrayOfInputs[i].getWidth();
    }
    spacingForInputs = y + heightOfInputs;
}

function getInput(text) {
    for (var i in arrayOfInputs) {
        if (arrayOfInputData[i].text == text) return arrayOfInputs[i];
    }
}

//-----------------------------------------------------------------------------Cell Functions--------------------------------------------------------------------------------

// create the cell array with the correct positions
function createCells(len) {
    if (minRangeOfRandom != undefined && maxRangeOfRandom != undefined) {
        if (len > 0) {
            // initialize cells
            arrayOfCells = new Array();

            for (var i = 0; i < len; i++) {
                // add the new cell to the cells array
                number = Math.floor(Math.random() * (+maxRangeOfRandom - +minRangeOfRandom)) + +minRangeOfRandom + 1;
                arrayOfCells.push(new Cell(number, i));
            }
        }
    }
}

function recreateCells() {
    createCells(lengthOfArray);
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
            y = spacingForInputs + spacingForDesc + spacingBtwCells + j * (cellWidth + 2 * spacingBtwCellAndIndex);

            arrayOfCells[i].show(x, y, i);
        }
    }
    maxNum = int((width - cellWidth) / (cellWidth + spacingBtwCells)) + 1;
    maxHeight = spacingForInputs + spacingForDesc + spacingBtwCells + (int(len / maxNum) + 1) * (cellWidth + 2 * spacingBtwCellAndIndex);
    if (maxHeight > height) {
        resizeCanvas(width, maxHeight);
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

var linSearchCurrIndex, linSearchLen, runLinSearch = false,
    linSearchStart;

function initializeLinearSearch(start, len) {
    linSearchCurrIndex = start;
    linSearchLen = len;
    linSearchStart = start;
    runLinSearch = true;
}

function stepLinearSearch() {
    if (runLinSearch && linSearchCurrIndex <= linSearchLen + linSearchStart) {
        if (linSearchCurrIndex - 1 >= 0) {
            arrayOfCells[linSearchCurrIndex - 1].setIsBeingSearched(false);
        }
        // sets the cell to being currently searched
        arrayOfCells[linSearchCurrIndex].setIsBeingSearched(true);
        // if the cell contains the number to search, set its found to true
        if (arrayOfCells[linSearchCurrIndex].getNumber() == valueToSearch) {
            arrayOfCells[linSearchCurrIndex].setIsSearchValue(true);
            if (linSearchCurrIndex == linSearchLen - 1 || !getInput("Find multiple: ").getValue()) {
                runLinSearch = false;
                arrayOfCells[linSearchCurrIndex].setIsBeingSearched(false);
            }
        }
        // increment linSearchCurrIndex
        linSearchCurrIndex++;
        // make sure it doesn't exceed the array bounds (this is prob unnecessary and therefore linSearchStart too)
        //linSearchCurrIndex = constrain(linSearchCurrIndex, linSearchStart, linSearchLen + linSearchStart);

        if (linSearchCurrIndex == linSearchLen + linSearchStart) {
            runLinSearch = false;
        }
    } else if (linSearchCurrIndex == linSearchLen + linSearchStart) {
        arrayOfCells[linSearchCurrIndex - 1].setIsBeingSearched(false);
    }
}

var binarySearchLow, mid, binarySearchHigh, runBinarySearch = false,
    prevbinarySearchLow, prevbinarySearchHigh;

function initializeBinarySearch(start, len) {
    sortCells();
    binarySearchLow = start;
    binarySearchHigh = start + len - 1;
    runBinarySearch = true;
}

function stepBinarySearch() {
    if (runBinarySearch && binarySearchLow < binarySearchHigh) {
        if (prevbinarySearchHigh != undefined && prevbinarySearchLow != undefined) {
            arrayOfCells[prevbinarySearchLow].setIsLowOrHigh(false);
            arrayOfCells[prevbinarySearchHigh].setIsLowOrHigh(false);
        }
        if (mid != undefined) arrayOfCells[mid].setIsBeingSearched(false);
        mid = int((binarySearchLow + binarySearchHigh) / 2);
        arrayOfCells[binarySearchLow].setIsLowOrHigh(true);
        arrayOfCells[binarySearchHigh].setIsLowOrHigh(true);
        arrayOfCells[mid].setIsBeingSearched(true);
        prevbinarySearchLow = binarySearchLow;
        prevbinarySearchHigh = binarySearchHigh;
        if (arrayOfCells[mid].getNumber() == valueToSearch) {
            arrayOfCells[mid].setIsSearchValue(true);
            if (binarySearchLow >= binarySearchHigh || !getInput("Find multiple: ").getValue()) {
                runBinarySearch = false;
                arrayOfCells[mid].setIsBeingSearched(false);
            }
            /* else if (getInput("Find multiple: ").getValue()) {

            } */
        } else if (arrayOfCells[mid].getNumber() >= valueToSearch) {
            binarySearchHigh = mid - 1;
        } else if (arrayOfCells[mid].getNumber() <= valueToSearch) {
            binarySearchLow = mid + 1;
        }
    }
}

var runJumpSearch = false,
    jumpSearchLen, jumpSearchStep, step, jumpSearchCurrIndex, prevIndex;

function initializeJumpSearch(start, len) {
    sortCells();
    runJumpSearch = true;
    jumpSearchStart = start;
    jumpSearchCurrIndex = start;
    jumpSearchLen = len;
    step = int(Math.sqrt(jumpSearchLen));
}

function stepJumpSearch() {
    if (runJumpSearch && jumpSearchCurrIndex < jumpSearchLen) {
        if (jumpSearchCurrIndex - 2 * step >= jumpSearchStart) {
            arrayOfCells[jumpSearchCurrIndex - 2 * step].setIsLowOrHigh(false);
        }
        arrayOfCells[jumpSearchCurrIndex].setIsLowOrHigh(true);

        if (arrayOfCells[jumpSearchCurrIndex].getNumber() < valueToSearch) {
            jumpSearchCurrIndex += step;
        } else {
            initializeLinearSearch(jumpSearchCurrIndex - step, jumpSearchLen);
            runJumpSearch = false;
        }
    } else {
        if (arrayOfCells[linSearchCurrIndex].getNumber() <= valueToSearch) {
            stepLinearSearch();
        } else {
            arrayOfCells[linSearchCurrIndex - 1].setIsBeingSearched(false);
            arrayOfCells[linSearchCurrIndex - 1].setIsSearchValue(true);
        }
    }
}

var runInterpolationSearch = false,
    prevInterpolationSearchHigh, prevInterpolationSearchLow,
    interpolationSearchLen, interpolationSearchStart, interpolationSearchLow, interpolationSearchHigh, pos;

function initializeInterpolationSearch(start, len) {
    sortCells();
    runInterpolationSearch = true;
    interpolationSearchStart = start;
    interpolationSearchLen = len;
    interpolationSearchLow = start;
    interpolationSearchHigh = start + len - 1;
}

function stepInterpolationSearch() {
    if (runInterpolationSearch) {
        if (prevInterpolationSearchHigh != undefined) {
            arrayOfCells[prevInterpolationSearchHigh].setIsLowOrHigh(false);
        }
        if (prevInterpolationSearchLow != undefined) {
            arrayOfCells[prevInterpolationSearchLow].setIsLowOrHigh(false);
        }
        if (pos != undefined) {
            arrayOfCells[pos].setIsBeingSearched(false);
        }

        if (arrayOfCells[interpolationSearchHigh].getNumber() != arrayOfCells[interpolationSearchLow].getNumber()) {
            pos = int(interpolationSearchLow + ((valueToSearch - arrayOfCells[interpolationSearchLow].getNumber()) * (interpolationSearchHigh - interpolationSearchLow) / (arrayOfCells[interpolationSearchHigh].getNumber() - arrayOfCells[interpolationSearchLow].getNumber())))
            arrayOfCells[pos].setIsBeingSearched(true);
            arrayOfCells[interpolationSearchHigh].setIsLowOrHigh(true);
            arrayOfCells[interpolationSearchLow].setIsLowOrHigh(true);
            prevInterpolationSearchHigh = interpolationSearchHigh;
            prevInterpolationSearchLow = interpolationSearchLow;
            if (arrayOfCells[pos].getNumber() == valueToSearch) {
                arrayOfCells[pos].setIsSearchValue(true);
                arrayOfCells[pos].setIsBeingSearched(false);
                if (getInput("Find multiple: ").getValue()) {
                    //change
                    runInterpolationSearch = false;
                } else {
                    runInterpolationSearch = false;
                }
            } else if (arrayOfCells[pos].getNumber() > valueToSearch) {
                interpolationSearchHigh = pos - 1;
            } else if (arrayOfCells[pos].getNumber() < valueToSearch) {
                interpolationSearchLow = pos + 1;
            }
        }
    }
}

var exponentialSearchLen, exponentialSearchStart, exponentialSearchHigh, exponentialSearchLow, runExponentialSearch = false,
    prevExponentialSearchHigh, prevExponentialSearchLow;

function initializeExponentialSearch(start, len) {
    sortCells();
    runExponentialSearch = true;
    exponentialSearchStart = start;
    exponentialSearchLen = len;
    exponentialSearchLow = start;
    exponentialSearchHigh = start + 1;
}

function stepExponentialSearch() {
    if (runExponentialSearch) {
        print("high: ", exponentialSearchHigh, " | low: ", exponentialSearchLow);
        if (prevExponentialSearchHigh != undefined) {
            arrayOfCells[prevExponentialSearchHigh].setIsLowOrHigh(false);
        }
        if (prevExponentialSearchLow != undefined) {
            arrayOfCells[prevExponentialSearchLow].setIsLowOrHigh(false);
        }
        arrayOfCells[exponentialSearchHigh].setIsLowOrHigh(true);
        arrayOfCells[exponentialSearchLow].setIsLowOrHigh(true);
        prevExponentialSearchHigh = exponentialSearchHigh;
        prevExponentialSearchLow = exponentialSearchLow;
        if (arrayOfCells[exponentialSearchHigh].getNumber() < valueToSearch) {
            exponentialSearchLow = exponentialSearchHigh;
            if (2 * exponentialSearchHigh - exponentialSearchStart < exponentialSearchStart + exponentialSearchLen) {
                exponentialSearchHigh = 2 * exponentialSearchHigh - exponentialSearchStart;
            } else {
                exponentialSearchHigh = exponentialSearchStart + exponentialSearchLen - 1;
            }
        } else {
            initializeBinarySearch(exponentialSearchLow, exponentialSearchHigh - exponentialSearchLow);
            runExponentialSearch = false;
        }
    } else {
        stepBinarySearch();
    }
}

var runFibonacciSearch = false, fibonacciSearchStart, fibonacciSearchLen, fibM = 0, fibMMm1 = 1, fibMMm2 = 0, offset = 0, i;

function initializeFibonacciSearch(start, len) {
    sortCells();
    runFibonacciSearch = true;
    fibonacciSearchStart = start;
    fibonacciSearchLen = len;
    while (fibM < fibonacciSearchLen) {
        fibMMm2 = fibMMm1;
        fibMMm1 = fibM;
        fibM = fibMMm1 + fibMMm2;
    }
}

function stepFibonacciSearch() {
    if (runFibonacciSearch) {
        print(fibM);
        if (fibM > 1) {
            if (i != undefined) {
                arrayOfCells[i].setIsBeingSearched(false);
            }
            i = Math.min(offset + fibMMm2, fibonacciSearchLen - 1);
            arrayOfCells[i].setIsBeingSearched(true);
            if (arrayOfCells[i].getNumber() < valueToSearch) {
                fibM = fibMMm1;
                fibMMm1 = fibMMm2
                fibMMm2 = fibM - fibMMm1;
                offset = i;
            }
            else if (arrayOfCells[i].getNumber() > valueToSearch) {
                fibM = fibMMm2;
                fibMMm1 = fibMMm1 - fibMMm2;
                fibMMm2 = fibM - fibMMm1;
            }
            else {
                arrayOfCells[i].setIsSearchValue(true);
                arrayOfCells[i].setIsBeingSearched(false);
                runFibonacciSearch = false;
            }
        }
    }
}

//---------------------------------------------------------------------------Other Functions-----------------------------------------------------------------------------

// sets fill color depending on the color string

function startSearch() {
    resetCells();
    isPaused = false;
    switch (getInput("Search Algorithm: ").getValue()) {
        case "Linear Search":
            initializeLinearSearch(0, lengthOfArray);
            break;
        case "Binary Search":
            initializeBinarySearch(0, lengthOfArray);
            break;
        case "Jump Search":
            initializeJumpSearch(0, lengthOfArray);
            break;
        case "Interpolation Search":
            initializeInterpolationSearch(0, lengthOfArray);
            break;
        case "Exponential Search":
            initializeExponentialSearch(0, lengthOfArray);
            break;
        case "Fibonacci Search":
            initializeFibonacciSearch(0, lengthOfArray);
    }

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
        case "orange":
            fill(255, 165, 0);
            break;
        case "grey":
            fill(220, 220, 220);
            break;
        case "light blue":
            fill(0, 191, 255);
            break;
    }
}


function drawDescription() {
    for (var i in arrayOfDescriptions) {
        if (arrayOfDescriptions[i].text == getInput('Search Algorithm: ').getValue()) {
            var desc = "Description: " + arrayOfDescriptions[i].description;
            spacingForDesc = textHeight(desc, width);
            textAlign(LEFT, TOP);
            text(desc, spacingBtwInputs / 2, spacingForInputs, width - horizontalMargin, spacingForDesc);
            break;
        }
    }
}

var fibonacciNumbers = [0, 1];

function fibonacciNumber(n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    if (fibonacciNumbers[n] != undefined) return fibonacciNumbers[n];
    else {
        fibonacciNumbers.push(fibonacciNumber(n - 1) + fibonacciNumber(n - 2))
        return fibonacciNumbers[n];
    }
}

function textHeight(text, maxWidth) {
    var words = text.split(' ');
    var line = '';
    var h = textLeading();
    var testLine = line;
    for (var i = 0; i < words.length; i++) {
        testLine += words[i] + ' ';
        var testLineWidth = textWidth(testLine);
        print(testLine, maxWidth, testLineWidth);
        if (testLineWidth > maxWidth && i > 0) {
            testLine = words[i] + ' ';
            h += textAscent() + textDescent();
        }
    }
    return h + textLeading();
}

// resizes cavas on window resize
window.onresize = function () {
    resizeCanvas(window.innerWidth - horizontalMargin, window.innerHeight - verticalMargin);
};