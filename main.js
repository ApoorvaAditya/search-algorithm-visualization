// Constants
const cellSideLength = 50;
const spacingBtwCells = 20;
const spacingBtwCellAndIndex = 20;
const indexTextSize = 14;
const widthOfNumberInput = 40;
const spacingBtwInputs = 20;
const horizontalMargin = 16;
const verticalMargin = 20;
// Height of one row of inputs
const inputHeight = 30;
const lineHeight = 20;
const spaceForBottomLink = 10;
var defaultHeight;

// Variables
var spacingBtwTopAndInputs = 20;
var topOfCanvas;
var currentIndex = 0;
var comparisonCount = 0;
var currentVerticalPosition;
var minRangeOfRandom = 0; // Inclusive
var maxRangeOfRandom = 10; // Inclusive
var lengthOfArray = 50;
var framesPerSecond = 10;
var valueToFind;
var currentSearchAlgo;
var arrayOfFoundIndex = new Array();
var arrayOfCells;
var arrayOfInputs = new Array();
var arrayOfInputData = [{
        text: 'Search Algorithm: ',
        type: 'dropdown'
    },
    {
        text: 'Array length: ',
        type: 'number'
    },
    {
        text: 'Value to find: ',
        type: 'number'
    },
    {
        text: 'Frames per second: ',
        type: 'number'
    },
    {
        text: 'Minimum random value: ',
        type: 'number'
    },
    {
        text: 'Maximum random value: ',
        type: 'number'
    },
    {
        text: 'Start',
        type: 'button'
    },
    {
        text: 'Pause',
        type: 'button'
    },
    {
        text: 'Shuffle',
        type: 'button'
    },
    {
        text: 'Sort',
        type: 'button'
    },
    {
        text: 'Unique values',
        type: 'button'
    },
    {
        text: 'Find multiple: ',
        type: 'checkbox'
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
        text: 'Linear Search',
        description: `Linear search, also known as sequential search, is a process that checks every element in the list sequentially until the desired element is found.`,
        timeComplexity: 'O(n)'
    },
    {
        text: 'Binary Search',
        description: `Binary search is a fast search algorithm which works on the principle of divide and conquer. For this algorithm to work properly, the data collection should be in the sorted form. Binary search looks for a particular item by comparing the middle most item of the collection. If a match occurs, then the index of item is returned. If the middle item is greater than the item, then the item is searched in the sub-array to the left of the middle item. Otherwise, the item is searched for in the sub-array to the right of the middle item. This process continues on the sub-array as well until the size of the subarray reduces to zero.`,
        timeComplexity: 'O(log(n))'
    },
    {
        text: 'Jump Search',
        description: `Jump Search is a searching algorithm for sorted arrays. The basic idea is to check fewer elements (than linear search) by jumping ahead by fixed steps or skipping some elements in place of searching all elements. For example, suppose we have an array arr[] of size n and block (to be jumped) size m. Then we search at the indexes arr[0], arr[m], arr[2m]…..arr[km] and so on. Once we find the interval (arr[km] < x < arr[(k+1)m]), we perform a linear search operation from the index km to find the element x. The optimal block size to be skipped is square root of n.`,
        timeComplexity: 'O(√n)'
    },
    {
        text: 'Interpolation Search',
        description: `The Interpolation Search is an improvement over Binary Search for instances, where the values in a sorted array are uniformly distributed. Binary Search always goes to the middle element to check. On the other hand, interpolation search may go to different locations according to the value of the key being searched. For example, if the value of the key is closer to the last element, interpolation search is likely to start search toward the end side. To find the position to be searched, it uses following formula:
        pos = lo + [ ( x - arr[lo] ) * ( hi - lo ) / ( arr[hi] - arr[lo] ) ]
where,
arr[] : Array where elements need to be searched
x  : Element to be searched
lo : Starting index in arr[]
hi : Ending index in arr[]
`,
        timeComplexity: 'O(log(log(n))) to O(n)'
    },
    {
        text: 'Exponential Search',
        description: `The idea is to start with subarray size 1, compare its last element with x, then try size 2, then 4 and so on until last element of a subarray is not greater. Once we find an index i (after repeated doubling of i), we know that the element must be present between i/2 and i because we could not find a greater value in previous iteration.`,
        timeComplexity: 'O(log(n))'
    },
    {
        text: 'Fibonacci Search',
        description: `Let the element to find be x. The idea is to first find the smallest Fibonacci number that is greater than or equal to the length of given array. Let the found Fibonacci number be fib (m’th Fibonacci number). We use (m-2)’th Fibonacci number as the index (If it is a valid index). Let (m-2)’th Fibonacci Number be i, we compare arr[i] with x, if x is same, we return i. Else if x is greater, we recur for subarray after i, else we recur for subarray before i.`,
        timeComplexity: 'O(log(n))'
    },
];
var multipleValuesAvailable = ['Linear Search', 'Jump Search'];
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
            setFill('orange');
            this.hasBeenVisited = true;
        } else if (this.isSearchValue) {
            setFill('green');
        } else if (this.hasBeenVisited) {
            setFill('grey')
        } else if (this.isLowOrHigh) {
            setFill('light blue');
        } else {
            setFill('white');
        }
        // draw the cell square
        square(x, y, cellSideLength);
        // draw the number in the cell
        setFill('black');
        textAlign(CENTER, CENTER);
        textSize(cellSideLength / 2);
        text(this.number, x + cellSideLength / 2, y + cellSideLength / 2);
        // draw the index below the cell
        textSize(indexTextSize);
        text(index, x + cellSideLength / 2, y + cellSideLength + spacingBtwCellAndIndex);
    }
}

