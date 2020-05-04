const cellWidth = 50;
const spacingBtwCells = 20;
const spacingBtwCellAndIndex = 20;
const indexTextSize = 14;
const widthOfNumberInput = 30;
const spacingBtwInputs = 20;
const horizontalMargin = 16;
const verticalMargin = 20;
const customFramerate = 5;
const heightOfInputs = 30;
const lineHeight = 20;
const spaceForBottomLink = 20;
var descFile;
var spacingBtwTopAndInputs = 20;
var topOfCanvas;
var currentIndex = 0;
var comparisonCount = 0;
var spacingForInputs = 50;
var spacingForDesc;
var spacingForInfo;
var minRangeOfRandom = 0; // Inclusive
var maxRangeOfRandom = 10; // Inclusive
var lengthOfArray = 50;
var framesPerSecond = 10;
var valueToSearch;
var currentSearchAlgorithm;
var arrayOfFoundIndex;
var arrayOfCells;
var arrayOfInputs;
var arrayOfInputData = [{
        text: "Search Algorithm: ",
        type: "dropdown"
    },
    {
        text: "Array length: ",
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
        text: "Shuffle",
        type: "button"
    },
    {
        text: "Sort",
        type: "button"
    },
    {
        text: "Unique values",
        type: "button"
    },
    {
        text: "Find multiple: ",
        type: "checkbox"
    }
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
        description: `Linear search, also known as sequential search, is a process that checks every element in the list sequentially until the desired element is found.`,
        timeComplexity: "O(n)"
    },
    {
        text: "Binary Search",
        description: `Binary search is a fast search algorithm which works on the principle of divide and conquer. For this algorithm to work properly, the data collection should be in the sorted form. Binary search looks for a particular item by comparing the middle most item of the collection. If a match occurs, then the index of item is returned. If the middle item is greater than the item, then the item is searched in the sub-array to the left of the middle item. Otherwise, the item is searched for in the sub-array to the right of the middle item. This process continues on the sub-array as well until the size of the subarray reduces to zero.`,
        timeComplexity: "O(log(n))"
    },
    {
        text: "Jump Search",
        description: `Jump Search is a searching algorithm for sorted arrays. The basic idea is to check fewer elements (than linear search) by jumping ahead by fixed steps or skipping some elements in place of searching all elements. For example, suppose we have an array arr[] of size n and block (to be jumped) size m. Then we search at the indexes arr[0], arr[m], arr[2m]…..arr[km] and so on. Once we find the interval (arr[km] < x < arr[(k+1)m]), we perform a linear search operation from the index km to find the element x. The optimal block size to be skipped is square root of n.`,
        timeComplexity: "O(√n)"
    },
    {
        text: "Interpolation Search",
        description: `The Interpolation Search is an improvement over Binary Search for instances, where the values in a sorted array are uniformly distributed. Binary Search always goes to the middle element to check. On the other hand, interpolation search may go to different locations according to the value of the key being searched. For example, if the value of the key is closer to the last element, interpolation search is likely to start search toward the end side. 
To find the position to be searched, it uses following formula:
        pos = lo + [ ( x - arr[lo] ) * ( hi - lo ) / ( arr[hi] - arr[lo] ) ]
where,
arr[] : Array where elements need to be searched
x  : Element to be searched
lo : Starting index in arr[]
hi : Ending index in arr[]`,
        timeComplexity: "O(log(log(n))) to O(n)"
    },
    {
        text: "Exponential Search",
        description: `The idea is to start with subarray size 1, compare its last element with x, then try size 2, then 4 and so on until last element of a subarray is not greater. Once we find an index i (after repeated doubling of i), we know that the element must be present between i/2 and i because we could not find a greater value in previous iteration.`,
        timeComplexity: "O(log(n))"
    },
    {
        text: "Fibonacci Search",
        description: `Let the element to find be x. The idea is to first find the smallest Fibonacci number that is greater than or equal to the length of given array. Let the found Fibonacci number be fib (m’th Fibonacci number). We use (m-2)’th Fibonacci number as the index (If it is a valid index). Let (m-2)’th Fibonacci Number be i, we compare arr[i] with x, if x is same, we return i. Else if x is greater, we recur for subarray after i, else we recur for subarray before i.`,
        timeComplexity: "O(log(n))"
    },
];
var isRunning = true;
var isPaused = true;
var footerDiv;

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
        if (this.type != "checkbox") {
            this.inputElement.value(val);
        } else {
            this.inputElement.checked(val);
        }
    }

    setText(text) {
        this.text = text;
    }

    setPosition(x, y) {
        this.inputElement.position(this.type != "button" ? textWidth(this.text) + x + spacingBtwInputs : x + spacingBtwInputs, y);
    }
}

