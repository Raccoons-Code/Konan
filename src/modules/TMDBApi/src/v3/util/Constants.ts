import { RouteBases } from '../Routes';

export default class Constants {
  static baseURL = `${RouteBases.api}/${RouteBases.version}`;
  static apiKey = process.env.TMDB_APIKEY!;
}