<?php
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['leaderboard'])) {
    $_SESSION['leaderboard'] = [];
}

echo json_encode($_SESSION['leaderboard']);
?>
