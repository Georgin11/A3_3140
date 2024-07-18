let currentPlayer = 1;
let rollCount = 0;
let dice = [0, 0, 0, 0, 0];
const maxRolls = 3;
const players = {
    1: { scores: initializeScores(), totalScore: 0 },
    2: { scores: initializeScores(), totalScore: 0 }
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('rollDiceButton').addEventListener('click', rollDice);
    updateDice();
    updatePlayerTurn();
    addScoreboardListeners();
});

function initializeScores() {
    return {
        ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null,
        threeKind: null, fourKind: null, fullHouse: null,
        smallStraight: null, largeStraight: null, yahtzee: null, chance: null
    };
}

function rollDice() {
    if (rollCount < maxRolls) {
        for (let i = 0; i < dice.length; i++) {
            if (!document.querySelector(`#die${i}`).classList.contains('held')) {
                dice[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
        rollCount++;
        updateDice();
        calculateAndDisplayScores();
    }
}

function updateDice() {
    for (let i = 0; i < dice.length; i++) {
        const die = document.querySelector(`#die${i}`);
        die.textContent = dice[i];
        die.removeEventListener('click', toggleHold);  // Ensure no duplicate event listeners
        die.addEventListener('click', () => toggleHold(die, i));  // Add event listener
    }
}

function toggleHold(die, index) {
    die.classList.toggle('held');  // Toggle the 'held' class to show selection
}

function addScoreboardListeners() {
    const scoreCells = document.querySelectorAll('.score-button');
    scoreCells.forEach(cell => {
        cell.addEventListener('click', () => scoreCategory(cell));
    });
}

function scoreCategory(cell) {
    const category = cell.dataset.category;
    if (players[currentPlayer].scores[category] === null) {
        const score = calculateScore(category, dice);
        players[currentPlayer].scores[category] = score;
        document.getElementById(`player${currentPlayer}-${category}-score`).textContent = score;
        cell.classList.add('disabled');
        resetUnselectedScores();
        updateScoreboard();
        switchPlayer();
    } else {
        alert("This category has already been scored.");
    }
}

function resetUnselectedScores() {
    const categories = Object.keys(players[currentPlayer].scores);
    categories.forEach(category => {
        if (players[currentPlayer].scores[category] === null) {
            document.getElementById(`player${currentPlayer}-${category}-score`).textContent = '-';
        }
    });
}

function calculateAndDisplayScores() {
    const categories = Object.keys(players[currentPlayer].scores);
    categories.forEach(category => {
        if (players[currentPlayer].scores[category] === null) {
            document.getElementById(`player${currentPlayer}-${category}-score`).textContent = calculateScore(category, dice);
        }
    });
}

function updateScoreboard() {
    for (let player = 1; player <= 2; player++) {
        for (let category in players[player].scores) {
            if (players[player].scores[category] !== null) {
                document.getElementById(`player${player}-${category}-score`).textContent = players[player].scores[category];
            }
        }
        document.getElementById(`player${player}-total-score`).textContent = Object.values(players[player].scores).reduce((a, b) => a + (b || 0), 0);
    }
}

function switchPlayer() {
    rollCount = 0;
    dice = [0, 0, 0, 0, 0];
    updateDice();
    document.querySelectorAll('.die').forEach(die => die.classList.remove('held'));

    if (Object.values(players[1].scores).every(score => score !== null) && Object.values(players[2].scores).every(score => score !== null)) {
        declareWinner();
    } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updatePlayerTurn();
    }
}

function updatePlayerTurn() {
    document.getElementById('player-turn').textContent = `Player ${currentPlayer}'s turn`;
}

function declareWinner() {
    const player1Score = Object.values(players[1].scores).reduce((a, b) => a + (b || 0), 0);
    const player2Score = Object.values(players[2].scores).reduce((a, b) => a + (b || 0), 0);
    if (player1Score > player2Score) {
        alert(`Player 1 wins with ${player1Score} points!`);
    } else if (player2Score > player1Score) {
        alert(`Player 2 wins with ${player2Score} points!`);
    } else {
        alert(`It's a tie with ${player1Score} points each!`);
    }
}
