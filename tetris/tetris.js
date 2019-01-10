const xCount = 20;
const yCount = 27;

const mainDiv = document.getElementById('mainContainer');
const nextDiv = document.getElementById('nextContainer');

let int;
let timeout = 1000;

let delLines = 0;
let level = 1;

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
   // if (!nextCurrentBlock) return;
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

document.getElementById('go').addEventListener('click', go);

function go() {
    getCurrentBlock();
    int = setInterval(moveDown, timeout);
    document.getElementById('go').removeEventListener('click', go);
    document.getElementById('go').style.display = 'none';
    document.getElementById('pause').addEventListener('click', pause);
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
    // if (cont !== nextDiv) showShadow();
}

//                               SHADOW!!!!!
// function showShadow() {
//     const squareItem = document.getElementById('mainContainer').getElementsByClassName('squareItem');
//     let floorRow = yCount;
//     let distance;
//     let blockLeg = currentBlock[0].slice(0, currentBlock[0].indexOf('-'));
//     let changed = false;
//     let secondRound = false;
//     let shadow;
//     fixed = fixed.sort((a, b) => +b.slice(0, b.indexOf('-')) - +a.slice(0, a.indexOf('-'))); 

   
//     for (let j = 0; j < squareItem.length; j ++) {
//         squareItem[j].classList.remove('shadow');
//     }


//     for (let i = 0; i < 4; i ++) {
//         let column = currentBlock[i].slice(currentBlock[i].indexOf('-') + 1);
//         let row = currentBlock[i].slice(0, currentBlock[i].indexOf('-'));
//         blockLeg = !changed && +blockLeg < +row ? row : blockLeg;

//         if (secondRound) {
//             // squareItem[(+floorRow - 1) * xCount + +column].classList.add('ban');
//             squareItem[(+row + distance - 1) * xCount + +column].classList.add('shadow');
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
    let items = document.getElementsByClassName('squareItem');
    let fixedItems = document.getElementsByClassName('fixed');

    for (let i = 0; i < yCount; i ++) {
        let count = 0;

        for (let j = i * xCount; j < (i + 1) * xCount; j ++) {
            if (items[j].classList.contains('fixed')) count ++;
        }

        if (count === xCount) { 
            deletedRows.push(i);

            for (let j = i * xCount; j < (i + 1) * xCount; j ++) {
                fixed = fixed.filter(function(item) {
                    return item !== items[j].dataset.ij;
                });

                items[j].classList.remove('fixed');
            }

            delLines ++;
            if (delLines % 2 === 0) passNewLevel();
            document.getElementById('lines').innerText = `${delLines}`;
            moveDownAfterClean();
        }
    }

   
}


function passNewLevel() {
    level ++;
    document.getElementById('level').innerText = level;
    clearInterval(int);
    timeout -= 100;  // 20%
    int = setInterval(moveDown, timeout);
}


function moveDownAfterClean() {
    
    let fixedItems = document.getElementsByClassName('fixed');
    let squareItem = document.getElementsByClassName('squareItem');
  //  fixed = [];

    for (let i = 0; i < deletedRows.length; i ++) {
        fixed = fixed.filter(item => item.slice(0, item.indexOf('-')) > deletedRows[i]);

        for (let j = fixedItems.length - 1; j >= 0; j --) {
        
            let itemArr = fixedItems[j].dataset.ij.split('-');
            let underItemIndex = xCount * (+itemArr[0] + 1) + +itemArr[1];

            if (itemArr[0] < deletedRows[i]) {
                // if (squareItem[underItemIndex].classList.contains('fixed')) {
                //     fixed.push(squareItem[underItemIndex].dataset.ij);
                //     continue;
                // }
                // squareItem[underItemIndex].classList.add('fixed');

                fixed.push(squareItem[underItemIndex].dataset.ij);
                fixedItems[j].classList.remove('fixed');
           }
        }
    }

    deletedRows = [];

    drawItem(fixed, fixed.length, 'fixed');

    // for (let i = 0; i < fixedItems.length; i ++) {
    //     for (let j = 0; j < fixed.length; j ++) {
    //         if (fixedItems[i].dataset.ij !== fixed)
    //     }
    // }

    // fixed.forEach(function(item) {
    //     for (let i = 0; i < squareItem.length; i ++) {
    //         if (squareItem[i].dataset.ij)
    //     }
    // })


   // cleanLine();
}


function nextBlock() {

    let crrntBlock = document.getElementsByClassName('currentBlock');

    for (let i = 3; i >= 0; i --) {
        fixed.push(crrntBlock[i].dataset.ij);
        crrntBlock[i].classList.replace('currentBlock', 'fixed');
    }

    getCurrentBlock();

}

// function checkPositionForMove() {
//     let bool = false;

//     for (let i = 1; i < 4; i ++) {
//         let column = +currentBlock[i].slice(currentBlock[i].indexOf('-') + 1);
//         let row = +currentBlock[i].slice(0, currentBlock[i].indexOf('-'));

//     }
// }

// function checkPositionForRotate() {
//     let oRow = currentBlock[0].slice(0, currentBlock[0].indexOf('-'));
//     let oColumn = currentBlock[0].slice(currentBlock[0].indexOf('-') + 1);

