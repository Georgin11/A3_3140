<?php
function calculateScore($category, $dice) {
    switch ($category) {
        case 'ones': return calculateSingleNumberScore($dice, 1);
        case 'twos': return calculateSingleNumberScore($dice, 2);
        case 'threes': return calculateSingleNumberScore($dice, 3);
        case 'fours': return calculateSingleNumberScore($dice, 4);
        case 'fives': return calculateSingleNumberScore($dice, 5);
        case 'sixes': return calculateSingleNumberScore($dice, 6);
        case 'threeKind': return hasNOfAKind($dice, 3) ? array_sum($dice) : 0;
        case 'fourKind': return hasNOfAKind($dice, 4) ? array_sum($dice) : 0;
        case 'fullHouse': return hasFullHouse($dice) ? 25 : 0;
        case 'smallStraight': return hasSmallStraight($dice) ? 30 : 0;
        case 'largeStraight': return hasLargeStraight($dice) ? 40 : 0;
        case 'yahtzee': return hasNOfAKind($dice, 5) ? 50 : 0;
        case 'chance': return array_sum($dice);
        default: return 0;
    }
}

function calculateSingleNumberScore($dice, $number) {
    return count(array_filter($dice, function($die) use ($number) { return $die == $number; })) * $number;
}

function hasNOfAKind($dice, $n) {
    $counts = array_count_values($dice);
    return max($counts) >= $n;
}

function hasFullHouse($dice) {
    $counts = array_count_values($dice);
    return in_array(3, $counts) && in_array(2, $counts);
}

function hasSmallStraight($dice) {
    $unique = array_unique($dice);
    sort($unique);
    $straights = [
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6]
    ];
    foreach ($straights as $straight) {
        if (array_intersect($straight, $unique) == $straight) {
            return true;
        }
    }
    return false;
}

function hasLargeStraight($dice) {
    $unique = array_unique($dice);
    sort($unique);
    $straights = [
        [1, 2, 3, 4, 5],
        [2, 3, 4, 5, 6]
    ];
    foreach ($straights as $straight) {
        if (array_intersect($straight, $unique) == $straight) {
            return true;
        }
    }
    return false;
}
?>
