

var iniciarJogo = document.getElementById("initGame");
iniciarJogo.addEventListener("click", initGame);

var mainPage = document.getElementById("mainPage");
var resetButton = document.getElementById("resetButton");

async function initGame() {
    createGameInstance("game1");
    createGameInstance("game2");
    mainPage.classList.remove("hidden");
    mainPage.classList.add("page");

    resetButton.classList.remove("hidden");
    resetButton.classList.add("button-6");
    resetButton.classList.add("animat");

    iniciarJogo.classList.remove("bitt")
    iniciarJogo.classList.add("hidden")

}