//     if (oColumn === `${xCount - 1}`) {
//         moveLeft();
//     }
// }


// function checkFloor() {
//     //debugger;
//     let floorClass = document.getElementsByClassName('floor');

//     for (let i = 0; i < 4; i ++) {
//         let item = currentBlock[i].split('-');

//         for (let j = 0; j < floorClass.length; j ++) {
//             let data = floorClass[j].getAttribute('data-ij');
//             let floorRow = data.slice(0, data.indexOf('-'));
//             let floorColumn = data.slice(data.indexOf('-') + 1);
    
//             if (floorRow - item[0] === 1 && item[1] === floorColumn) return true;
//         }

//         if (+item[0] === yCount - 1) return true;
//     }
// }

// function checkWall() {
//     let floorClass = document.getElementsByClassName('floor');

//     for (let i = 0; i < 4; i ++) {
//         let item = currentBlock[i].split('-');

//         for (let j = 0; j < floorClass.length; j ++) {
//             let data = floorClass[j].getAttribute('data-ij');
//             let floorRow = data.slice(0, data.indexOf('-'));
//             let floorColumn = data.slice(data.indexOf('-') + 1);
    
//             if (floorColumn - item[1])) return true;
//         }
// }

// function checkFloorAndWalls(action, forRotRow, forRotCol) {
//     let floorClass = document.getElementsByClassName('floor');

//     for (let i = 0; i < 4; i ++) {
//         let item = currentBlock[i].split('-');

//         for (let j = 0; j < floorClass.length; j ++) {
//             let data = floorClass[j].getAttribute('data-ij');
//             let floorRow = data.slice(0, data.indexOf('-'));
//             let floorColumn = data.slice(data.indexOf('-') + 1);

//             switch(action) {
//                 case 'md':   // move down
//                 if (floorRow - item[0] === 1 && item[1] === floorColumn) return true;
//                 break;

//                 case 'ml':   // move left
//                 if (item[1] - floorColumn === 1 && item[0] === floorRow) return true;
//                 break;

//                 case 'mr':   // move right
//                 if (floorColumn - item[1] === 1 && item[0] === floorRow) return true;
//                 break;

//                 case 'r':   // rotate, move left
//                 if (forRotRow === +floorRow && forRotCol === +floorColumn) return true;
//                 break;

//                 // case 'rr':   // rotate, move right
//                 // if (forRotRow === +floorRow && forRotCol === +floorColumn) return true;
//                 // break;
//             }
//         }

//         if (+item[0] === yCount - 1) return true;

//     }
// }


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

function moveLeft() {      // x
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

function moveRight() {    // x 
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

        let rotCentCol = +currentBlock[0].slice(currentBlock[0].indexOf('-') + 1);
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
            // if (memory === 'moved left') {
            //     moveRight();
            //     memory = undefined;
            //     return;
            // } else if (memory === 'moved right') {
            //     moveLeft();
            //     memory = undefined;
            //     return;
            // } else {
            //     return;
            // }
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
       // debugger
        // ??????????????????????????????????????????????????????????????????????????????????????????????????????
    //     if (iItem[1] >= xCount || (fixed.indexOf(iItem.join('-')) !== -1 && iItem[1] > rotCentCol)) {
    //      //  debugger
    //         // if (memory === 'moved right') {
    //         //     moveLeft();
    //         //     memory = undefined;
    //         //     return;
    //         // } else if (memory === '2nd moved right') {
    //         //     moveLeft();
    //         //     memory = undefined;
    //         //     return;
    //         // } else if (memory === 'moved left') {
    //         //     memory = '2nd moved left';
    //         // } else if (memory !== '2nd moved left') {
    //         //     memory = 'moved left';
    //         // }

    //          if (moveLeft() === false) return;
    //         return rotate();
    //        // return;
    //     } else if (iItem[1] <= 0 || (fixed.indexOf(iItem.join('-')) !== -1 && iItem[1] < rotCentCol)) {
    //         // if (memory === 'moved left') {
    //         //     moveRight();
    //         //     memory = undefined;
    //         //     return;
    //         // } else if (memory === '2nd moved left') {
    //         //     moveRight();
    //         //     memory = undefined;
    //         //     return;
    //         // } else if (memory === 'moved right') {
    //         //     memory = '2nd moved right';
    //         // } else if (memory !== '2nd moved right') {
    //         //     memory = 'moved right';

    //         // }

    //          if (moveRight() === false) return;
    //          return rotate();
    //      //   return;
    //     } else {
    //         block[i] = iItem.join('-');
    //         memory = undefined;
    //     }


     }

    //              'S', 'Z', CHANGE CENTER OF ROTATION

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

document.addEventListener('keydown', action);


function action() {
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

function pause() {
    if (!document.getElementsByClassName('paused').length) {
        clearInterval(int);
        document.getElementById('pause').innerText = 'play';
    } else {
        int = setInterval(moveDown, timeout);
        document.getElementById('pause').innerText = 'pause';
    }

    document.getElementById('pause').classList.toggle('paused');
}


function gameOver() {
    clearInterval(int);
    alert('game over');
}