import { Authentication } from './Authentication';
import { Configuration } from './Configuration';
import { Discover } from './Discover';
import { Find } from './Find';
import { Genres } from './Genres';
import { Movies } from './Movies';
import { Search } from './Search';
import { TVEpisodes } from './TVEpisodes';
import { TVSeasons } from './TVSeasons';

export const Routes = new class Routes {
  // Authentication
  authenticationCreateGuestSession = Authentication.createGuestSession;
  authenticationCreateRequestToken = Authentication.createRequestToken;
  authenticationCreateSession = Authentication.createSession;
  authenticationGuestSession = Authentication.guestSession;
  authenticationRequestToken = Authentication.requestToken;
  authenticationSession = Authentication.session;
  authenticationSessionV4 = Authentication.sessionV4;
  authenticationSessionWithLogin = Authentication.sessionWithLogin;

  // Configuration
  configurationApi = Configuration.api;
  configurationCountries = Configuration.countries;
  configurationJobs = Configuration.jobs;
  configurationLanguages = Configuration.languages;
  configurationPrimaryTranslations = Configuration.primaryTranslations;
  configurationTimezones = Configuration.timezones;

  // Discover
  discoverMovie = Discover.movie;
  discoverTv = Discover.tv;

  // Find
  findById = Find.byId;

  // Genres
  genresMovieList = Genres.movieList;
  genresTvList = Genres.tvList;

  // Movies
  moviesDetails = Movies.details;
  moviesAccountStates = Movies.accountStates;
  moviesAlternativeTitles = Movies.alternativeTitles;
  moviesChanges = Movies.changes;
  moviesCredits = Movies.credits;
  moviesExternalIds = Movies.externalIds;
  moviesImages = Movies.images;
  moviesKeywords = Movies.keywords;
  moviesLists = Movies.lists;
  moviesRecommendations = Movies.recommendations;
  moviesReleaseDates = Movies.releaseDates;
  moviesReviews = Movies.reviews;
  moviesSimilar = Movies.similar;
  moviesTranslations = Movies.translations;
  moviesVideos = Movies.videos;
  moviesWatchProviders = Movies.watchProviders;
  moviesRateMovie = Movies.rateMovie;
  moviesDeleteRating = Movies.deleteRating;
  moviesLatest = Movies.latest;
  moviesNowPlaying = Movies.nowPlaying;
  moviesPopular = Movies.popular;
  moviesTopRated = Movies.topRated;
  moviesUpcoming = Movies.upcoming;

  // Search
  searchCollections = Search.collections;
  searchCompanies = Search.companies;
  searchKeywords = Search.keywords;
  searchMovies = Search.movies;
  searchMulti = Search.multi;
  searchPeople = Search.people;
  searchTv = Search.tv;

  // TV Episodes
  tvEpisodesDetails = TVEpisodes.details;

  // TV Seasons
  tvSeasonsDetails = TVSeasons.details;
};

export default Routes;