import { MovieURLOptions, UtilOptions } from '../typings';

export default class Movie {
  apiKey: string;
  baseURL: string;

  constructor(options: UtilOptions) {
    this.apiKey = process.env.TMDB_APIKEY || options?.apiKey;
    this.baseURL = 'https://www.themoviedb.org/movie';
  }

  movieURL(props: MovieURLOptions) {
    const { id } = props;

    const movieURLProps = [
      this.baseURL,
      '/', id,
    ];

    return movieURLProps.join('');
  }
}