class TextNInput {
    constructor(text, type) {
        this.text = text;
        this.type = type;
    }

    create() {
        switch (this.type) {
            case 'number':
                this.inputElement = createInput(1, this.type);
                break;
            case 'dropdown':
                this.inputElement = createSelect();
                for (let searchAlgo of arrayOfSearchAlgos)
                    this.inputElement.option(searchAlgo);
                break;
            case 'button':
                this.inputElement = createButton(this.text);
                break;
            case 'checkbox':
                this.inputElement = createCheckbox('', false);
                break;
        }
        // Set width of the input
        if (this.type == 'number') {
            this.inputElement.size(widthOfNumberInput);
        }
        this.width = this.inputElement.size().width + spacingBtwInputs;
    }

    drawText(x, y) {
        if (this.type != 'button') {
            textAlign(LEFT, CENTER);
            text(this.text, x, y + 3);
        }
    }

    getWidth() {
        if (this.type == 'checkbox') return textWidth(this.text) + 40;
        else if (this.type == 'button') return this.width;
        return textWidth(this.text) + this.width;
    }

    getValue() {
        if (this.type != 'checkbox') return this.inputElement.value();
        else return this.inputElement.checked();
    }

    setValue(val) {
        if (this.type != 'checkbox') {
            this.inputElement.value(val);
        } else {
            this.inputElement.checked(val);
        }
    }

    setPosition(x, y) {
        this.inputElement.position(this.type != 'button' ? textWidth(this.text) + x + spacingBtwInputs : x + spacingBtwInputs, y);
    }
}

//-----------------------------------------------------------------------------Setup and Draw--------------------------------------------------------------------------

function setup() {
    //create the canvas of the size of browser window + some margins
    var canvas = createCanvas(window.innerWidth - horizontalMargin, window.innerHeight - verticalMargin - spaceForBottomLink);
    topOfCanvas = canvas.position().y + spacingBtwTopAndInputs;
    resizeCanvas(window.innerWidth - horizontalMargin, window.innerHeight - verticalMargin - topOfCanvas);
    defaultHeight = height;

    createInputs();
    createCells(lengthOfArray);
    createFooter();

    setSearchAlgo();
    setValueToSearch();
    setFramesPerSecond();
}

