export = (string: string): any => {
  try {
    return JSON.parse(string);
  } catch {
    return {};
  }
};