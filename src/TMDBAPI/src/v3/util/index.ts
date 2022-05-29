import Constants from './Constants';
import Image from './image';
import Movie from './movie';

export { Constants, Image, Movie };

export default class Util {
  static Constants = Constants;
  static image: Image;
  static movie: Movie;
}

Util.image = new Image({ apiKey: <string>process.env.TMDB_APIKEY });
Util.movie = new Movie({ apiKey: <string>process.env.TMDB_APIKEY });