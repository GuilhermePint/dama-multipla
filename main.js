

var iniciarJogo = document.getElementById("initGame");
iniciarJogo.addEventListener("click", initGame);

var header = document.getElementById("header");

var mainPage = document.getElementById("mainPage");
var resetButton = document.getElementById("resetButton");

function initGame() {
    createGameInstance("game1");
    createGameInstance("game2");
    mainPage.classList.remove("hidden");
    mainPage.classList.add("page");

    const cls = ["button-6", "animat"]

    resetButton.classList.replace("hidden", ...cls);


    iniciarJogo.classList.replace("button-6", "hidden")

    setTimeout(() => {
        header.classList.replace("headerPre", "headerPos");
    }, 100);

    setTimeout(() => {
        resetButton.style.opacity = '1';
        resetButton.style.marginTop = '15px';
    }, 2000);
}

function aboutUs() {
    window.location.href = "about.html";
}
function homePage() {
    window.location.href = "index.html";
}


