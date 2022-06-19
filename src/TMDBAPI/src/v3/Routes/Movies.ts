export const Movies = new class Movies {
  /**
   * - GET `/movie/{movieId}`
   */
  details<movieId extends number>(movieId: movieId): `/movie/${movieId}` {
    return `/movie/${movieId}`;
  }

  /**
   * - GET `/movie/{movieId}/account_states`
   */
  accountStates<movieId extends number>(movieId: movieId): `/movie/${movieId}/account_states` {
    return `/movie/${movieId}/account_states`;
  }

  /**
   * - GET `/movie/{movieId}/alternative_titles`
   */
  alternativeTitles<movieId extends number>(movieId: movieId): `/movie/${movieId}/alternative_titles` {
    return `/movie/${movieId}/alternative_titles`;
  }

  /**
   * - GET `/movie/{movieId}/credits`
   */
  changes<movieId extends number>(movieId: movieId): `/movie/${movieId}/changes` {
    return `/movie/${movieId}/changes`;
  }

  /**
   * - GET `/movie/{movieId}/credits`
   */
  credits<movieId extends number>(movieId: movieId): `/movie/${movieId}/credits` {
    return `/movie/${movieId}/credits`;
  }

  /**
   * - GET `/movie/{movieId}/images`
   */
  externalIds<movieId extends number>(movieId: movieId): `/movie/${movieId}/external_ids` {
    return `/movie/${movieId}/external_ids`;
  }

  /**
   * - GET `/movie/{movieId}/images`
   */
  images<movieId extends number>(movieId: movieId): `/movie/${movieId}/images` {
    return `/movie/${movieId}/images`;
  }

  /**
   * - GET `/movie/{movieId}/keywords`
   */
  keywords<movieId extends number>(movieId: movieId): `/movie/${movieId}/keywords` {
    return `/movie/${movieId}/keywords`;
  }

  /**
   * - GET `/movie/{movieId}/lists`
   */
  lists<movieId extends number>(movieId: movieId): `/movie/${movieId}/lists` {
    return `/movie/${movieId}/lists`;
  }

  /**
   * - GET `/movie/{movieId}/recommendations`
   */
  recommendations<movieId extends number>(movieId: movieId): `/movie/${movieId}/recommendations` {
    return `/movie/${movieId}/recommendations`;
  }

  /**
   * - GET `/movie/{movieId}/release_dates`
   */
  releaseDates<movieId extends number>(movieId: movieId): `/movie/${movieId}/release_dates` {
    return `/movie/${movieId}/release_dates`;
  }

  /**
   * - GET `/movie/{movieId}/reviews`
   */
  reviews<movieId extends number>(movieId: movieId): `/movie/${movieId}/reviews` {
    return `/movie/${movieId}/reviews`;
  }

  /**
   * - GET `/movie/{movieId}/similar`
   */
  similar<movieId extends number>(movieId: movieId): `/movie/${movieId}/similar` {
    return `/movie/${movieId}/similar`;
  }

  /**
   * - GET `/movie/{movieId}/translations`
   */
  translations<movieId extends number>(movieId: movieId): `/movie/${movieId}/translations` {
    return `/movie/${movieId}/translations`;
  }

  /**
   * - GET `/movie/{movieId}/videos`
   */
  videos<movieId extends number>(movieId: movieId): `/movie/${movieId}/videos` {
    return `/movie/${movieId}/videos`;
  }

  /**
   * - GET `/movie/{movieId}/watch/providers`
   */
  watchProviders<movieId extends number>(movieId: movieId): `/movie/${movieId}/watch/providers` {
    return `/movie/${movieId}/watch/providers`;
  }

  /**
   * - POST `/movie/{movieId}/rating`
   */
  rateMovie<movieId extends number>(movieId: movieId): `/movie/${movieId}/rating` {
    return `/movie/${movieId}/rating`;
  }

  /**
   * - DELETE `/movie/{movieId}/rating`
   */
  deleteRating<movieId extends number>(movieId: movieId): `/movie/${movieId}/rating` {
    return `/movie/${movieId}/rating`;
  }

  /**
   * - GET `/movie/latest`
   */
  latest(): '/movie/latest' {
    return '/movie/latest';
  }

  /**
   * - GET `/movie/now_playing`
   */
  nowPlaying(): '/movie/now_playing' {
    return '/movie/now_playing';
  }

  /**
   * - GET `/movie/popular`
   */
  popular(): '/movie/popular' {
    return '/movie/popular';
  }

  /**
   * - GET `/movie/top_rated`
   */
  topRated(): '/movie/top_rated' {
    return '/movie/top_rated';
  }

  /**
   * - GET `/movie/upcoming`
   */
  upcoming(): '/movie/upcoming' {
    return '/movie/upcoming';
  }
};

export default Movies;