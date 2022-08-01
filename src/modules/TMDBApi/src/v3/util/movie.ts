import { RouteBases } from '../Routes';

export const movie = new class Movie {
  baseURL: string;

  constructor() {
    this.baseURL = RouteBases.movie;
  }

  movieURL(id: number) {
    return `${this.baseURL}/${id}`;
  }
};