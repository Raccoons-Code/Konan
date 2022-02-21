const Authentication = require('./authentication');
const Configuration = require('./configuration');
const Discover = require('./discover');
const Genres = require('./genres');
const Movies = require('./movies');
const Search = require('./search');
const util = require('./util');

module.exports = new class {
  constructor() {
    this.apiKey = process.env.TMDB_APIKEY;
    this.baseURL = 'https://api.themoviedb.org/3';

    this.authentication = new Authentication(this);
    this.configuration = new Configuration(this);
    this.discover = new Discover(this);
    this.genres = new Genres(this);
    this.movies = new Movies(this);
    this.search = new Search(this);
    this.util = util;
  }
};