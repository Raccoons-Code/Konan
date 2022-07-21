import Constants from './Constants';
import { RouteBases } from '../RouteBases';
import { image } from './image';
import { movie } from './movie';

export * from '../RouteBases';
export * from './movie';

export default class Util {
  static Constants = Constants;
  static RouteBases = RouteBases;
  static image = image;
  static movie = movie;
}