//-----------------------------------------------------------------------------Setup and Draw--------------------------------------------------------------------------

// runs once before draw loop
function setup() {
    //create the canvas of the size of browser window + some margins
    var canvas = createCanvas(window.innerWidth - horizontalMargin, window.innerHeight - verticalMargin - spaceForBottomLink);
    topOfCanvas = canvas.position().y + 20;
    resizeCanvas(window.innerWidth - horizontalMargin, window.innerHeight - verticalMargin - topOfCanvas);
    // create the inputs
    createInputs();
    // create the cells array
    createCells(getInput("Array length: ").getValue());
    getInput('Frames per second: ').setValue(2);
    getInput('Minimum random value: ').setValue(0);
    getInput('Maximum random value: ').setValue(10);
    getInput('Array length: ').inputElement.input(updateCells);
    getInput('Minimum random value: ').inputElement.input(recreateCells);
    getInput('Maximum random value: ').inputElement.input(recreateCells);
    getInput('Search Algorithm: ').inputElement.input(drawDescription);
    getInput('Start').inputElement.mousePressed(startSearch);
    getInput('Pause').inputElement.mousePressed(pause);
    getInput('Sort').inputElement.mousePressed(sortCells);
    getInput('Shuffle').inputElement.mousePressed(shuffleCells);
    getInput('Frames per second: ').inputElement.input(setFramesPerSecond);
    getInput('Search Algorithm: ').inputElement.input(setSearchAlgo);
    getInput('Unique values').inputElement.mousePressed(setUnique);
    getInput('Value to search: ').inputElement.input(setValueToSearch);
    setSearchAlgo();
    setValueToSearch();
    footerDiv = createDiv("").size(width);
    footerDiv.child(createA("https://github.com/ApoorvaAditya/search-visualizer", "Source code available on GitHub", "_blank"));
    var span = createSpan("")
    span.style('margin-left', '50px');
    footerDiv.child(span);
    footerDiv.child(createA("https://www.geeksforgeeks.org/searching-algorithms/", "More info at GeeksForGeeks", "_blank"));
    footerDiv.style('text-align', 'center');
    arrayOfFoundIndex = new Array();
}

//runs every frame
function draw() {
    setFill("white");
    //draws background rectangle
    rect(0, 0, width, height);
    //draws the text for the inputs
    drawInputs();
    drawDescription();
    drawSearchData();
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
    getInput("Array length: ").setValue(50);
}

