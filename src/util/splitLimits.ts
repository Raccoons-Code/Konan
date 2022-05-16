export = (amount: number, limit: limit = 100) => {
  const limits: number[] = [];

  const forLimit = amount / limit;

  for (let i = 0; i < forLimit; i++) {
    limits.push(amount > limit ? limit : amount);

    amount -= limit;
  }

  return limits;
};

/**
 * @default 100
 */
type limit = number