function draw() {
    //draws background rectangle
    setFill('white');
    rect(0, 0, width, height);
    drawInputs();
    drawDescription();
    drawSearchData();
    if (frameCount % (60 / framesPerSecond) == 0 && !isPaused) {
        switch (getInput('Search Algorithm: ').getValue()) {
            case 'Linear Search':
                stepLinear();
                break;
            case 'Binary Search':
                stepBinary();
                break;
            case 'Jump Search':
                stepJump();
                break;
            case 'Interpolation Search':
                stepInterpolation();
                break;
            case 'Exponential Search':
                stepExponential();
                break;
            case 'Fibonacci Search':
                stepFibonacci();
                break;
        }
    }
    showCells(lengthOfArray);
}

//-----------------------------------------------------------------------------Input Functions----------------------------------------------------------------------------

// creates the inputs
function createInputs() {
    for (let i in arrayOfInputData) {
        arrayOfInputs.push(new TextNInput(arrayOfInputData[i].text, arrayOfInputData[i].type));
        arrayOfInputs[i].create();
    }
    getInput('Array length: ').setValue(lengthOfArray);
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
    getInput('Value to find: ').inputElement.input(setValueToSearch);
}

function drawInputs() {
    var inputHorizontalCursor = spacingBtwInputs / 2;
    currentVerticalPosition = spacingBtwTopAndInputs;
    setFill('black');
    for (let textNInput of arrayOfInputs) {
        if (inputHorizontalCursor + textNInput.getWidth() > width) {
            inputHorizontalCursor = spacingBtwInputs / 2;
            currentVerticalPosition += inputHeight;
        }
        textNInput.drawText(inputHorizontalCursor, currentVerticalPosition);
        textNInput.setPosition(inputHorizontalCursor, currentVerticalPosition + topOfCanvas - 28);
        inputHorizontalCursor += textNInput.getWidth();
    }
    currentVerticalPosition += inputHeight;
}

function getInput(text) {
    for (let i in arrayOfInputs)
        if (arrayOfInputData[i].text == text) return arrayOfInputs[i];
}

//-----------------------------------------------------------------------------Cell Functions--------------------------------------------------------------------------------

// create the cell array
function createCells(len) {
    if (minRangeOfRandom != undefined && maxRangeOfRandom != undefined && len > 0) {
        arrayOfCells = new Array();
        for (let i = 0; i < len; i++) {
            const number = Math.floor(Math.random() * (maxRangeOfRandom - minRangeOfRandom + 1)) + minRangeOfRandom;
            arrayOfCells.push(new Cell(number));
        }
    }
}

function recreateCells() {
    maxRangeOfRandom = parseInt(getInput('Maximum random value: ').getValue());
    minRangeOfRandom = parseInt(getInput('Minimum random value: ').getValue());
    if (minRangeOfRandom <= maxRangeOfRandom) createCells(lengthOfArray);
}

function showCells(len) {
    if (len > 0) {
        // the maximum number of cells that can fit in the given canvas size
        maxNum = int((width - cellSideLength) / (cellSideLength + spacingBtwCells)) + 1;
        // whether len is bigger or smaller than the maxNum
        n = constrain(len, 0, maxNum);
        // Start position so that the cells are aligned to center (first row)
        startX = (width - n * cellSideLength - (n - 1) * spacingBtwCells) / 2;
        var startHeight = currentVerticalPosition;
        for (let i = 0; i < len; i++) {
            // xpos of the cell
            x = startX + (i % maxNum) * (spacingBtwCells + cellSideLength);
            // no. of row currently on
            j = int(i / maxNum);
            // ypos of the cell
            y = startHeight + spacingBtwCells + j * (cellSideLength + 2 * spacingBtwCellAndIndex);
            arrayOfCells[i].show(x, y, i);
        }
    }
    maxNum = int((width - cellSideLength) / (cellSideLength + spacingBtwCells)) + 1;
    maxHeight = startHeight + spacingBtwCells + (int(len / maxNum) + 1) * (cellSideLength + 2 * spacingBtwCellAndIndex);
    if (maxHeight > height) resizeCanvas(width, maxHeight);
    if (maxHeight < height && height != defaultHeight) resizeCanvas(width, defaultHeight);
}

