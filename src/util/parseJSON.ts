export = <T = Record<any, any>>(string: string): T | undefined => {
  try {
    return JSON.parse(string);
  } catch {
    return;
  }
};