import RouteBases from '../RouteBases';

export const movie = new class Movie {
  baseURL: string;

  constructor() {
    this.baseURL = RouteBases.movie;
  }

  movieURL(id: number) {
    return `${this.baseURL}/${id}`;
  }
};