function updateCells() {
    lengthOfArray = parseInt(getInput('Array length: ').getValue());
    createCells(lengthOfArray);
}

function resetCells() {
    arrayOfFoundIndex = new Array();
    runLinear = false;
    runBinary = false;
    runJump = false;
    runInterpolationSearch = false;
    runExponential = false;
    runFibonacciSearch = false;
    for (let i in arrayOfCells) {
        setIsBeingSearched(i, false);
        setIsLowOrHigh(i, false);
        setIsSearchValue(i, false);
        setHasBeenVisited(i, false);
    }
}

function sortCells() {
    arrayOfCells.sort(function (cell1, cell2) { return cell1.number - cell2.number });
}

function shuffleCells() {
    resetCells();
    for (let i = arrayOfCells.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arrayOfCells[i], arrayOfCells[j]] = [arrayOfCells[j], arrayOfCells[i]];
    }
}

//---------------------------------------------------------------------------Search Algorithms-----------------------------------------------------------------------------

var linearCurrIndex, linearLen, linearStart, runLinear = false, linearReachedEnd = false;

function initLinear(start, len) {
    linearCurrIndex = start;
    linearLen = len;
    linearStart = start;
    runLinear = true;
    linearReachedEnd = false;
}

function stepLinear() {
    if (runLinear && linearCurrIndex < linearLen + linearStart) {
        if (linearCurrIndex - 1 >= linearStart)
            setIsBeingSearched(linearCurrIndex - 1, false);

        currentIndex = linearCurrIndex;
        setIsBeingSearched(linearCurrIndex, true);

        if (getNumber(linearCurrIndex) == valueToFind) {
            setIsSearchValue(linearCurrIndex, true);
            arrayOfFoundIndex.push(linearCurrIndex);

            if (linearCurrIndex == linearLen + linearStart - 1 || !getInput('Find multiple: ').getValue()) {
                runLinear = false;
                setIsBeingSearched(linearCurrIndex, false);
            }
        }

        comparisonCount++;
        linearCurrIndex++;

        if (linearCurrIndex == linearLen + linearStart)
            runLinear = false;
    }
    // fix last element
    else if (linearCurrIndex - 1 < linearLen + linearStart)
        setIsBeingSearched(linearCurrIndex - 1, false);
}

var binaryStart, binaryLen, binaryLow, binaryMid, binaryHigh, prevBinaryLow, prevBinaryHigh,  runBinary = false;

function initBinary(start, len) {
    sortCells();
    binaryStart = start;
    binaryLen = len;
    binaryLow = start;
    binaryHigh = start + len - 1;
    runBinary = true;
}

function stepBinary() {
    if (runBinary && binaryLow <= binaryHigh) {
        setIsLowOrHigh(prevBinaryLow, false);
        setIsLowOrHigh(prevBinaryHigh, false);
        if (binaryMid != undefined) setIsBeingSearched(binaryMid, false);
        binaryMid = int((binaryLow + binaryHigh) / 2);
        print(binaryMid);
        setIsLowOrHigh(binaryLow, true);
        setIsLowOrHigh(binaryHigh, true);
        setIsBeingSearched(binaryMid, true);
        comparisonCount++;
        currentIndex = binaryMid;
        prevBinaryLow = binaryLow;
        prevBinaryHigh = binaryHigh;
        if (getNumber(binaryMid) == valueToFind) {
            setIsSearchValue(binaryMid, true);
            arrayOfFoundIndex.push(binaryMid);
            runBinary = false;
            setIsBeingSearched(binaryMid, false);
        }
        else if (getNumber(binaryMid) >= valueToFind)
            binaryHigh = binaryMid - 1;
        else if (getNumber(binaryMid) <= valueToFind)
            binaryLow = binaryMid + 1;
    }
}

