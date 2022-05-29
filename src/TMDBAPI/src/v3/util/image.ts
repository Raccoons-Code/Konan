import { ImageURLOptions, UtilOptions } from '../@types';

export default class Image {
  apiKey: string;
  baseURL: string;

  constructor(options: UtilOptions) {
    this.apiKey = options.apiKey ?? process.env.TMDB_APIKEY;
    this.baseURL = 'https://image.tmdb.org/t/p';
  }

  imageURL(props: ImageURLOptions) {
    const { path, size = 'original' } = props;

    const imageURLProps = [
      this.baseURL,
      '/', typeof size === 'number' ? `w${size}` : size,
      path,
    ];

    return imageURLProps.join('');
  }
}