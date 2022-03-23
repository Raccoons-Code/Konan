export = (ms = 0) => {
  const end = Date.now() + ms;
  while (Date.now() < end) continue;
};