export = <T = any>(string: string): T => {
  try {
    return JSON.parse(string);
  } catch {
    return <T>{};
  }
};