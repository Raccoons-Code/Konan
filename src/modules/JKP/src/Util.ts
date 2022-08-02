export default class Util {
  static readonly mathRandom = (max: number, min = 1) => Math.min(Math.floor((max * Math.random()) + min), max);
}