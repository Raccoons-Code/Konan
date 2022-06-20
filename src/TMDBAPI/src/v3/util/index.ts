import Constants from './Constants';
import { http } from './http';
import { image } from './image';
import { movie } from './movie';

export * from './http';
export * from './movie';

export default class Util {
  static Constants = Constants;
  static http = http;
  static image = image;
  static movie = movie;
}