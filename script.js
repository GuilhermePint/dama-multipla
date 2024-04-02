var board = [
    [0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
];
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

    if (cell.classList.contains("occupied")) {
        // Verifica se a peça clicada é a mesma que foi selecionada anteriormente
        if (selectedPiece === cell) {
            // Remove a seleção da peça
            selectedPiece.classList.remove("selectedPiece");
            selectedPiece = null;
        } else {
            // Remove a seleção da peça anteriormente selecionada (se houver)
            if (selectedPiece !== null) {
                selectedPiece.classList.remove("selectedPiece");
            }
            // Seleciona a peça clicada
            selectedPiece = cell;
            selectedPiece.classList.add("selectedPiece");

            // Obtém as possíveis jogadas para a peça selecionada
            var possibleMoves = getPossibleMoves(row, column);

            // Destaca as células correspondentes às possíveis jogadas
            possibleMoves.forEach(move => {
                var newCell = document.querySelector(`.column[row='${move.newRow}'][column='${move.newColumn}']`);
                newCell.classList.add("possibleMove");
            });
        }
    } else {
        // Se clicou em uma célula vazia, move a peça para essa célula (se houver uma peça selecionada)
        if (selectedPiece !== null) {
            // Move a peça para a célula clicada
            selectedPiece.setAttribute("row", row.toString());
            selectedPiece.setAttribute("column", column.toString());
            cell.appendChild(selectedPiece);

            // Remove a seleção da peça e das possíveis jogadas
            selectedPiece.classList.remove("selectedPiece");
            selectedPiece = null;
            document.querySelectorAll(".possibleMove").forEach(move => {
                move.classList.remove("possibleMove");
            });
        }
    }
}

function getPossibleMoves(row, column) {
    // Array para armazenar as possíveis jogadas
    let possibleMoves = [];

    // Verifica se a peça é uma peça branca ou preta
    let piece = board[row][column];
    if (piece === 1 || piece === -1) {
        // Movimento básico para peças brancas (para baixo)
        if (piece === 1) {
            if (isValidMove(row + 1, column + 1)) {
                possibleMoves.push({ newRow: row + 1, newColumn: column + 1 });
            }
            if (isValidMove(row + 1, column - 1)) {
                possibleMoves.push({ newRow: row + 1, newColumn: column - 1 });
            }
        }
        // Movimento básico para peças pretas (para cima)
        else if (piece === -1) {
            if (isValidMove(row - 1, column + 1)) {
                possibleMoves.push({ newRow: row - 1, newColumn: column + 1 });
            }
            if (isValidMove(row - 1, column - 1)) {
                possibleMoves.push({ newRow: row - 1, newColumn: column - 1 });
            }
        }
    }

    return possibleMoves;
}

function isValidMove(row, column) {
    // Verifica se a posição está dentro do tabuleiro
    if (row >= 0 && row < 8 && column >= 0 && column < 8) {
        // Verifica se a posição está vazia
        if (board[row][column] === 0) {
            return true;
        }
    }
    return false;
}



buildBoard();
