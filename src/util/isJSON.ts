export = (string: string) => {
  try {
    JSON.parse(string);
    return true;
  } catch {
    return false;
  }
};