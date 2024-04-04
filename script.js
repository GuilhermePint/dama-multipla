var board = [
    /* [0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0], */

    [0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0]
];

//resetar jogo
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", resetGame);

var currentPlayer = 1;

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? -1 : 1;
}

/**
 * Verifica a cor de uma peça representada por um elemento HTML.
 * 
 * @param {HTMLElement} piece - O elemento HTML que representa a peça do jogo.
 * @returns {number|undefined} Retorna 1 se a peça é preta, 0 se a peça é branca, ou undefined se não for possível determinar a cor.
 */
function checkColor(piece) {

    if (piece.classList.contains("blackPiece")) {
        return 1
    } else if (piece.classList.contains("whitePiece")) {
        return 0
    }
}

function buildBoard() {
    const game = document.getElementById("game");
    game.innerHTML = "";

    for (let i = 0; i < board.length; i++) {
        const row = document.createElement("div");
        row.setAttribute("class", "row");

        for (let j = 0; j < board[i].length; j++) {
            const col = document.createElement("div");
            const piece = document.createElement("div");

            // Determine case type (white or black)
            const caseType = (i % 2 === j % 2) ? "Whitecase" : "blackCase";

            // Set piece class based on board value
            let occupied = "";
            if (board[i][j] === 1) {
                occupied = "whitePiece";
            } else if (board[i][j] === -1) {
                occupied = "blackPiece";
            } else {
                occupied = "empty";
            }

            piece.setAttribute("class", `occupied ${occupied}`);
            piece.setAttribute("row", i.toString());
            piece.setAttribute("column", j.toString());
            piece.setAttribute("data-position", `${i}-${j}`);

            // Removemos o evento de clique da peça
            // piece.addEventListener("click", movePiece);

            col.appendChild(piece);
            col.setAttribute("class", `column ${caseType}`);
            // Adicionamos o evento de clique à célula do tabuleiro
            col.setAttribute("row", i.toString());
            col.setAttribute("column", j.toString());
            col.setAttribute("data-position", `${i}-${j}`);
            col.addEventListener("click", movePiece);
            row.appendChild(col);
        }

        game.appendChild(row);
    }
}

selectedPiece = null
selectedOther = null

function movePiece(e) {
    var cell = e.target;
    var row = parseInt(cell.getAttribute("row"));
    var column = parseInt(cell.getAttribute("column"));

    if (
        (cell.classList.contains("blackPiece") && currentPlayer === 1) ||
        (cell.classList.contains("whitePiece") && currentPlayer === -1)
    ) {

        // Verifica se a peça clicada é a mesma que foi selecionada anteriormente
        if (selectedPiece === cell) {
            // Remove a seleção da peça
            selectedPiece.classList.remove("selectedPiece");
            selectedPiece = null;
            removePossibleMoves();
        } else {
            // Remove a seleção da peça anteriormente selecionada (se houver)
            if (selectedPiece !== null) {
                selectedPiece.classList.remove("selectedPiece");
                removePossibleMoves();
            }
            // Seleciona a peça clicada
            selectedPiece = cell;
            selectedPiece.classList.add("selectedPiece");

            // Obtém as possíveis jogadas para a peça selecionada
            var possibleMoves = getPossibleMoves(row, column);

            // Destaca as células correspondentes às possíveis jogadas
            possibleMoves.forEach(move => {
                var newCell = document.querySelector(`.column[row="${move.newRow}"][column="${move.newColumn}"]`);
                newCell.classList.add("possibleMove");
            });
        }
    } else {
        // Se clicou em uma célula vazia, move a peça para essa célula (se houver uma peça selecionada)
        if (selectedPiece !== null) {

            //checa se o movimento é valido
            if (checkMove(cell)) {
                updatePosition(cell);
                // Remove a seleção da peça e das possíveis jogadas
                selectedPiece.classList.remove("selectedPiece");
                selectedPiece = null;
                removePossibleMoves();
                buildBoard();

                switchPlayer();
            }
        }
    }
}


function is_valid_move(row, column) {

    return row >= 0 && row < 6 && column >= 0 && column < 6;
}

/**
 * Obtém as possíveis jogadas para uma peça em uma posição específica do tabuleiro.
 * 
 * @param {number} row - O índice da linha onde a peça está localizada.
 * @param {number} column - O índice da coluna onde a peça está localizada.
 * @returns {Array} Um array contendo objetos representando as coordenadas das possíveis jogadas.
 */
