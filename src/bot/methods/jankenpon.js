const mathRandom = require('./mathRandom');

/**
 * @description rules of "rock, paper, scissors" game.
 */
module.exports = {
    /**
     * @return {{(Random:rock|paper|scissors):String}}
     */
    machine: () => ['rock', 'paper', 'scissors'][mathRandom(3)],
    result: {
        0: 'Draw',
        1: 'Won',
        2: 'Lost',
    },
    rules: {
        rock: { rock: 2, scissors: 1, paper: 0 },
        paper: { paper: 2, rock: 1, scissors: 0 },
        scissors: { scissors: 2, paper: 1, rock: 0 },
    },
};