var jumpLen, jumpStep, jumpCurrIndex, runJump = false;

function initJump(start, len) {
    sortCells();
    runJump = true;
    jumpSearchStart = start;
    jumpCurrIndex = start;
    jumpLen = len;
    jumpStep = int(Math.sqrt(jumpLen));
}

function stepJump() {
    if (runJump && jumpCurrIndex < jumpLen) {
        if (jumpCurrIndex - 2 * jumpStep >= jumpSearchStart)
            setIsLowOrHigh(jumpCurrIndex - 2 * jumpStep, false);
        setIsLowOrHigh(jumpCurrIndex, true);
        currentIndex = jumpCurrIndex;
        if (getNumber(jumpCurrIndex) < valueToFind) {
            jumpCurrIndex += jumpStep;
            comparisonCount++;
        } else {
            initLinear(jumpCurrIndex - jumpStep, jumpLen);
            runJump = false;
        }

    } else if (runLinear) {
        if (getNumber(linearCurrIndex) <= valueToFind)
            stepLinear();
        else {
            setIsBeingSearched(linearCurrIndex - 1, false);
            setIsSearchValue(linearCurrIndex - 1, true);
        }
    }
}

var interpolationLen, interpolationStart, interpolationLow, interpolationHigh, prevInterpolationHigh, prevInterpolationLow, interpolationPos, runInterpolation = false;

function initInterpolation(start, len) {
    sortCells();
    runInterpolationSearch = true;
    interpolationStart = start;
    interpolationLen = len;
    interpolationLow = start;
    interpolationHigh = start + len - 1;
}

function stepInterpolation() {
    if (runInterpolationSearch) {
        setIsLowOrHigh(prevInterpolationHigh, false);
        setIsLowOrHigh(prevInterpolationLow, false);
        if (interpolationPos != undefined && interpolationPos < interpolationStart + interpolationLen)
            setIsBeingSearched(interpolationPos, false);

        if (getNumber(interpolationHigh) != getNumber(interpolationLow)) {
            interpolationPos = int(interpolationLow + ((valueToFind - getNumber(interpolationLow)) * (interpolationHigh - interpolationLow) / (getNumber(interpolationHigh) - getNumber(interpolationLow))))
            currentIndex = interpolationPos;
            if (interpolationPos < interpolationStart + interpolationLen) {
                setIsBeingSearched(interpolationPos, true);
                comparisonCount++;

                setIsLowOrHigh(interpolationHigh, true);
                setIsLowOrHigh(interpolationLow, true);
                prevInterpolationHigh = interpolationHigh;
                prevInterpolationLow = interpolationLow;

                if (getNumber(interpolationPos) == valueToFind) {
                    setIsSearchValue(interpolationPos, true);
                    setIsBeingSearched(interpolationPos, false);
                    arrayOfFoundIndex.push(interpolationPos);
                    runInterpolationSearch = false;
                }
                else if (getNumber(interpolationPos) > valueToFind)
                    interpolationHigh = interpolationPos - 1;
                else if (getNumber(interpolationPos) < valueToFind)
                    interpolationLow = interpolationPos + 1;
            }
            else runInterpolationSearch = false;
        }
    }
}

var exponentialLen, exponentialStart, exponentialHigh, exponentialLow, prevExponentialHigh, prevExponentialLow, runExponential = false;

function initExponential(start, len) {
    sortCells();
    runExponential = true;
    exponentialStart = start;
    exponentialLen = len;
    exponentialLow = start;
    exponentialHigh = start + 1;
}

