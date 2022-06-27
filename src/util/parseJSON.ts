export = <T = { [k: number | string]: any }>(string: string): T | undefined => {
  try {
    return JSON.parse(string);
  } catch {
    return;
  }
};