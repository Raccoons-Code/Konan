import http from './http';

export default class Constants {
  static baseURL = `${http.api}/${http.version}`;
  static apiKey = process.env.TMDB_APIKEY!;
}