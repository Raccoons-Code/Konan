import Image from './image';
import Movie from './movie';

export { Image, Movie };

export default class Util {
  static image: Image;
  static movie: Movie;
}

Util.image = new Image({ apiKey: <string>process.env.TMDB_APIKEY });
Util.movie = new Movie({ apiKey: <string>process.env.TMDB_APIKEY });