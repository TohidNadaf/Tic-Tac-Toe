//A module responsible for rendering messages on the webpage.
const displayController = (() =>{
    //Sets the content of the "message" div with the provided message.
    const renderMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    }
    return{
        renderMessage
    }
})();

// Represents the game board and manages its rendering and state.
const Gameboard = (() => {

    //An array representing the game board with empty strings.
    let gameBoard = ["", "", "", "", "", "", "", "", ""];

    //: Renders the game board HTML and adds click event listeners to squares.
    const render = () => {
        let boardHTML = "";
        gameBoard.forEach((square, index) => {
            boardHTML += `<div class="square" id=square-${index}>${square}</div>`
        })
        document.querySelector("#gameboard").innerHTML = boardHTML;

        const square = document.querySelectorAll(".square");
        square.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        })

    }

    //Updates a square on the game board.
    const update = (index, value) => {
        gameBoard[index] = value;
        render();
    };

    // Returns the current state of the game board.
    const getGameboard = () => gameBoard

    return {
        render,
        update,
        getGameboard
    }
})();

//A function that creates player objects with a name and mark (X or O)
const createPlayer = (name, mark) => {
    return {
        name,
        mark
    }
}

// Manages the game's overall state, including players and game logic.
const Game = (() => {
    //An array of player objects.
    let players = [];
    //Index of the current player.
    let currentPlayerIndex;
    // Tracks if the game is over.
    let gameOver;

    //Initializes the game with player names and renders the game board.
    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O")
        ]

        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();

    }
// Function to start the game when the "Start Game" button is clicked
function startGame() {
    // Hide the controls
    document.getElementById("controls").style.display = "none";

    // Show the game container
    document.querySelector(".container").style.display = "block";

    // Start the game
    Game.start();
}



    // Handles player moves and checks for win or tie conditions.
    const handleClick = (event) => {
        if (gameOver){
            return;
        }
        // alert("Hello world")
        let index = parseInt(event.target.id.split("-")[1])
        if (Gameboard.getGameboard()[index] !== "")
            return;
        Gameboard.update(index, players[currentPlayerIndex].mark)

        if (checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)) {
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} is Winner!`)
        }
        else if(checkForTie(Gameboard.getGameboard())){
            gameOver = true;
            displayController.renderMessage("its a tie");        
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    //Resets the game board for a new game
    const restart = () => {
        for (let i = 0; i < 9; i++) {
            Gameboard.update(i, "");
        }
        Gameboard.render();
    }

    return {
        start,
        restart,
        handleClick
    }
})();

//Helper Functions
//Checks for a win on the game board by comparing it to winning combinations.
function checkForWin(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false
}

//Checks if the game is a tie by verifying if all cells are filled.
function checkForTie(board)
{
    return board.every(cell => cell !== "")
}

//Event Listeners
//Click events are attached to "Start" and "Restart" buttons to trigger game initialization and restart.
const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
    Game.restart()
})

let startButton = document.querySelector('#start-button')
startButton.addEventListener("click", () => {

    Game.start();
})


// Function to toggle the visibility of the game board when the "Start Game" button is clicked
function toggleGameboard() {
    const gameboard = document.getElementById("gameboard");
    const startButton = document.getElementById("start-button");

    if (gameboard.style.display === "none") {
        // Show the game board
        gameboard.style.display = "flex";
        startButton.textContent = "Close"; // Change button text
    } else {
        // Hide the game board
        gameboard.style.display = "none";
        startButton.textContent = "Start Game"; // Change button text
    }

    // Start the game if the game board is visible
    if (gameboard.style.display !== "none") {
        Game.start();
    }
}



