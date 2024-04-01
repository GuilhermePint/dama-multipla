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

function movePiece(e) {
    var piece = e.target;

    if (!selectedPiece && piece.classList.contains("occupied")) {
        selectedPiece = piece
        selectedPiece.classList.add("selectedPiece");
    }

    if (piece.classList.contains("occupied")) {
        console.log("Clicou na peça!", piece.dataset.position);
    } else {
        console.log("Clicou no tabuleiro!", piece.dataset.position)
    }
    // console.log(board)
}
buildBoard();
