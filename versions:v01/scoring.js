function calculateScore(category, dice) {
    switch (category) {
        case 'ones': return calculateSingleNumberScore(dice, 1);
        case 'twos': return calculateSingleNumberScore(dice, 2);
        case 'threes': return calculateSingleNumberScore(dice, 3);
        case 'fours': return calculateSingleNumberScore(dice, 4);
        case 'fives': return calculateSingleNumberScore(dice, 5);
        case 'sixes': return calculateSingleNumberScore(dice, 6);
        case 'threeKind': return hasNOfAKind(dice, 3) ? dice.reduce((a, b) => a + b, 0) : 0;
        case 'fourKind': return hasNOfAKind(dice, 4) ? dice.reduce((a, b) => a + b, 0) : 0;
        case 'fullHouse': return hasFullHouse(dice) ? 25 : 0;
        case 'smallStraight': return hasSmallStraight(dice) ? 30 : 0;
        case 'largeStraight': return hasLargeStraight(dice) ? 40 : 0;
        case 'yahtzee': return hasNOfAKind(dice, 5) ? 50 : 0;
        case 'chance': return dice.reduce((a, b) => a + b, 0);
        default: return 0;
    }
}

function calculateSingleNumberScore(dice, number) {
    return dice.filter(die => die === number).length * number;
}

function hasNOfAKind(dice, n) {
    const counts = {};
    dice.forEach(die => counts[die] = (counts[die] || 0) + 1);
    return Object.values(counts).some(count => count >= n);
}

function hasFullHouse(dice) {
    const counts = {};
    dice.forEach(die => counts[die] = (counts[die] || 0) + 1);
    const values = Object.values(counts);
    return values.includes(3) && values.includes(2);
}

function hasSmallStraight(dice) {
    const straights = [
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6]
    ];
    return straights.some(straight => straight.every(num => dice.includes(num)));
}

function hasLargeStraight(dice) {
    const straights = [
        [1, 2, 3, 4, 5],
        [2, 3, 4, 5, 6]
    ];
    return straights.some(straight => straight.every(num => dice.includes(num)));
}
