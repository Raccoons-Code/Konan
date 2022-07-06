export = (x: number): [bytes: number, unit: string] => {
  if (!x) return [0, 'B'];

  const a = Math.floor(Math.log(x) / Math.log(1000));
  const result = (x / Math.pow(1024, a)).toFixed(2);

  return [
    Number(result),
    ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][a],
  ];
}