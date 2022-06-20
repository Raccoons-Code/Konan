import { ImageURLOptions } from '../@types';
import http from './http';

export const image = new class Image {
  baseURL: string;

  constructor() {
    this.baseURL = http.image;
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