function getPossibleMoves(row, column) {
    // Array para armazenar as possíveis jogadas
    let possibleMoves = [];

    // Verifica se a peça é uma peça branca ou preta
    let piece = board[row][column];
    if (piece === 1 || piece === -1) {
        if (piece === -1) {
            if (is_valid_move(row + 1, column + 1) && board[row + 1][column + 1] === 0) {
                possibleMoves.push({ newRow: row + 1, newColumn: column + 1 });
            }
            if (is_valid_move(row + 1, column - 1) && board[row + 1][column - 1] === 0) {
                possibleMoves.push({ newRow: row + 1, newColumn: column - 1 });
            }
            if (board[row + 1][column + 1] === 1) {
                if (is_valid_move(row + 2, column + 2) && board[row + 2][column + 2] === 0) {
                    possibleMoves.push({ newRow: row + 2, newColumn: column + 2 });
                }
            }
            if (board[row + 1][column - 1] === 1) {
                if (is_valid_move(row + 2, column - 2) && board[row + 2][column - 2] === 0) {
                    possibleMoves.push({ newRow: row + 2, newColumn: column - 2 });
                }
            }
        } else if (piece === 1) {
            if (is_valid_move(row - 1, column + 1) && board[row - 1][column + 1] === 0) {
                possibleMoves.push({ newRow: row - 1, newColumn: column + 1 });
            }
            if (is_valid_move(row - 1, column - 1) && board[row - 1][column - 1] === 0) {
                possibleMoves.push({ newRow: row - 1, newColumn: column - 1 });
            }
            if (board[row - 1][column + 1] === -1) {
                if (is_valid_move(row - 2, column + 2) && board[row - 2][column + 2] === 0) {
                    possibleMoves.push({ newRow: row - 2, newColumn: column + 2 });
                }
            }
            if (board[row - 1][column - 1] === -1) {
                if (is_valid_move(row - 2, column - 2) && board[row - 2][column - 2] === 0) {
                    possibleMoves.push({ newRow: row - 2, newColumn: column - 2 });
                }
            }
        }
    }
    return possibleMoves;
}


function checkMove(target) {
    let oldPosition = getPosition(selectedPiece);
    let targetPosition = getPosition(target);
    let possibleMoves = getPossibleMoves(oldPosition[0], oldPosition[1]);

    if (checkColor(selectedPiece)) {
        if (board[targetPosition[0]][targetPosition[1]] === (1 || -1)) {
            return false
        } else {
            for (let i = 0; i < possibleMoves.length; i++) {
                if (possibleMoves[i].newRow === targetPosition[0] && possibleMoves[i].newColumn === targetPosition[1]) {
                    return true;
                }
            }
            return false
        }

    } else {
        if (board[targetPosition[0]][targetPosition[1]] === (1 || -1)) {
            return false
        } else {
            for (let i = 0; i < possibleMoves.length; i++) {
                if (possibleMoves[i].newRow === targetPosition[0] && possibleMoves[i].newColumn === targetPosition[1]) {
                    return true;
                }
            }
            return false
        }
    }
}

function getPosition(e) {
    e_split = e.dataset.position.split("-");
    let ePosition;
    return ePosition = [parseInt(e_split[0]), parseInt(e_split[1])];
}

function updatePosition(target) {
    let oldPosition = getPosition(selectedPiece)
    let newPosition = getPosition(target)

    board[oldPosition[0]][oldPosition[1]] = 0

    if (checkColor(selectedPiece)) {
        board[newPosition[0]][newPosition[1]] = -1
        if (Math.abs(newPosition[0] - oldPosition[0]) === 2 && Math.abs(newPosition[1] - oldPosition[1]) === 2) {
            let capturedRow = (oldPosition[0] + newPosition[0]) / 2;
            let capturedColumn = (oldPosition[1] + newPosition[1]) / 2;
            board[capturedRow][capturedColumn] = 0;
        }
    } else {
        board[newPosition[0]][newPosition[1]] = 1

        if (Math.abs(newPosition[0] - oldPosition[0]) === 2 && Math.abs(newPosition[1] - oldPosition[1]) === 2) {
            let capturedRow = (oldPosition[0] + newPosition[0]) / 2;
            let capturedColumn = (oldPosition[1] + newPosition[1]) / 2;
            board[capturedRow][capturedColumn] = 0;
        }
    }

    selectedPiece.setAttribute("data-position", `${newPosition[0]}-${newPosition[1]}`);

}

function removePossibleMoves() {
    document.querySelectorAll(".possibleMove").forEach(move => {
        move.classList.remove("possibleMove");
    });
}

function resetGame() {
    board = [
        /* [0, -1, 0, -1, 0, -1, 0, -1],
        [-1, 0, -1, 0, -1, 0, -1, 0],
        [0, -1, 0, -1, 0, -1, 0, -1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0], */

        [0, -1, 0, -1, 0, -1],
        [-1, 0, -1, 0, -1, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0]
    ];

    buildBoard();
}


buildBoard();

