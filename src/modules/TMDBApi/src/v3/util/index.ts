import Constants from './Constants';
import { RouteBases } from '../Routes/RouteBases';
import { image } from './image';
import { movie } from './movie';

export * from '../Routes/RouteBases';
export * from './movie';

export default class Util {
  static Constants = Constants;
  static RouteBases = RouteBases;
  static image = image;
  static movie = movie;
}