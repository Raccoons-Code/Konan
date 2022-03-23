export = (string: string): object => {
  try {
    return JSON.parse(string);
  } catch {
    return {};
  }
};