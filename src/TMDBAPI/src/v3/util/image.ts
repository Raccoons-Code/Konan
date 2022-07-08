import { ImageURLOptions } from '../@types';
import RouteBases from '../RouteBases';

export const image = new class Image {
  baseURL: string;

  constructor() {
    this.baseURL = RouteBases.image;
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
};