let answer = "";
let continent = "";

const rows = 6;
let cols = 0;

let currentRow = 0;
let currentCol = 0;

let board = [];

/* ---------------- KEYBOARD ---------------- */
const keyboardLayout = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["ENTER","Z","X","C","V","B","N","M","BACK"]
];

/* ---------------- NORMALIZE (NO ACCENTS / ONLY A-Z) ---------------- */
function normalize(text) {
    return text
        .toUpperCase()
        .replace(/[^A-Z]/g, ""); // removes accents, spaces, symbols
}

/* ---------------- START GAME ---------------- */
async function startGame() {

    currentRow = 0;
    currentCol = 0;
    board = [];

    document.getElementById("message").textContent = "";
    document.getElementById("winScreen")?.classList.add("hidden");

    const res = await fetch("https://geo-country-api.onrender.com/country");
    const data = await res.json();

    answer = normalize(data.country);
    continent = data.continent;

    cols = answer.length;

    document.getElementById("continent").textContent = continent;

    setBackground(continent);
    createBoard();
    createKeyboard();
}

/* ---------------- RESET FLOW ---------------- */
function resetGame() {
    document.getElementById("confirmModal").classList.remove("hidden");
}

function confirmReset(choice) {

    document.getElementById("confirmModal").classList.add("hidden");

    if (choice) {
        startGame();
    }
}

/* ---------------- BACKGROUND ---------------- */
function setBackground(continent) {

    document.body.className = "";

    const c = continent.toLowerCase().replace(" ", "-");

    document.body.classList.add(c);
}

/* ---------------- BOARD ---------------- */
function createBoard() {

    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";

    board = [];

    for (let r = 0; r < rows; r++) {

        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        let row = [];

        for (let c = 0; c < cols; c++) {

            const tile = document.createElement("div");
            tile.classList.add("tile");

            rowDiv.appendChild(tile);
            row.push(tile);
        }

        boardDiv.appendChild(rowDiv);
        board.push(row);
    }
}

/* ---------------- KEYBOARD UI ---------------- */
function createKeyboard() {

    const keyboardDiv = document.getElementById("keyboard");
    keyboardDiv.innerHTML = "";

    keyboardLayout.forEach(row => {

        const rowDiv = document.createElement("div");
        rowDiv.classList.add("key-row");

        row.forEach(key => {

            const btn = document.createElement("button");
            btn.textContent = key;
            btn.classList.add("key");

            if (key === "ENTER" || key === "BACK") {
                btn.classList.add("wide");
            }

            btn.addEventListener("click", () => handleKey(key));

            rowDiv.appendChild(btn);
        });

        keyboardDiv.appendChild(rowDiv);
    });
}

/* ---------------- INPUT HANDLING ---------------- */
document.addEventListener("keydown", (e) => {
    handleKey(e.key.toUpperCase());
});

function handleKey(key) {

    if (currentRow >= rows) return;

    if (/^[A-Z]$/.test(key)) {
        addLetter(key);
    }
    else if (key === "BACKSPACE" || key === "BACK") {
        deleteLetter();
    }
    else if (key === "ENTER") {
        submitGuess();
    }
}

/* ---------------- GAME LOGIC ---------------- */
function addLetter(letter) {

    if (currentCol >= cols) return;

    board[currentRow][currentCol].textContent = letter;
    currentCol++;
}

function deleteLetter() {

    if (currentCol <= 0) return;

    currentCol--;
    board[currentRow][currentCol].textContent = "";
}

/* ---------------- SUBMIT GUESS ---------------- */
function submitGuess() {

    if (currentCol !== cols) return;

    let guess = "";

    for (let c = 0; c < cols; c++) {
        guess += board[currentRow][c].textContent;
    }

    guess = normalize(guess);

    /* animation + coloring */
    for (let c = 0; c < cols; c++) {

        const tile = board[currentRow][c];

        setTimeout(() => {

            const letter = guess[c];

            if (letter === answer[c]) {
                tile.classList.add("correct");
            }
            else if (answer.includes(letter)) {
                tile.classList.add("present");
            }
            else {
                tile.classList.add("absent");
            }

        }, c * 120);
    }

    /* WIN CHECK */
    if (guess === answer) {

        setTimeout(() => {
            showWin();
        }, 800);

        return;
    }

    currentRow++;
    currentCol = 0;

    if (currentRow === rows) {
        document.getElementById("message").textContent =
            "❌ Answer was " + answer;
    }
}

/* ---------------- WIN SCREEN ---------------- */
function showWin() {
    document.getElementById("winScreen")?.classList.remove("hidden");
}

/* ---------------- PARTICLES ---------------- */
function createParticles() {

    const container = document.getElementById("particles");
    if (!container) return;

    for (let i = 0; i < 25; i++) {

        const p = document.createElement("div");
        p.classList.add("particle");

        p.style.left = Math.random() * 100 + "vw";
        p.style.animationDuration = (5 + Math.random() * 5) + "s";
        p.style.opacity = Math.random();

        container.appendChild(p);
    }
}

/* ---------------- INIT ---------------- */
createParticles();
startGame();