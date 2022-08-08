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
    word = this.#mapInvalidChars(word.toLowerCase());
    attempt = this.#mapInvalidChars(attempt.toLowerCase());

    const letters = attempt.split('');
    const lettersCount = word.split('').reduce((acc, l) =>
      ({ ...acc, [l]: acc[l] ? acc[l] + 1 : 1 }),
      <Record<string, number>>{});

    for (let i = 0; i < word.length; i++) {
      if (attempt[i] === word[i]) {
        letters[i] = letters[i].toUpperCase();
        lettersCount[word[i]]--;
      }
    }

    for (let i = 0; i < word.length; i++) {
      if (lettersCount[attempt[i]] && word.includes(attempt[i]) && attempt[i] !== word[i]) {
        letters[i] = `+${letters[i]}`;
        lettersCount[attempt[i]]--;
      }
    }

    for (let i = 0; i < board.length; i++) {
      if (board[i][0] !== 'raw') continue;

      board[i] = letters;

      break;
    }

    return {
      board,
      win: attempt === word,
      lose: attempt !== word && board.at(-1)?.[0] !== 'raw',
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