document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('rollDiceButton').addEventListener('click', () => sendAction('rollDice'));
    updateGameState();
    addScoreboardListeners();
});

function sendAction(action, additionalData = {}) {
    const data = new FormData();
    data.append('action', action);
    for (const key in additionalData) {
        data.append(key, additionalData[key]);
    }

    fetch('/api/game.php', {
        method: 'POST',
        body: data
    })
    .then(response => response.json())
    .then(data => {
        updateGameState(data);
    });
}

function updateGameState(state = null) {
    if (!state) {
        fetch('/api/game.php')
            .then(response => response.json())
            .then(data => {
                updateGameState(data);
            });
    } else {
        updateDice(state.dice, state.heldDice);
        updateScores(state.scores, state.totalScore);
        document.getElementById('player-turn').textContent = `Player ${currentPlayer}'s turn`;
        rollCount = state.rollCount;
    }
}

function updateDice(dice, heldDice) {
    for (let i = 0; i < dice.length; i++) {
        const die = document.getElementById(`die${i}`);
        die.textContent = dice[i];
        die.classList.toggle('held', heldDice.includes(i));
        die.removeEventListener('click', toggleHold);
        die.addEventListener('click', () => toggleHold(die, i));
    }
}

function toggleHold(die, index) {
    sendAction('holdDie', { index });
}

function addScoreboardListeners() {
    const scoreButtons = document.querySelectorAll('.score-button');
    scoreButtons.forEach(button => {
        button.addEventListener('click', () => sendAction('scoreCategory', { category: button.dataset.category }));
    });
}

function updateScores(scores, totalScore) {
    for (const category in scores) {
        document.getElementById(`player${currentPlayer}-${category}-score`).textContent = scores[category] !== null ? scores[category] : '-';
    }
    document.getElementById(`player${currentPlayer}-total-score`).textContent = totalScore;
}