function stepExponential() {
    if (runExponential) {
        setIsLowOrHigh(prevExponentialHigh, false);
        setIsLowOrHigh(prevExponentialLow, false);
        setIsLowOrHigh(exponentialHigh, true);
        setIsLowOrHigh(exponentialLow, true);
        prevExponentialHigh = exponentialHigh;
        prevExponentialLow = exponentialLow;
        currentIndex = exponentialHigh;
        if (getNumber(exponentialHigh) < valueToFind) {
            exponentialLow = exponentialHigh;
            if (2 * exponentialHigh - exponentialStart < exponentialStart + exponentialLen)
                exponentialHigh = 2 * exponentialHigh - exponentialStart;
            else
                exponentialHigh = exponentialStart + exponentialLen - 1;
        } else {
            initBinary(exponentialLow, exponentialHigh - exponentialLow + 1);
            runExponential = false;
        }
        comparisonCount++;
    }
    else stepBinary();
}

var fibonacciStart, fibonacciLen, fibM = 0, fibMMm1 = 1, fibMMm2 = 0, offset = 0, fibi, runFibonacciSearch = false;

function initFibonacci(start, len) {
    sortCells();
    runFibonacciSearch = true;
    fibonacciStart = start;
    fibonacciLen = len;
    while (fibM < fibonacciLen) {
        fibMMm2 = fibMMm1;
        fibMMm1 = fibM;
        fibM = fibMMm1 + fibMMm2;
    }
}