function drawInputs() {
    var cursor = spacingBtwInputs / 2;
    var y = spacingBtwTopAndInputs; // + topOfCanvas;
    setFill("black");
    for (var i in arrayOfInputs) {
        if (cursor + arrayOfInputs[i].getWidth() > width) {
            cursor = spacingBtwInputs / 2;
            y += heightOfInputs;
        }
        arrayOfInputs[i].drawText(cursor, y);
        arrayOfInputs[i].setPosition(cursor - 10, y + topOfCanvas - 28);
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

// create the cell array
function createCells(len) {
    if (minRangeOfRandom != undefined && maxRangeOfRandom != undefined) {
        if (len > 0) {
            // initialize cells
            arrayOfCells = new Array();

            for (var i = 0; i < len; i++) {
                // add the new cell to the cells array
                number = Math.floor(Math.random() * (maxRangeOfRandom - minRangeOfRandom + 1)) + minRangeOfRandom;
                arrayOfCells.push(new Cell(number));
            }
        }
    }
}

function recreateCells() {
    maxRangeOfRandom = parseInt(getInput('Maximum random value: ').getValue());
    minRangeOfRandom = parseInt(getInput('Minimum random value: ').getValue());
    if (minRangeOfRandom <= maxRangeOfRandom) {
        createCells(lengthOfArray);
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

        var startHeight = spacingForInputs + spacingForDesc + spacingForInfo;

        for (var i = 0; i < len; i++) {
            // xpos of the cell
            x = startX + (i % maxNum) * (spacingBtwCells + cellWidth);
            // no. of row currently on
            j = int(i / maxNum);
            // ypos of the cell
            y = startHeight + spacingBtwCells + j * (cellWidth + 2 * spacingBtwCellAndIndex);

            arrayOfCells[i].show(x, y, i);
        }
    }
    maxNum = int((width - cellWidth) / (cellWidth + spacingBtwCells)) + 1;
    maxHeight = startHeight + spacingBtwCells + (int(len / maxNum) + 1) * (cellWidth + 2 * spacingBtwCellAndIndex);
    if (maxHeight > height) {
        resizeCanvas(width, maxHeight);
    }
}

function updateCells() {
    lengthOfArray = getInput('Array length: ').getValue();
    createCells(lengthOfArray);
}

function resetCells() {
    arrayOfFoundIndex = new Array();
    runLinSearch = false;
    runBinarySearch = false;
    runJumpSearch = false;
    runInterpolationSearch = false;
    runExponentialSearch = false;
    runFibonacciSearch = false;
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

function shuffleCells() {
    resetCells();
    for (let i = arrayOfCells.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arrayOfCells[i], arrayOfCells[j]] = [arrayOfCells[j], arrayOfCells[i]];
    }
}

//---------------------------------------------------------------------------Search Algorithms-----------------------------------------------------------------------------

var linSearchCurrIndex, linSearchLen, runLinSearch = false,
    linSearchStart, linSearchReachedEnd = false;

function initializeLinearSearch(start, len) {
    linSearchCurrIndex = start;
    linSearchLen = len;
    linSearchStart = start;
    runLinSearch = true;
    linSearchReachedEnd = false;
}

function stepLinearSearch() {
    if (runLinSearch && linSearchCurrIndex < linSearchLen + linSearchStart) {
        if (linSearchCurrIndex - 1 >= 0) {
            arrayOfCells[linSearchCurrIndex - 1].setIsBeingSearched(false);
        }
        currentIndex = linSearchCurrIndex;
        // sets the cell to being currently searched
        arrayOfCells[linSearchCurrIndex].setIsBeingSearched(true);
        // if the cell contains the number to search, set its found to true
        if (arrayOfCells[linSearchCurrIndex].getNumber() == valueToSearch) {
            arrayOfCells[linSearchCurrIndex].setIsSearchValue(true);
            arrayOfFoundIndex.push(linSearchCurrIndex);
            if (linSearchCurrIndex == linSearchLen - 1 || !getInput("Find multiple: ").getValue()) {
                runLinSearch = false;
                arrayOfCells[linSearchCurrIndex].setIsBeingSearched(false);
            }
        }
        comparisonCount++;
        // increment linSearchCurrIndex
        linSearchCurrIndex++;

        if (linSearchCurrIndex == linSearchLen + linSearchStart) {
            runLinSearch = false;
            linSearchReachedEnd = true;
        }
    } else if (linSearchReachedEnd && linSearchCurrIndex - 1 < linSearchLen + linSearchStart) {
        arrayOfCells[linSearchCurrIndex - 1].setIsBeingSearched(false);
    }
}

var binarySearchLow, mid, binarySearchHigh, runBinarySearch = false,
    prevbinarySearchLow, prevbinarySearchHigh, binarySearchStart, binarySearchLen;

function initializeBinarySearch(start, len) {
    sortCells();
    binarySearchStart = start;
    binarySearchLen = len;
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
        comparisonCount++;
        currentIndex = mid;
        prevbinarySearchLow = binarySearchLow;
        prevbinarySearchHigh = binarySearchHigh;
        if (arrayOfCells[mid].getNumber() == valueToSearch) {
            arrayOfCells[mid].setIsSearchValue(true);
            arrayOfFoundIndex.push(mid);
            runBinarySearch = false;
            arrayOfCells[mid].setIsBeingSearched(false);
        } else if (arrayOfCells[mid].getNumber() >= valueToSearch) {
            binarySearchHigh = mid - 1;
        } else if (arrayOfCells[mid].getNumber() <= valueToSearch) {
            binarySearchLow = mid + 1;
        }
    }
}

var runJumpSearch = false,
    jumpSearchLen, jumpSearchStep, jumpSearchStep, jumpSearchCurrIndex, prevIndex;

function initializeJumpSearch(start, len) {
    sortCells();
    runJumpSearch = true;
    jumpSearchStart = start;
    jumpSearchCurrIndex = start;
    jumpSearchLen = len;
    jumpSearchStep = int(Math.sqrt(jumpSearchLen));
}

function stepJumpSearch() {
    if (runJumpSearch && jumpSearchCurrIndex < jumpSearchLen) {
        if (jumpSearchCurrIndex - 2 * jumpSearchStep >= jumpSearchStart) {
            arrayOfCells[jumpSearchCurrIndex - 2 * jumpSearchStep].setIsLowOrHigh(false);
        }
        arrayOfCells[jumpSearchCurrIndex].setIsLowOrHigh(true);
        currentIndex = jumpSearchCurrIndex;
        if (arrayOfCells[jumpSearchCurrIndex].getNumber() < valueToSearch) {
            jumpSearchCurrIndex += jumpSearchStep;
            comparisonCount++;

        } else {
            initializeLinearSearch(jumpSearchCurrIndex - jumpSearchStep, jumpSearchLen);
            runJumpSearch = false;
        }
    } else if (runLinSearch) {
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
        if (pos != undefined && pos < interpolationSearchStart + interpolationSearchLen) {
            arrayOfCells[pos].setIsBeingSearched(false);
        }

        if (arrayOfCells[interpolationSearchHigh].getNumber() != arrayOfCells[interpolationSearchLow].getNumber()) {
            pos = int(interpolationSearchLow + ((valueToSearch - arrayOfCells[interpolationSearchLow].getNumber()) * (interpolationSearchHigh - interpolationSearchLow) / (arrayOfCells[interpolationSearchHigh].getNumber() - arrayOfCells[interpolationSearchLow].getNumber())))
            currentIndex = pos;
            if (pos < interpolationSearchStart + interpolationSearchLen) {
                arrayOfCells[pos].setIsBeingSearched(true);
                comparisonCount++;

                arrayOfCells[interpolationSearchHigh].setIsLowOrHigh(true);
                arrayOfCells[interpolationSearchLow].setIsLowOrHigh(true);
                prevInterpolationSearchHigh = interpolationSearchHigh;
                prevInterpolationSearchLow = interpolationSearchLow;
                if (arrayOfCells[pos].getNumber() == valueToSearch) {
                    arrayOfCells[pos].setIsSearchValue(true);
                    arrayOfCells[pos].setIsBeingSearched(false);
                    arrayOfFoundIndex.push(pos);
                    runInterpolationSearch = false;
                } else if (arrayOfCells[pos].getNumber() > valueToSearch) {
                    interpolationSearchHigh = pos - 1;
                } else if (arrayOfCells[pos].getNumber() < valueToSearch) {
                    interpolationSearchLow = pos + 1;
                }
            } else {
                runInterpolationSearch = false;
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
        currentIndex = exponentialSearchHigh;
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
        comparisonCount++;

    } else {
        stepBinarySearch();
    }
}

var runFibonacciSearch = false,
    fibonacciSearchStart, fibonacciSearchLen, fibM = 0,
    fibMMm1 = 1,
    fibMMm2 = 0,
    offset = 0,
    i;

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
        if (fibM > 1) {
            if (i != undefined) {
                arrayOfCells[i].setIsBeingSearched(false);
            }
            i = Math.min(offset + fibMMm2, fibonacciSearchLen - 1);
            arrayOfCells[i].setIsBeingSearched(true);
            currentIndex = i;
            if (arrayOfCells[i].getNumber() < valueToSearch) {
                fibM = fibMMm1;
                fibMMm1 = fibMMm2
                fibMMm2 = fibM - fibMMm1;
                offset = i;
            } else if (arrayOfCells[i].getNumber() > valueToSearch) {
                fibM = fibMMm2;
                fibMMm1 = fibMMm1 - fibMMm2;
                fibMMm2 = fibM - fibMMm1;
            } else {
                arrayOfCells[i].setIsSearchValue(true);
                arrayOfCells[i].setIsBeingSearched(false);
                arrayOfFoundIndex.push(i);
                runFibonacciSearch = false;
            }
            comparisonCount++;

        }
    }
}

//---------------------------------------------------------------------------Other Functions-----------------------------------------------------------------------------

// sets fill color depending on the color string

function startSearch() {
    resetCells();
    comparisonCount = 0;
    arrayOfFoundIndex = new Array();
    if (isPaused) pause();
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
    getInput('Pause').inputElement.elt.innerHTML = isPaused ? "Unpause" : "Pause";
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
            fill(0, 230, 0);
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
        case "dark green":
            fill(0, 140, 0);
            break;
    }
}


