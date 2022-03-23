import Image from './image';
import Movie from './movie';

export { Image, Movie };

export default class Util {
  static image: Image;
  static movie: Movie;
}

Util.image = new Image({ apiKey: process.env.TMDB_APIKEY as string });
Util.movie = new Movie({ apiKey: process.env.TMDB_APIKEY as string });