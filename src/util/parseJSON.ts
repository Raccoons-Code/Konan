export = <T = Record<any, any>>(string: string): T | null => {
  try {
    return JSON.parse(string);
  } catch {
    return null;
  }
};