function getRandomFromArray<T = any>(array: T[], options?: GetRandomOnArrayOptions): T
function getRandomFromArray<T = any>(array: T[], options?: GetRandomOnArrayOptions): T[]
function getRandomFromArray<T = any>(array: T[], options?: GetRandomOnArrayOptions) {
  if (!options?.amount) return array[Math.floor(Math.random() * array.length)];

  const newArray = [];

  if (options.repeat) {
    for (let i = 0; i < options.amount; i++) {
      newArray.push(array[Math.floor(Math.random() * array.length)]);
    }
  } else {
    const oldArray = Array.from(array.values());

    for (let i = 0; i < options.amount; i++) {
      newArray.push(...oldArray.splice(Math.floor(Math.random() * oldArray.length), 1));
    }
  }

  return newArray;
}

export = getRandomFromArray;

interface GetRandomOnArrayOptions {
  amount: number;
  repeat?: boolean;
}