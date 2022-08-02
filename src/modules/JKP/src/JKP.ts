import Util from './Util';

export default class JKP {
  readonly emoji: Record<string, string> = { rock: '✊', scissors: '✌️', paper: '✋', lizard: '🦎', spock: '🖖' };

  readonly index = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

  readonly results = ['Draw', 'Won', 'Lost'];

  readonly rules: Record<string, Record<string, number>> = {
    rock: { rock: 0, scissors: 1, paper: 2, lizard: 1, spock: 2 },
    paper: { paper: 0, rock: 1, scissors: 2, spock: 1, lizard: 2 },
    scissors: { scissors: 0, paper: 1, rock: 2, lizard: 1, spock: 2 },
    lizard: { lizard: 0, paper: 1, rock: 2, spock: 1, scissors: 2 },
    spock: { spock: 0, rock: 1, paper: 2, scissors: 1, lizard: 2 },
  };

  get machine() {
    return ['rock', 'paper', 'scissors'][Util.mathRandom(3, 0)];
  }

  get machineSpock() {
    return ['rock', 'paper', 'scissors', 'lizard', 'spock'][Util.mathRandom(3, 0)];
  }

  game(player1: number | string = this.machine, player2: number | string = this.machine) {
    if (typeof player1 === 'number')
      player1 = this.index[player1];

    if (typeof player2 === 'number')
      player2 = this.index[player2];

    const res = this.rules[player1][player2];

    return {
      player1,
      player2,
      result: this.results[res],
      res,
    };
  }

  spock(player1: number | string = this.machineSpock, player2: number | string = this.machineSpock) {
    if (typeof player1 === 'number')
      player1 = this.index[player1];

    if (typeof player2 === 'number')
      player2 = this.index[player2];

    const res = this.rules[player1][player2];

    return {
      player1,
      player2,
      result: this.results[res],
      res,
    };
  }
}