function stepFibonacci() {
    if (runFibonacciSearch) {
        if (fibM > 1) {
            setIsLowOrHigh(fibi, false);
            fibi = Math.min(offset + fibMMm2, fibonacciLen - 1);
            setIsBeingSearched(fibi, true);
            currentIndex = fibi;
            if (getNumber(fibi) < valueToFind) {
                fibM = fibMMm1;
                fibMMm1 = fibMMm2
                fibMMm2 = fibM - fibMMm1;
                offset = fibi;
            } else if (getNumber(fibi) > valueToFind) {
                fibM = fibMMm2;
                fibMMm1 = fibMMm1 - fibMMm2;
                fibMMm2 = fibM - fibMMm1;
            } else {
                setIsSearchValue(fibi, true);
                setIsBeingSearched(fibi, false);
                arrayOfFoundIndex.push(fibi);
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
    switch (getInput('Search Algorithm: ').getValue()) {
        case 'Linear Search':
            initLinear(0, lengthOfArray);
            break;
        case 'Binary Search':
            initBinary(0, lengthOfArray);
            break;
        case 'Jump Search':
            initJump(0, lengthOfArray);
            break;
        case 'Interpolation Search':
            initInterpolation(0, lengthOfArray);
            break;
        case 'Exponential Search':
            initExponential(0, lengthOfArray);
            break;
        case 'Fibonacci Search':
            initFibonacci(0, lengthOfArray);
            break;
        }
}

function pause() {
    isPaused = isPaused ? false : true;
    getInput('Pause').inputElement.elt.innerHTML = isPaused ? 'Unpause' : 'Pause';
}

function setFill(color) {
    switch (color) {
        case 'yellow':
            fill(255, 255, 0);
            break;
        case 'blue':
            fill(0, 0, 255);
            break;
        case 'red':
            fill(255, 0, 0);
            break;
        case 'green':
            fill(0, 230, 0);
            break;
        case 'white':
            fill(255);
            break;
        case 'black':
            fill(0);
            break;
        case 'orange':
            fill(255, 165, 0);
            break;
        case 'grey':
            fill(220, 220, 220);
            break;
        case 'light blue':
            fill(0, 191, 255);
            break;
        case 'dark green':
            fill(0, 140, 0);
            break;
    }
}


function drawDescription() {
    for (let currDesc of arrayOfDescriptions) {
        if (currDesc.text == currentSearchAlgo) {
            //description
            textAlign(LEFT);
            const widthOfWordDescription = textWidth('Description: ');
            const desc = currDesc.description;
            textStyle(BOLD);
            text('Description: ', spacingBtwInputs / 2, currentVerticalPosition);
            textStyle(NORMAL);
            text(desc, spacingBtwInputs + widthOfWordDescription, currentVerticalPosition, width - widthOfWordDescription - horizontalMargin);
            // timecomplexity
            const widthOfWordTimeComplexity = textWidth('Time Complexity: ');
            const timeComplexity = currDesc.timeComplexity;
            textStyle(BOLD);
            currentVerticalPosition += textHeight(desc, width - widthOfWordDescription) + verticalMargin;
            text('Time Complexity: ', spacingBtwInputs / 2, currentVerticalPosition);
            textStyle(NORMAL);
            text(timeComplexity, spacingBtwInputs + widthOfWordTimeComplexity, currentVerticalPosition);
            currentVerticalPosition += lineHeight;
            break;
        }
    }
}

function drawSearchData() {
    //comparison count
    textAlign(LEFT);
    textStyle(BOLD);
    text('Comparions: ' + comparisonCount.toString(), spacingBtwInputs / 2, currentVerticalPosition);
    if (currentIndex != undefined && lengthOfArray > 0) {
        //current index
        textAlign(CENTER);
        text('Current Index: ' + currentIndex, spacingBtwInputs / 2, currentVerticalPosition, width);
        // current value
        textAlign(RIGHT);
        text('Current Value: ' + getNumber(currentIndex), spacingBtwInputs / 2, currentVerticalPosition, width - horizontalMargin);
        currentVerticalPosition += lineHeight;
    }
    //
    textAlign(CENTER);
    switch (currentSearchAlgo) {
        case 'Binary Search':
            if (binaryLow != undefined && binaryHigh != undefined)
                drawInfoText('Low: ' + binaryLow.toString() + ' | High: ' + binaryHigh.toString());
            break;
        case 'Jump Search':
            // it is jumpsearchstep ahead of the animation
            if (jumpCurrIndex != undefined && jumpStep != undefined && jumpCurrIndex - jumpStep >= jumpSearchStart)
                drawInfoText('Step Size: ' + jumpStep.toString() + ' | Low: ' + (jumpCurrIndex - jumpStep).toString() + ' | High: ' + jumpCurrIndex.toString());
            break;
        case 'Interpolation Search':
            // it is also ahead of the animation
            if (interpolationLow != undefined && interpolationHigh != undefined)
                drawInfoText('Low: ' + interpolationLow.toString() + ' | High: ' + interpolationHigh.toString());
            break;
        case 'Exponential Search':
            if (prevExponentialLow != undefined && prevExponentialHigh != undefined && runExponential)
                drawInfoText('Low: ' + prevExponentialLow.toString() + ' | High: ' + prevExponentialHigh.toString());

            else if (binaryHigh != undefined && binaryLow != undefined)
                drawInfoText('Low: ' + binaryLow.toString() + ' | High: ' + binaryHigh.toString());
            break;
        case 'Fibonacci Search':
            // TODO: what is this?? nani
            if (fibM != undefined && fibMMm1 != undefined && fibMMm2 != undefined) {
                drawInfoText('mᵗʰ Fibonacci: ' + fibM.toString() + ' | (m - 1)ᵗʰ Fibonacci: ' + fibMMm1.toString() + ' | (m-2)ᵗʰ Fibonacci: ' + fibMMm2.toString());
            }
            break;
    }
    currentVerticalPosition += lineHeight

    // Found Text
    if (arrayOfFoundIndex != undefined) {
        textAlign(CENTER);
        textStyle(BOLD);
        let foundText;
        if (arrayOfFoundIndex.length > 0) {
            setFill('dark green');
            foundText = 'Found at index(es): ';
            for (let i in arrayOfFoundIndex)
                foundText += i != arrayOfFoundIndex.length - 1 ? arrayOfFoundIndex[i].toString() + ', ' : arrayOfFoundIndex[i].toString();
        } else {
            setFill('red');
            foundText = 'Not Found';
        }
        const heightOfFoundText = textHeight(foundText, width);
        text(foundText, spacingBtwInputs / 2, currentVerticalPosition, width - horizontalMargin, heightOfFoundText + 14);
        currentVerticalPosition += heightOfFoundText;
    }
    textStyle(NORMAL);
}


var fibonacciNumbers = [0, 1];

function fibonacciNumber(n) {
    if (n == 0)
        return 0;
    if (n == 1)
        return 1;
    if (fibonacciNumbers[n] != undefined)
        return fibonacciNumbers[n];
    else {
        fibonacciNumbers.push(fibonacciNumber(n - 1) + fibonacciNumber(n - 2))
        return fibonacciNumbers[n];
    }
}

function textHeight(text, maxWidth) {
    let words = text.split(' ');
    let h = 0;
    let testLine = '';
    for (let word of words) {
        if (!word.includes('\n')) {
            testLine += word + ' ';
            const testLineWidth = textWidth(testLine);
            if (testLineWidth > maxWidth) {
                testLine = word + ' ';
                h += textAscent() + textDescent();
            }
        } else {
            testLine = word + ' ';
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
    valueToFind = parseInt(getInput('Value to find: ').getValue());
}

function setSearchAlgo() {
    currentSearchAlgo = getInput('Search Algorithm: ').getValue();
    multipleValuesAvailable.includes(currentSearchAlgo) ? enableMultipleValues(true) : enableMultipleValues(false);
}

function setUnique() {
    lengthOfArray = maxRangeOfRandom - minRangeOfRandom + 1;
    arrayOfCells = new Array();
    for (let i = 0; i < lengthOfArray; i++)
        arrayOfCells.push(new Cell(i + minRangeOfRandom));
    shuffleCells();
}

function enableMultipleValues(enable) {
    getInput('Find multiple: ').setValue(false);
    enable ? getInput('Find multiple: ').inputElement.removeAttribute('disabled') : getInput('Find multiple: ').inputElement.attribute('disabled', '');
}

function setIsLowOrHigh(index, val) {
    if (index != undefined) {
        arrayOfCells[index].isLowOrHigh = val;
    }
}

function setIsSearchValue(index, val) {
    arrayOfCells[index].isSearchValue = val;
}

function setIsBeingSearched(index, val) {
    arrayOfCells[index].isBeingSearched = val;
}

function setHasBeenVisited(index, val) {
    arrayOfCells[index].hasBeenVisited = val;
}

function getNumber(index) {
    return arrayOfCells[index].number;
}

function drawInfoText(textToDisplay) {
    text(textToDisplay, spacingBtwInputs / 2, currentVerticalPosition, width - horizontalMargin, lineHeight);
}

function createFooter() {
    footerDiv = createDiv('').size(width);
    footerDiv.child(createA('https://apoorvaaditya.github.io', 'Made by Apoorva Aditya'), '_blank');
    footerDiv.child(createSpan('').style('margin-left', '50px'));
    footerDiv.child(createA('https://github.com/ApoorvaAditya/search-visualizer', 'Source code available on GitHub', '_blank'));
    footerDiv.child(createSpan('').style('margin-left', '50px'));
    footerDiv.child(createA('https://www.geeksforgeeks.org/searching-algorithms/', 'More info at GeeksforGeeks', '_blank'));
    footerDiv.style('text-align', 'center');
}

function windowResized() {
    resizeCanvas(window.innerWidth - horizontalMargin, window.innerHeight - verticalMargin - topOfCanvas - spaceForBottomLink);
    footerDiv.size(width);
}