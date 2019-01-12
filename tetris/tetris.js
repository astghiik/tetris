const xCount = 20;
const yCount = 26;

const mainDiv = document.getElementById('mainContainer');
const nextDiv = document.getElementById('nextContainer');
const squareItems = document.getElementsByClassName('squareItem');
const levSel = document.getElementById('levSel');
const points = document.getElementById('points');
const pause = document.getElementById('pause');

let int;
let timeout;

let delLines = 0;
let best = 0;

function createBoard(xCount, yCount, contId, itemClass) {  //???????

    for (let i = 0; i < yCount; i ++) {
        for (let j = 0; j < xCount; j ++) { 
            var divEl = document.createElement('div');
            let div = contId.appendChild(divEl);
            div.classList.add(itemClass);
            div.dataset.ij = `${i}-${j}`;
        }
    }    
}

createBoard(xCount, yCount, mainDiv, 'squareItem');
createBoard(4, 4, nextDiv, 'squareItemNext');

const blocks = [                                 // first elements -  centers of rotation
    ['0-9', '1-9', '0-10', '1-10', 'o'],         // O:
    ['0-10', '1-9', '1-10', '0-11', 's'],        // S:
    ['0-10', '0-9', '1-10', '1-11', 'z'],        // Z:
    ['0-9', '0-8', '0-10', '0-11', 'i'],         // I:
    ['1-9', '2-9', '0-9', '2-10', 'l'],          // L:
    ['1-10', '2-10', '2-9', '0-10', 'j'],        // J:
    ['0-9', '0-8', '1-9', '0-10', 't']           // T:
];

let fixed = [];
let currentBlock;
let nextCurrentBlock;

function getRandomBlock() {
    return blocks[Math.floor(Math.random() * 7)];
}

function getCurrentBlock() {
    if (!nextCurrentBlock) {
        currentBlock = [...getRandomBlock()];
    } else {
        currentBlock = [...nextCurrentBlock];
    }

    nextCurrentBlock = [...getRandomBlock()];
    drawItem(currentBlock);
    showNextBlock();

}

function showNextBlock() {
    let block;
    if (nextCurrentBlock[4] === 'o') {
        block = ['1-1', '1-2', '2-1', '2-2'];
    } else if (nextCurrentBlock[4] === 'z') {
        block = ['1-1', '1-2', '2-0', '2-1'];
    } else if (nextCurrentBlock[4] === 's') {
        block = ['1-0', '1-1', '2-1', '2-2'];
    } else if (nextCurrentBlock[4] === 'i') {
        block = ['2-0', '2-1', '2-2', '2-3'];
    } else if (nextCurrentBlock[4] === 'l') {
        block = ['0-2', '1-2', '2-2', '2-1'];
    } else if (nextCurrentBlock[4] === 'j') {
        block = ['0-1', '1-1', '2-1', '2-2'];
    } else if (nextCurrentBlock[4] === 't') {
        block = ['1-0', '1-1', '1-2', '2-1'];
    }

    drawItem(block, 4, 'currentBlock', 4, 4, nextDiv);
}

function drawItem(block, blockLength = 4, cssClass = 'currentBlock', row = yCount, col = xCount, cont = mainDiv){
    for (let i = 0; i < blockLength; i ++) {
        for (let j = 0; j < col * row; j ++) {
            let currentDiv = cont.children[j];
            let att = currentDiv.dataset.ij;

            if (att === block[i]) {
                currentDiv.classList.add(cssClass);
            } else if (cssClass !== 'fixed' && att !== block[0] && att !== block[1] && att !== block[2] && att !== block[3]) {
                currentDiv.classList.remove('currentBlock');
            }
        }
    }
    // if (cont !== nextDiv) showShadow();  !!!!!!!!!
}

//                               SHADOW!!!!!!!!!!!!!!!!

// function showShadow() {
//     let floorRow = yCount;
//     let distance;
//     let blockLeg = currentBlock[0].slice(0, currentBlock[0].indexOf('-'));
//     let changed = false;
//     let secondRound = false;
//     let shadow;
//     fixed = fixed.sort((a, b) => +b.slice(0, b.indexOf('-')) - +a.slice(0, a.indexOf('-'))); 

   
//     for (let j = 0; j < squareItems.length; j ++) {
//         squareItems[j].classList.remove('shadow');
//     }


//     for (let i = 0; i < 4; i ++) {
//         let column = currentBlock[i].slice(currentBlock[i].indexOf('-') + 1);
//         let row = currentBlock[i].slice(0, currentBlock[i].indexOf('-'));
//         blockLeg = !changed && +blockLeg < +row ? row : blockLeg;

//         if (secondRound) {
//             // squareItems[(+floorRow - 1) * xCount + +column].classList.add('ban');
//             squareItems[(+row + distance - 1) * xCount + +column].classList.add('shadow');
//          }

//         for (let j = 0; !secondRound && j < fixed.length; j ++) {
//             let fixedItemsArr = fixed[j].split('-');

//             if (+row > +fixedItemsArr[0]) continue;

