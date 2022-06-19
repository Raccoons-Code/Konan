import { TMDB_API_Options } from './@types';
import Authentication from './authentication';
import Configuration from './configuration';
import Discover from './discover';
import Find from './find';
import Genres from './genres';
import Movies from './movies';
import Search from './search';
import Util from './util';

export * from './@types';
export * from './Routes';

export default class TMDB_API_V3 {
  authentication: Authentication;
  apiKey: string;
  baseURL: string;
  configuration: Configuration;
  discover: Discover;
  find: Find;
  genres: Genres;
  movies: Movies;
  search: Search;
  Util = Util;

  constructor(options: TMDB_API_Options = { apiKey: process.env.TMDB_APIKEY }) {
    if (options.apiKey) process.env.TMDB_APIKEY = options.apiKey;

    this.apiKey = options.apiKey!;
    this.baseURL = Util.Constants.baseURL;

    this.authentication = new Authentication(this);
    this.configuration = new Configuration(this);
    this.discover = new Discover(this);
    this.find = new Find(this);
    this.genres = new Genres(this);
    this.movies = new Movies(this);
    this.search = new Search(this);
  }
}