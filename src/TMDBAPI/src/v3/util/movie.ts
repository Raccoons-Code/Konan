import http from './http';

export const movie = new class Movie {
  baseURL: string;

  constructor() {
    this.baseURL = http.movie;
  }

  movieURL(id: number) {
    return `${this.baseURL}/${id}`;
  }
};