function drawDescription() {
    for (var i in arrayOfDescriptions) {
        if (arrayOfDescriptions[i].text == currentSearchAlgorithm) {
            //description
            textAlign(LEFT, TOP);
            var widthOfWordDescription = textWidth("Description: ");
            var desc = arrayOfDescriptions[i].description;
            spacingForDesc = textHeight(desc, width - widthOfWordDescription) + verticalMargin;
            textStyle(BOLD);
            text("Description: ", spacingBtwInputs / 2, spacingForInputs);
            textStyle(NORMAL);
            text(desc, spacingBtwInputs + widthOfWordDescription, spacingForInputs, width - widthOfWordDescription - horizontalMargin, spacingForDesc);
            // timecomplexity
            var widthOfWordTimeComplexity = textWidth("Time Complexity: ");
            var timeComplexity = arrayOfDescriptions[i].timeComplexity;
            textStyle(BOLD);
            text("Time Complexity: ", spacingBtwInputs / 2, spacingForDesc + spacingForInputs);
            textStyle(NORMAL);
            text(timeComplexity, spacingBtwInputs + widthOfWordTimeComplexity, spacingForDesc + spacingForInputs);
            spacingForDesc += lineHeight;

            break;
        }
    }
}

var expoText;

function drawSearchData() {
    //comparison count
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    text("Comparions: " + comparisonCount.toString(), spacingBtwInputs / 2, spacingForDesc + spacingForInputs, width, spacingForDesc + lineHeight);
    if (currentIndex != undefined && lengthOfArray > 0) {
        //current index
        textAlign(CENTER, TOP);
        text("Current Index: " + currentIndex, spacingBtwInputs / 2, spacingForDesc + spacingForInputs, width, spacingForDesc + lineHeight);
        // current value
        textAlign(RIGHT, TOP);
        text("Current Value: " + arrayOfCells[currentIndex].getNumber(), spacingBtwInputs / 2, spacingForDesc + spacingForInputs, width - horizontalMargin, lineHeight)
        spacingForDesc += lineHeight;
    }
    textAlign(CENTER, TOP);
    switch (currentSearchAlgorithm) {
        case "Linear Search":
            break;
        case "Binary Search":
            if (binarySearchLow != undefined && binarySearchHigh != undefined) {
                text("Low: " + binarySearchLow + " | High: " + binarySearchHigh, spacingBtwInputs / 2, spacingForDesc + spacingForInputs, width - horizontalMargin, lineHeight);
            }
            break;
        case "Jump Search":
            // it is jumpsearchstep ahead of the animation
            if (jumpSearchCurrIndex != undefined && jumpSearchStep != undefined && jumpSearchCurrIndex - jumpSearchStep >= jumpSearchStart) {
                text("Step Size: " + jumpSearchStep.toString() + " | Low: " + (jumpSearchCurrIndex - jumpSearchStep).toString() + " | High: " + jumpSearchCurrIndex.toString(), spacingBtwInputs / 2, spacingForDesc + spacingForInputs, width - horizontalMargin, lineHeight);
            }
            break;
        case "Interpolation Search":
            // it is also ahead of the animation
            if (interpolationSearchLow != undefined && interpolationSearchHigh != undefined) {
                var textToDisplay = "Low: " + interpolationSearchLow.toString() + " | High: " + interpolationSearchHigh.toString();
                text(textToDisplay, spacingBtwInputs / 2, spacingForDesc + spacingForInputs, width - horizontalMargin, lineHeight);
            }

            break;
        case "Exponential Search":
            if (prevExponentialSearchLow != undefined && prevExponentialSearchHigh != undefined && runExponentialSearch) {
                text("Low: " + prevExponentialSearchLow + " | High: " + prevExponentialSearchHigh, spacingBtwInputs / 2, spacingForDesc + spacingForInputs, width - horizontalMargin, lineHeight);
            } else if (!runExponentialSearch && runBinarySearch) {
                expoText = "Low: " + binarySearchLow + " | High: " + binarySearchHigh;
            }
            if (binarySearchHigh != undefined && binarySearchLow != undefined) {
                text("Low: " + binarySearchLow + " | High: " + binarySearchHigh, spacingBtwInputs / 2, spacingForDesc + spacingForInputs, width - horizontalMargin, lineHeight);
            }
            break;
        case "Fibonacci Search":
            // what is this?? nani
            if (fibM != undefined && fibMMm1 != undefined && fibMMm2) {
                var fibText = "mᵗʰ Fibonacci: " + fibM.toString() + " | (m - 1)ᵗʰ Fibonacci: " + fibMMm1.toString() + " | (m-2)ᵗʰ Fibonacci: " + fibMMm2.toString();
                text(fibText, spacingBtwInputs / 2, spacingForDesc + spacingForInputs, width - horizontalMargin, lineHeight);
            }
            break;
    }
    spacingForDesc += lineHeight;

    // Found Text
    if (arrayOfFoundIndex != undefined) {
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        var foundText;
        if (arrayOfFoundIndex.length > 0) {
            setFill("dark green");
            foundText = "Found at index(es): ";
            for (var i = 0; i < arrayOfFoundIndex.length; i++) {
                foundText += i != arrayOfFoundIndex.length - 1 ? arrayOfFoundIndex[i].toString() + ", " : arrayOfFoundIndex[i].toString();
            }
        } else {
            setFill("red");
            foundText = "Not Found";
        }
        var heightOfFoundText = textHeight(foundText, width);
        text(foundText, spacingBtwInputs / 2, spacingForInputs + spacingForDesc, width - horizontalMargin, heightOfFoundText + 14);
        spacingForInfo = heightOfFoundText;
        textStyle(NORMAL);
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
    var h = 0;
    var testLine = '';
    for (var i = 0; i < words.length; i++) {
        if (!words[i].includes("\n")) {
            testLine += words[i] + ' ';
            var testLineWidth = textWidth(testLine);
            if (testLineWidth > maxWidth && i >= 0) {
                testLine = words[i] + ' ';
                h += textAscent() + textDescent();
            }
        } else {
            testLine = words[i] + ' ';
            h += textAscent() + textDescent();
        }
    }
    return h + lineHeight / 2;
}

function setFramesPerSecond() {
    framesPerSecond = parseFloat(getInput('Frames per second: ').getValue());
}

function setValueToSearch() {
    resetCells();
    valueToSearch = parseInt(getInput('Value to search: ').getValue());
}

var multipleValuesAvailable = ["Linear Search", ]

function setSearchAlgo() {
    currentSearchAlgorithm = getInput('Search Algorithm: ').getValue();
    if (multipleValuesAvailable.includes(currentSearchAlgorithm)) {
        enableMultipleValues(true);
    } else {
        enableMultipleValues(false);
    }
}

function setUnique() {
    lengthOfArray = maxRangeOfRandom - minRangeOfRandom + 1;
        arrayOfCells = new Array();
        for (var i = 0; i < lengthOfArray; i++) {
            arrayOfCells.push(new Cell(i + minRangeOfRandom));
        }
        shuffleCells();
}

function enableMultipleValues(enable) {
    getInput('Find multiple: ').setValue(false);
    if (enable) {
        getInput('Find multiple: ').inputElement.removeAttribute('disabled');
    } else {
        getInput('Find multiple: ').inputElement.attribute('disabled', '');
    }
}

function windowResized() {
    resizeCanvas(window.innerWidth - horizontalMargin, window.innerHeight - verticalMargin - topOfCanvas);
    footerDiv.size(width);
}