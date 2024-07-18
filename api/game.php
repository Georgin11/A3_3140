<?php
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['game_state'])) {
    resetGame();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_POST['action'];
    switch ($action) {
        case 'rollDice':
            rollDice();
            break;
        case 'holdDie':
            holdDie($_POST['index']);
            break;
        case 'scoreCategory':
            scoreCategory($_POST['category']);
            break;
        case 'resetGame':
            resetGame();
            break;
    }
}

function rollDice() {
    if ($_SESSION['game_state']['rollCount'] < 3) {
        for ($i = 0; $i < 5; $i++) {
            if (!in_array($i, $_SESSION['game_state']['heldDice'])) {
                $_SESSION['game_state']['dice'][$i] = rand(1, 6);
            }
        }
        $_SESSION['game_state']['rollCount']++;
    }
    sendGameState();
}

function holdDie($index) {
    if (!in_array($index, $_SESSION['game_state']['heldDice'])) {
        $_SESSION['game_state']['heldDice'][] = $index;
    } else {
        if (($key = array_search($index, $_SESSION['game_state']['heldDice'])) !== false) {
            unset($_SESSION['game_state']['heldDice'][$key]);
        }
    }
    sendGameState();
}

function scoreCategory($category) {
    if ($_SESSION['game_state']['scores'][$category] === null) {
        require_once 'scoring.php';
        $score = calculateScore($category, $_SESSION['game_state']['dice']);
        $_SESSION['game_state']['scores'][$category] = $score;
        $_SESSION['game_state']['totalScore'] += $score;
        $_SESSION['game_state']['rollCount'] = 0;
        $_SESSION['game_state']['dice'] = [0, 0, 0, 0, 0];
        $_SESSION['game_state']['heldDice'] = [];
        updateLeaderboard();
    }
    sendGameState();
}

function resetGame() {
    $_SESSION['game_state'] = [
        'dice' => [0, 0, 0, 0, 0],
        'heldDice' => [],
        'rollCount' => 0,
        'scores' => [
            'ones' => null, 'twos' => null, 'threes' => null, 'fours' => null,
            'fives' => null, 'sixes' => null, 'threeKind' => null, 'fourKind' => null,
            'fullHouse' => null, 'smallStraight' => null, 'largeStraight' => null,
            'yahtzee' => null, 'chance' => null
        ],
        'totalScore' => 0
    ];
    sendGameState();
}

function updateLeaderboard() {
    if (!isset($_SESSION['leaderboard'])) {
        $_SESSION['leaderboard'] = [];
    }
    $_SESSION['leaderboard'][] = $_SESSION['game_state']['totalScore'];
    rsort($_SESSION['leaderboard']);
    $_SESSION['leaderboard'] = array_slice($_SESSION['leaderboard'], 0, 10);
}

function sendGameState() {
    echo json_encode($_SESSION['game_state']);
}

function sendLeaderboard() {
    echo json_encode($_SESSION['leaderboard']);
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['leaderboard'])) {
        sendLeaderboard();
    } else {
        sendGameState();
    }
}
?>
