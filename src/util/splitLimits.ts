export = (amount: number, limit: limit = 100) => {
  const array = [];

  if (amount <= limit) return [amount];

  let amount2 = amount;

  for (let i = 0; i < ((amount / limit) - 1); i++) {
    if (amount2 >= limit) array.push(limit), amount2 -= limit;
    if (amount2 < limit) array.push(amount2), amount2 -= limit;
  }

  return array;
};

/**
 * @default 100
 */
type limit = number