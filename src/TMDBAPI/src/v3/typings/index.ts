export * from './authentication';
export * from './configuration';
export * from './discover';
export * from './genres';
export * from './ISO-3166-1';
export * from './ISO-639-1';
export * from './movies';
export * from './search';
export * from './util';

export interface Base {
  apiKey: string
  baseURL: string
}

export interface Rejected {
  status_code: number
  status_message: string
}

export interface TMDB_API_Options {
  apiKey?: string
}