export = (bytes: number): [bytes: string, unit: string] => [
  (bytes / Math.pow(1024, Math.floor(Math.log(bytes) / Math.log(1000)))).toFixed(2),
  ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][(Math.floor(Math.log(bytes) / Math.log(1000)))],
];