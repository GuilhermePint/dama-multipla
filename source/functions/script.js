function createGameInstance(gameContainerId) {

    var board = [
        /*[0, -1, 0, -1, 0, -1, 0, -1],
       [-1, 0, -1, 0, -1, 0, -1, 0],
       [0, -1, 0, -1, 0, -1, 0, -1],
       [0, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0],
       [1, 0, 1, 0, 1, 0, 1, 0],
       [0, 1, 0, 1, 0, 1, 0, 1],
       [1, 0, 1, 0, 1, 0, 1, 0],*/

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

    //variavel do jogador atual; 1 para jogador preto e -1 para jogador branco
    var currentPlayer = 1;


    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? -1 : 1;
    }

    function evaluate(board) {
        let whiteScore = 0;
        let blackScore = 0;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === 1) {
                    whiteScore++;
                } else if (board[i][j] === -1) {
                    blackScore++;
                }
            }
        }
        return whiteScore - blackScore;
    }

    function minimax(tempBoard, depth, maximizingPlayer) {
        if (depth === 0) {
            return evaluate(tempBoard);
        }

        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (let i = 0; i < tempBoard.length; i++) {
                for (let j = 0; j < tempBoard[i].length; j++) {
                    if (tempBoard[i][j] === -1 || tempBoard[i][j] === -2) {
                        let possibleMoves = getPossibleMoves(i, j);
                        for (let move of possibleMoves) {
                            let updatedBoard = updateSimulatedPosition(tempBoard, i, j, move.newRow, move.newColumn); // Corrigido aqui
                            let eval = minimax(updatedBoard, depth - 1, false);
                            maxEval = Math.max(maxEval, eval);
                        }
                    }
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let i = 0; i < tempBoard.length; i++) {
                for (let j = 0; j < tempBoard[i].length; j++) {
                    if (tempBoard[i][j] === 1 || tempBoard[i][j] === 2) { // Verifica se é uma peça branca ou dama branca
                        let possibleMoves = getPossibleMoves(i, j); // Obtém os movimentos possíveis para a peça branca
                        for (let move of possibleMoves) {
                            let updatedBoard = updateSimulatedPosition(tempBoard, i, j, move.newRow, move.newColumn); // Corrigido aqui
                            let eval = minimax(updatedBoard, depth - 1, true);
                            minEval = Math.min(minEval, eval);
                        }
                    }
                }
            }
            return minEval;
        }
    }

    function updateSimulatedPosition(tempBoard, oldRow, oldColumn, newRow, newColumn) {
        let clonedBoard = cloneBoard(tempBoard);
        clonedBoard[oldRow][oldColumn] = 0; // Remove a peça da posição antiga
        clonedBoard[newRow][newColumn] = tempBoard[oldRow][oldColumn]; // Coloca a peça na nova posição

        // Se houve uma captura, remove a peça capturada
        if (Math.abs(newRow - oldRow) === 2 && Math.abs(newColumn - oldColumn) === 2) {
            let capturedRow = (oldRow + newRow) / 2;
            let capturedColumn = (oldColumn + newColumn) / 2;
            clonedBoard[capturedRow][capturedColumn] = 0;
        }

        // Se a peça for uma dama, verificar e capturar peças em várias direções
        let piece = tempBoard[oldRow][oldColumn];
        if (piece === 2 || piece === -2) {
            for (let direction of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
                let newRowTemp = newRow + direction[0];
                let newColumnTemp = newColumn + direction[1];

                // Enquanto a nova posição estiver dentro dos limites do tabuleiro e a célula estiver vazia
                while (is_valid_move(newRowTemp, newColumnTemp) && clonedBoard[newRowTemp][newColumnTemp] === 0) {
                    newRowTemp += direction[0];
                    newColumnTemp += direction[1];
                }

                // Se a nova posição for válida e contiver uma peça adversária
                if (is_valid_move(newRowTemp, newColumnTemp) && clonedBoard[newRowTemp][newColumnTemp] !== piece && clonedBoard[newRowTemp][newColumnTemp] !== 0) {
                    // Verifica se a célula após a peça adversária está vazia para capturá-la
                    let newRowAfterCapture = newRowTemp + direction[0];
                    let newColumnAfterCapture = newColumnTemp + direction[1];
                    if (is_valid_move(newRowAfterCapture, newColumnAfterCapture) && clonedBoard[newRowAfterCapture][newColumnAfterCapture] === 0) {
                        clonedBoard[newRowTemp][newColumnTemp] = 0; // Remove a peça capturada
                    }
                }
            }
        }

        return clonedBoard;
    }


    function makeAIMove() {

        const gameContainer = document.getElementById(gameContainerId);

        const bestMove = getBestMove(board, currentPlayer);

        const currentPiece = gameContainer.querySelector(`.column[row="${bestMove.oldRow}"][column="${bestMove.oldColumn}"] .occupied`);
        selectedPiece = currentPiece
        selectedPiece.classList.add("selectedPiece");

        const target = gameContainer.querySelector(`.column[row="${bestMove.newRow}"][column="${bestMove.newColumn}"]`);

        updatePosition(target);

    }

    function getBestMove(board, player) {
        let bestMove = null;
        let bestScore = -Infinity;
        let depth = 5;

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === player || board[i][j] === player * 2) { // Considera tanto as peças regulares quanto as damas para o jogador atual
                    const possibleMoves = getPossibleMoves(i, j);

                    for (let move of possibleMoves) {
                        const simulatedBoard = updateSimulatedPosition(board, i, j, move.newRow, move.newColumn);
                        const score = minimax(simulatedBoard, depth, player === -1 ? false : true);

                        if (score > bestScore) {
                            bestScore = score;
                            bestMove = { oldRow: i, oldColumn: j, newRow: move.newRow, newColumn: move.newColumn };
                        }
                    }
                }
            }
        }

        return bestMove;
    }


    function makeAIMoveR() {
        makeAIMove();

        setTimeout(() => {
            switchPlayer();
            buildBoard(gameContainerId);
            checkVictory(board);

        }, 250);

    }

    function cloneBoard(board) {
        const clonedBoard = [];

        for (let i = 0; i < board.length; i++) {
            const newRow = [];

            for (let j = 0; j < board[i].length; j++) {
                newRow.push(board[i][j]);
            }
            clonedBoard.push(newRow);
        }

        // Retorna a matriz de cópia
        return clonedBoard;
    }

    /**
     * Verifica a cor de uma peça representada por um elemento HTML.
     * 
     * @param {HTMLElement} piece - O elemento HTML que representa a peça do jogo.
     * @returns {number|undefined} Retorna 1 se a peça é preta, 0 se a peça é branca, retorna 2 se for uma dama preta, retorna 3 se for dama branca, ou undefined se não for possível determinar a cor.
     */
    function checkColor(piece) {

        if (piece.classList.contains("blackPiece")) {
            return 1
        } else if (piece.classList.contains("whitePiece")) {
            return 0
        }
        else if (piece.classList.contains("whiteQueenPiece")) {
            return 3
        }
        else if (piece.classList.contains("blackQueenPiece")) {
            return 2
        }
    }

    function buildBoard(gameContainerId) {
        const game = document.getElementById(gameContainerId);
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
                } else if (board[i][j] === 2) {
                    occupied = "whiteQueenPiece";
                } else if (board[i][j] === -1) {
                    occupied = "blackPiece";
                } else if (board[i][j] === -2) {
                    occupied = "blackQueenPiece";
                } else {
                    occupied = "empty";
                }

                piece.setAttribute("class", `occupied ${occupied}`);
                piece.setAttribute("row", i.toString());
                piece.setAttribute("column", j.toString());
                piece.setAttribute("data-position", `${i}-${j}`);


                col.appendChild(piece);
                col.setAttribute("class", `column ${caseType}`);
                col.setAttribute("row", i.toString());
                col.setAttribute("column", j.toString());
                col.setAttribute("data-position", `${i}-${j}`);
                col.addEventListener("click", (e) => movePiece(e, gameContainerId));
                row.appendChild(col);
            }

            game.appendChild(row);
        }
    }

    selectedPiece = null
    selectedOther = null

    function movePiece(e, gameContainerId) {
        var cell = e.target;
        var row = parseInt(cell.getAttribute("row"));
        var column = parseInt(cell.getAttribute("column"));


        if (
            (cell.classList.contains("blackPiece") && currentPlayer === 1) ||
            (cell.classList.contains("blackQueenPiece") && currentPlayer === 1) ||
            (cell.classList.contains("whitePiece") && currentPlayer === -1) ||
            (cell.classList.contains("whiteQueenPiece") && currentPlayer === -1)
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
                    // Seleciona a célula dentro do contêiner de jogo específico usando o gameContainerId
                    var newCell = document.querySelector(`#${gameContainerId} .column[row="${move.newRow}"][column="${move.newColumn}"]`);
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
                    buildBoard(gameContainerId);
                    checkVictory(board);

                    makeAIMoveR();
                    switchPlayer();
                }
            }
        }
    }

    function is_valid_move(row, column) {
        let numColumns = board[0].length;
        return row >= 0 && row < numColumns && column >= 0 && column < numColumns;
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
                if (board[row + 1][column + 1] === 1 || board[row + 1][column + 1] === 2) {
                    if (is_valid_move(row + 2, column + 2) && board[row + 2][column + 2] === 0) {
                        possibleMoves.push({ newRow: row + 2, newColumn: column + 2 });
                    }
                }
                if (board[row + 1][column - 1] === 1 || board[row + 1][column - 1] === 2) {
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
                if (board[row - 1][column + 1] === -1 || board[row - 1][column + 1] === -2) {
                    if (is_valid_move(row - 2, column + 2) && board[row - 2][column + 2] === 0) {
                        possibleMoves.push({ newRow: row - 2, newColumn: column + 2 });
                    }
                }
                if (board[row - 1][column - 1] === -1 || board[row - 1][column + 1] === -2) {
                    if (is_valid_move(row - 2, column - 2) && board[row - 2][column - 2] === 0) {
                        possibleMoves.push({ newRow: row - 2, newColumn: column - 2 });
                    }
                }
            }
        } else if (piece === 2 || piece === -2) {

            for (let direction of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
                let newRow = row + direction[0];
                let newColumn = column + direction[1];

                while (is_valid_move(newRow, newColumn) && board[newRow][newColumn] === 0) {
                    possibleMoves.push({ newRow: newRow, newColumn: newColumn });
                    newRow += direction[0];
                    newColumn += direction[1];
                }

                if (is_valid_move(newRow, newColumn) && board[newRow][newColumn] !== piece && board[newRow][newColumn] !== 0) {
                    if (is_valid_move(newRow + direction[0], newColumn + direction[1]) && board[newRow + direction[0]][newColumn + direction[1]] === 0) {
                        possibleMoves.push({ newRow: newRow + direction[0], newColumn: newColumn + direction[1] });
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

        if (checkColor(selectedPiece) === 1) {
            board[newPosition[0]][newPosition[1]] = -1

            if (newPosition[0] === board.length - 1) {
                board[newPosition[0]][newPosition[1]] = -2; // Representa um Rei
            }

            if (Math.abs(newPosition[0] - oldPosition[0]) === 2 && Math.abs(newPosition[1] - oldPosition[1]) === 2) {
                let capturedRow = (oldPosition[0] + newPosition[0]) / 2;
                let capturedColumn = (oldPosition[1] + newPosition[1]) / 2;
                board[capturedRow][capturedColumn] = 0;
            }

        } else if (checkColor(selectedPiece) === 0) {
            board[newPosition[0]][newPosition[1]] = 1

            if (newPosition[0] === 0) {
                board[newPosition[0]][newPosition[1]] = 2; // Representa um Rei
            }

            if (Math.abs(newPosition[0] - oldPosition[0]) === 2 && Math.abs(newPosition[1] - oldPosition[1]) === 2) {
                let capturedRow = (oldPosition[0] + newPosition[0]) / 2;
                let capturedColumn = (oldPosition[1] + newPosition[1]) / 2;
                board[capturedRow][capturedColumn] = 0;
            }

        } else if (checkColor(selectedPiece) === 2 || checkColor(selectedPiece) === 3) {

            if (checkColor(selectedPiece) === 2) {
                board[newPosition[0]][newPosition[1]] = -2;
            } else if (checkColor(selectedPiece) === 3) {
                board[newPosition[0]][newPosition[1]] = 2;
            }

            if (Math.abs(newPosition[0] - oldPosition[0]) > 1 || Math.abs(newPosition[1] - oldPosition[1]) > 1) {
                for (let i = 1; i < Math.abs(newPosition[0] - oldPosition[0]); i++) {
                    let capturedRow = oldPosition[0] + i * (newPosition[0] - oldPosition[0]) / Math.abs(newPosition[0] - oldPosition[0]);
                    let capturedColumn = oldPosition[1] + i * (newPosition[1] - oldPosition[1]) / Math.abs(newPosition[1] - oldPosition[1]);
                    board[capturedRow][capturedColumn] = 0;
                }
            }
        }
        selectedPiece.setAttribute("data-position", `${newPosition[0]}-${newPosition[1]}`);

    }

    function checkVictory(board) {
        let whiteScore = 0;
        let blackScore = 0;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === 1 || board[i][j] === 2) {
                    whiteScore++;
                } else if (board[i][j] === -1 || board[i][j] === -2) {
                    blackScore++;
                }
            }
        }

        {
            if (blackScore === 2) {
                alert("Peça branca venceu!");
                currentPlayer = 1;
                resetGame();
                return true;
            } else if (whiteScore === 2) {
                alert("Peça preta venceu!");
                currentPlayer = 1;
                resetGame();
                return true;
            } else {
                return false; // Nenhum vencedor ainda
            }

        }
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
             [1, 0, 1, 0, 1, 0, 1, 0],*/

            [0, -1, 0, -1, 0, -1],
            [-1, 0, -1, 0, -1, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0]
        ];

        buildBoard(gameContainerId);
    }
    buildBoard(gameContainerId);
}


