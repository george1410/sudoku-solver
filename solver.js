const container = document.querySelector('.grid-container');
var board, mask;
var pos = 0;
var xpos = 0;
var ypos = 0;

reset();

function reset() {
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            let el = document.createElement('div');
            el.appendChild(document.createElement('input'));
            if (i == 2 || i == 5) {
                el.classList.add('border-bottom');
            }
            if (j == 2 || j == 5) {
                el.classList.add('border-right');
            }
            container.appendChild(el);
        }
    }

    board = new Array(9);
    mask = new Array(9);
    for (i = 0; i < board.length; i++) {
        board[i] = new Array(9);
        mask[i] = new Array(9);
        for (j = 0; j < board[i].length; j++) {
            board[i][j] = 0;
            mask[i][j] = 0;
        }
    }
}

document.querySelector('#resetButton').onclick = reset;

document.querySelector('#solveButton').onclick = () => {
    let count = 0;
    let node = container.firstChild;
    while(node) {
        let x = Math.floor(count/9);
        let y = count % 9;
        if (node.firstChild.value) {
            board[x][y] = node.firstChild.value;
            mask[x][y] = node.firstChild.value;
        }
        node = node.nextSibling;
        count++;
    }
    solve();
}

function solve() {
    while (pos < 81) {
        if (mask[xpos][ypos] == 0) {
            board[xpos][ypos]++;
            if (board[xpos][ypos] > 9) {
                board[xpos][ypos] = 0;
                prevPos();
            } else {
                if (isValid()) {
                    nextPos();
                }
            }
        } else {
            nextPos();
        }
    }

    fillUI();
}

function nextPos() {
    pos++;
    xpos = Math.floor(pos/9);
    ypos = pos % 9;
}

function prevPos() {
    pos--;
    xpos = Math.floor(pos/9);
    ypos = pos % 9;
    if (mask[xpos][ypos] != 0) {
        prevPos();
    }
}

function isValid() {
    let subx;
    let suby;
    // work out current subgrid
    if (xpos < 3) {
        subx = 0
    } else if (xpos < 6) {
        subx = 3
    } else {
        subx = 6
    }

    if (ypos < 3) {
        suby = 0
    } else if (ypos < 6) {
        suby = 3
    } else {
        suby = 6
    }

    // check subgrids for validity
    for (i = subx; i < subx + 3; i++) {
        for (j = suby; j < suby + 3; j++) {
            if (board[xpos][ypos] == board[i][j] && i != xpos && j != ypos) {
                return false;
            }
        }
    }

    // check rows and columns for validity
    for (i = 0; i < 9; i++) {
        if ((board[xpos][ypos] == board[i][ypos] && xpos != i) || (board[xpos][ypos] == board[xpos][i] && ypos != i)) {
            return false;
        }
    }
    return true;
}

function fillUI() {
    let count = 0;
    let node = container.firstChild;
    node.firstChild.setAttribute('disabled', 'true');
    while(node) {
        let x = Math.floor(count/9);
        let y = count % 9;
        node.firstChild.value = board[x][y]
        node = node.nextSibling;
        count++;
    }
}