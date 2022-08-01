export const RouteBases = new class RouteBases {
  version = 3;
  api = 'https://api.themoviedb.org';
  image = 'https://image.tmdb.org/t/p';
  theMovieDb = 'https://www.themoviedb.org';
  movie = `${this.theMovieDb}/movie`;
};

export default RouteBases;