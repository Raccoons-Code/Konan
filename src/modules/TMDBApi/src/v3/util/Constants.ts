import RouteBases from '../RouteBases';

export default class Constants {
  static baseURL = `${RouteBases.api}/${RouteBases.version}`;
  static apiKey = process.env.TMDB_APIKEY!;
}