//             if (fixedItemsArr[1] === column && +fixedItemsArr[0] < +floorRow) {
//                 floorRow = fixedItemsArr[0];
//                // blockLeg = row;
//                // changed = true;
//             }
//         }
        
//         if (i === 3 && !secondRound) {
//             distance = +floorRow - blockLeg;
//             secondRound = true;
//             i = -1;
//         }

//     }
// }

let deletedRows = [];
let deletedItems = [];
function cleanLine() {
    for (let i = 0; i < yCount; i ++) {
        let count = 0;

        for (let j = i * xCount; j < (i + 1) * xCount; j ++) {
            if (squareItems[j].classList.contains('fixed')) count ++;
        }

        if (count === xCount) { 
            deletedRows.push(i);

            for (let j = i * xCount; j < (i + 1) * xCount; j ++) {
                fixed = fixed.filter(function(item) {
                    return item !== squareItems[j].dataset.ij;
                });

                squareItems[j].classList.remove('fixed');
            }

            delLines ++;
            points.innerText = delLines * (levSel.selectedIndex + 1);
            if (+points.innerText > best) {
                best = points.innerText;
                document.getElementById('best').innerText = best;
            }

            moveDownAfterClean();
        }
    }
}

function moveDownAfterClean() {
    let fixedItems = document.getElementsByClassName('fixed');

    for (let i = 0; i < deletedRows.length; i ++) {
        fixed = fixed.filter(item => item.slice(0, item.indexOf('-')) > deletedRows[i]);

        for (let j = fixedItems.length - 1; j >= 0; j --) {
            let itemArr = fixedItems[j].dataset.ij.split('-');
            let underItemIndex = xCount * (+itemArr[0] + 1) + +itemArr[1];

            if (itemArr[0] < deletedRows[i]) {
                fixed.push(squareItems[underItemIndex].dataset.ij);
                fixedItems[j].classList.remove('fixed');
           }
        }
    }

    deletedRows = [];
    drawItem(fixed, fixed.length, 'fixed');
}


function nextBlock() {
    let crrntBlock = document.getElementsByClassName('currentBlock');

    for (let i = 3; i >= 0; i --) {
        fixed.push(crrntBlock[i].dataset.ij);
        crrntBlock[i].classList.replace('currentBlock', 'fixed');
    }

    getCurrentBlock();
}


function isFixedBlock(dir) {
    for (let i = 0; i < 4; i ++) {
        let arr = currentBlock[i].split('-');
        
        switch(dir) {
            case 'down':
            arr[0] = `${+arr[0] + 1}`;
            let nextRow = arr.join('-');
            if (fixed.indexOf(nextRow) !== -1 && (arr[0] === '0' || arr[0] === '1')) {
                gameOver();
                return 'stop game';
            }

            if (fixed.indexOf(nextRow) !== -1) return true;
            break;

            case 'left':
            arr[1] = `${+arr[1] - 1}`;
            let leftColumn = arr.join('-');
            if (fixed.indexOf(leftColumn) !== -1) return true;
            break;

            case 'right':
            arr[1] = `${+arr[1] + 1}`;
            let rightColumn = arr.join('-');
            if (fixed.indexOf(rightColumn) !== -1) return true;
            break;
        }
    }
}

function drawNewCurrentBlock(block) {
    if (currentBlock[4] !== undefined) {
        block[4] = currentBlock[4];        // 'o', 's', 'z' blocks
    }

    currentBlock = block;
    drawItem(currentBlock);
    
}

function moveLeft() {
    if (isFixedBlock('left')) return false;   // for rotate check
    let block = [];

    for (let i = 0; i < 4; i ++) {
        let itemArr = currentBlock[i].split('-');
        if (itemArr[1] === '0') return;
        itemArr[1] = +itemArr[1] - 1;
        block[i] = itemArr.join('-');
    }

    drawNewCurrentBlock(block);
}

function moveRight() {
    if (isFixedBlock('right')) return false;
    let block = [];
    
    for (let i = 0; i < 4; i ++) {
        let itemArr = currentBlock[i].split('-');
        if (itemArr[1] === `${xCount - 1}`) return;
        itemArr[1] = +itemArr[1] + 1;
        block[i] = itemArr.join('-');
    }

    drawNewCurrentBlock(block);
}

function moveDown() {
    cleanLine();
    if (isFixedBlock('down') === 'stop game') return;
    if (isFixedBlock('down')) return nextBlock();

    for (let i = 0; i < 4; i ++) {
        let itemArr = currentBlock[i].split('-');
        if (+itemArr[0] === yCount - 1) return nextBlock();

        itemArr[0] = +itemArr[0] + 1;
        currentBlock[i] = itemArr.join('-');
    }

    drawItem(currentBlock);
}

