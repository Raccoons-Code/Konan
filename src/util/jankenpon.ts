import mathRandom from './mathRandom';

/** @description rules of "rock, paper, scissors" game. */
export = new class Jankenpon {
  get index(): string[] {
    return ['', 'rock', 'paper', 'scissors', 'lizard', 'spock'];
  }

  get machine() {
    return ['rock', 'paper', 'scissors'][mathRandom(3, 0)];
  }

  get machineSpock() {
    return ['rock', 'paper', 'scissors', 'lizard', 'spock'][mathRandom(3, 0)];
  }

  get result(): { [x: number]: string } {
    return {
      0: 'Draw',
      1: 'Won',
      2: 'Lost',
    };
  }

  get rules(): { [k: string]: any } {
    return {
      rock: { rock: 0, scissors: 1, paper: 2, lizard: 1, spock: 2 },
      paper: { paper: 0, rock: 1, scissors: 2, spock: 1, lizard: 2 },
      scissors: { scissors: 0, paper: 1, rock: 2, lizard: 1, spock: 2 },
      lizard: { lizard: 0, paper: 1, rock: 2, spock: 1, scissors: 2 },
      spock: { spock: 0, rock: 1, paper: 2, scissors: 1, lizard: 2 },
    };
  }

  game(player1 = this.machine, player2: any = this.machine) {
    if (typeof player1 === 'number') {
      const res = this.rules[this.index[player1]][this.index[player2]];

      return {
        player1,
        player2,
        result: this.result[res],
        res,
      };
    }

    const res = this.rules[[player1][player2]];

    return {
      player1,
      player2,
      result: this.result[this.rules[player1][player2]],
      res,
    };
  }

  spock(player1 = this.machine, player2: any = this.machine) {
    if (typeof player1 === 'number') {
      const res = this.rules[this.index[player1]][this.index[player2]];

      return {
        player1,
        player2,
        result: this.result[res],
        res,
      };
    }

    const res = this.rules[[player1][player2]];

    return {
      player1,
      player2,
      result: this.result[res],
      res,
    };
  }
};