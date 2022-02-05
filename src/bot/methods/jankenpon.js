const mathRandom = require('./mathRandom');

/** @description rules of "rock, paper, scissors" game. */
module.exports = new class Jankenpon {
    constructor() {
        this.index = [null, 'rock', 'paper', 'scissors', 'lizard', 'spock'];
        this.rules = {
            rock: { rock: 0, scissors: 1, paper: 2 },
            paper: { paper: 0, rock: 1, scissors: 2 },
            scissors: { scissors: 0, paper: 1, rock: 2 },
        };
        this.rulesSpock = {
            rock: { rock: 0, scissors: 1, paper: 2, lizard: 1, spock: 2 },
            paper: { paper: 0, rock: 1, scissors: 2, spock: 1, lizard: 2 },
            scissors: { scissors: 0, paper: 1, rock: 2, lizard: 1, spock: 2 },
            lizard: { lizard: 0, paper: 1, rock: 2, spock: 1, scissors: 2 },
            spock: { spock: 0, rock: 1, paper: 2, scissors: 1, lizard: 2 },
        };
        this.result = {
            0: 'Draw',
            1: 'Won',
            2: 'Lost',
        };
    }

    /** @return {{(Random:'rock'|'paper'|'scissors'):string}} */
    get machine() {
        return ['rock', 'paper', 'scissors'][mathRandom(3, 0)];
    }

    /** @return {{(Random:'rock'|'paper'|'scissors'|'lizard'|'spock'):string}} */
    get machineSpock() {
        return ['rock', 'paper', 'scissors', 'lizard', 'spock'][mathRandom(3, 0)];
    }

    /**
     * @param {number|string} [player1]
     * @param {number|string} [player2]
     */
    game(player1 = this.machine, player2 = this.machine) {
        if (typeof player1 === 'number')
            return {
                player1,
                player2,
                result: this.result[this.rules[this.index[player1]][this.index[player2]]],
            };

        return {
            player1,
            player2,
            result: this.result[this.rules[player1][player2]],
        };
    }

    /**
     * @param {number|string} [player1]
     * @param {number|string} [player2]
     */
    spock(player1 = this.machine, player2 = this.machine) {
        if (typeof player1 === 'number')
            return {
                player1,
                player2,
                result: this.result[this.rulesSpock[this.index[player1]][this.index[player2]]],
            };

        return {
            player1,
            player2,
            result: this.result[this.rulesSpock[player1][player2]],
        };
    }
};