let memory;
function rotate() {
    if (currentBlock[4] === 'o') return;
    let block = [currentBlock[0]];
    let o = currentBlock[0].split('-');    // center of rotation
    o[0] = +o[0];
    o[1] = +o[1];

    for (let i = 1; i < 4; i ++) {
        let iItem = currentBlock[i].split('-');
        iItem[0] = +iItem[0];
        iItem[1] = +iItem[1];

        if (iItem[0] === o[0]) {    // same row
            let a = iItem[1] - o[1];

            switch (a) {
                case -1:
                iItem[1] += 1;
                iItem[0] += 1;
                break;

                case -2:
                iItem[1] += 2;
                iItem[0] += 2;
                break;

                case 1:
                iItem[1] -= 1;
                iItem[0] -= 1;
                break;

                case 2:
                iItem[1] -= 2;
                iItem[0] -= 2;
                break;
            }
        } else if (iItem[1] === o[1]) {    // same column
            let a = iItem[0] - o[0];

            switch (a) {
                case -1:
                iItem[1] -= 1;
                iItem[0] += 1;
                break;

                case -2:
                iItem[1] -= 2;
                iItem[0] += 2;
                break;

                case 1:
                iItem[1] += 1;
                iItem[0] -= 1;
                break;

                case 2:
                iItem[1] += 2;
                iItem[0] -= 2;
                break;
            }
        } else {
            if (iItem[0] > o[0] && iItem[1] > o[1]) {
                iItem[0] -= 2;
            } else if (iItem[0] > o[0] && iItem[1] < o[1]) {
                iItem[1] += 2;
            } else if (iItem[0] < o[0] && iItem[1] < o[1]) {
                iItem[0] += 2;
            } else {            // if(iItem[0] < o[0] && iItem[1] > o[1])
                iItem[1] -= 2;
            }
        }

        if (iItem[0] < 0 || iItem[0] >= yCount) return;

        if (fixed.indexOf(iItem.join('-')) !== -1) {
            switch (memory) {
                case 'moved left':
                moveRight();
                memory = undefined;
                return;
                break;

                case '2nd moved left':
                moveRight();
                moveRight();
                memory = undefined;
                return;
                break;

                case 'moved right':
                moveLeft();
                memory = undefined;
                return;
                break;

                case '2nd moved right':
                moveLeft();
                moveLeft();
                memory = undefined;
                return;
                break;

                default:
                return;
            }
        }

        if(iItem[1] >= xCount) {
            if(moveLeft() === false) return;
            memory = memory === 'moved left' ? '2nd moved left' : 'moved left';
            return rotate();
        } else if (iItem[1] <= 0) {
            if (moveRight() === false) return;
            memory = memory === 'moved right' ? '2nd moved right' : 'moved right';
            return rotate();
        } else {
            block[i] = iItem.join('-');
        }
     }

    //                           'S', 'Z', CHANGE CENTER OF ROTATION

    // if (currentBlock[4] === 's' && o[1] === +block[2].slice(block[2].indexOf('-') + 1)) {
    //    // debugger
    //     let newRotCenter = block[2];
    //     block[2] = block[0];
    //     block[0] = newRotCenter;
    //     moveDown(block);
    // } else if (currentBlock[4] === 'z' && o[1] === +block[2].slice(block[2].indexOf('-') + 1)) {
    //     let newRotCenter = block[2];
    //     block[2] = block[0];
    //     block[0] = newRotCenter;
    //     moveDown(block);
    // }

    drawNewCurrentBlock(block);
}

function action(event) {
    switch (event.keyCode) {
        case 37:
        moveLeft();
        break;

        case 39:
        moveRight();
        break;

        case 40:
        moveDown();
        break;

        case 38:
        rotate();
        break;
    }
}


//                           KEYS

document.getElementById('go').addEventListener('click', go);

function go() {
    if (fixed.length) {
        for (let i = 0; i < squareItems.length; i ++) {
            squareItems[i].classList.remove('fixed');
        }
        fixed = [];
    }

    document.addEventListener('keydown', action);
    delLines = 0;
    points.innerText = 0;

    getCurrentBlock();
    timeout = +levSel.value;
    document.getElementById('level').innerText = levSel.selectedIndex + 1;
    levSel.disabled = true;
    int = setInterval(moveDown, timeout);
    document.getElementById('goDiv').style.display = 'none';
    pause.addEventListener('click', pauseGame);
}

function startNewGame() {
    document.getElementById('gameOver').style.display = 'none';

    clearInterval(int);
    if (document.getElementsByClassName('paused').length) {
        pauseGame();
        startNewGame();
    }

    document.removeEventListener('keydown', action);
    pause.removeEventListener('click', pauseGame);
    document.getElementById('goDiv').style.display = 'inline';
    levSel.disabled = false;
    document.getElementById('go').addEventListener('click', go);
}

function pauseGame() {
    if (!document.getElementsByClassName('paused').length) {
        clearInterval(int);
        pause.innerText = 'play';
        pause.classList.add('paused');
    } else {
        int = setInterval(moveDown, timeout);
        pause.innerText = 'pause';
        pause.classList.remove('paused');
    }  
}

function gameOver() {
    clearInterval(int);
    document.getElementById('gameOver').style.display = 'inline';
    document.getElementById('newGame2').addEventListener('click', startNewGame);
    document.removeEventListener('keydown', action);
}