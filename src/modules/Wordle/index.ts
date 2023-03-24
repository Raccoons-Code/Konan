import { readFileSync } from "node:fs";

const emojis = JSON.parse(readFileSync("public/emojis/wordle.json", "utf8"));

class Wordle {
  create(wordSize: number, gameSize = 6) {
    const array = [];

    for (let i = 0; i < gameSize; i++) {
      const row = [];

      for (let j = 0; j < wordSize; j++) {
        row.push(emojis.raw);
      }

      array.push(row);
    }

    return array;
  }

  transformToEmojis(board: string[][]) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === emojis.raw) continue;

        board[i][j] = emojis[board[i][j]];
      }
    }

    return board;
  }

  transformToString(board: string[][]) {
    return board.map(row => row.join(" ")).join("\n");
  }

  check(word: string, attempt: string, board: string[][]) {
    word = this.#mapInvalidChars(word.toLowerCase());
    attempt = this.#mapInvalidChars(attempt.toLowerCase());

    const letters = attempt.split("");
    const lettersCount = word.split("").reduce((acc, l) =>
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
      if (board[i][0] !== emojis.raw) continue;

      board[i] = letters;

      break;
    }

    return {
      board,
      win: attempt === word,
      lose: attempt !== word && board.at(-1)?.[0] !== emojis.raw,
    };
  }

  getUpperLetters(board: string[][]) {
    const upperLetters = <string[]>[];

    for (let i = 0; i < board.length; i++) {
      if (board[i][0] === emojis.raw) break;

      for (let j = 0; j < board[i].length; j++) {
        upperLetters[j] = board[i][j] === board[i][j].toUpperCase() ?
          board[i][j] : upperLetters[j] ?? "_";
      }
    }

    return upperLetters;
  }

  #mapInvalidChars(str: string) {
    return str.replace(/[ãâáàä]/gi, "a")
      .replace(/[êéèë]/gi, "e")
      .replace(/[îíìï]/gi, "i")
      .replace(/[õôóòö]/gi, "o")
      .replace(/[ûúùü]/gi, "u")
      .replace(/[ç]/gi, "c");
  }
}

const wordle = new Wordle();

export default wordle;
