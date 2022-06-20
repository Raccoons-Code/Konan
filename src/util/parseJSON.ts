export = <T = any[] | Record<any, any>>(string: string): T | undefined => {
  try {
    return JSON.parse(string);
  } catch {
    return;
  }
};