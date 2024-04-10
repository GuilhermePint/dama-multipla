

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

function initAboutUs() {
    var about = document.getElementById("about");
    setTimeout(() => {
        about.style.opacity = '1'
    }, 750);
}

function homePage() {
    window.location.href = "index.html";
}

var modal = document.getElementById("myModal");

var modalText = document.getElementById("modal-text");

function openModal(text) {
    modalText.textContent = text;
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

