export const Genres = new class Genres {
  /**
   * - GET `/genre/movie/list`
   */
  movieList(): '/genre/movie/list' {
    return '/genre/movie/list';
  }

  /**
   * - GET `/genre/tv/list`
   */
  tvList(): '/genre/tv/list' {
    return '/genre/tv/list';
  }
};