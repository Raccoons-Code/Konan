import emojis from './emojis.json';

export const Wordle = new class Wordle {
  create(wordSize: number, gameSize = 6) {
    const array = [];

    for (let i = 0; i < gameSize; i++) {
      const row = [];

      for (let j = 0; j < wordSize; j++) {
        row.push('raw');
      }

      array.push(row);
    }

    return array;
  }

  transformToEmojis(board: string[][]) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j] = emojis[<'raw'>board[i][j]];
      }
    }

    return board;
  }

  transformToString(board: string[][]) {
    return board.map(row => row.join(' ')).join('\n');
  }

  check(word: string, attempt: string, board: string[][]) {
    attempt = this.#mapInvalidChars(attempt.toLowerCase());

    const letters = attempt.split('');
    const equalLetters = [];

    for (let i = 0; i < word.length; i++) {
      if (attempt[i] === word[i]) {
        letters[i] = letters[i].toUpperCase();
        equalLetters.push(attempt[i]);
      }
    }

    for (let i = 0; i < word.length; i++) {
      if (word.includes(attempt[i]) && !equalLetters.includes(attempt[i]))
        letters[i] = `+${letters[i]}`;
    }

    for (let i = 0; i < board.length; i++) {
      if (board[i][0] !== 'raw') continue;

      board[i] = letters;

      break;
    }

    return {
      board,
      win: equalLetters.length === word.length,
      lose: equalLetters.length !== word.length && board.at(-1)?.[0] !== 'raw',
    };
  }

  #mapInvalidChars(str: string) {
    return str.replace(/[ãâáàä]/gi, 'a')
      .replace(/[êéèë]/gi, 'e')
      .replace(/[îíìï]/gi, 'i')
      .replace(/[õôóòö]/gi, 'o')
      .replace(/[ûúùü]/gi, 'u')
      .replace(/[ç]/gi, 'c');
  }
};