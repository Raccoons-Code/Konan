import fetch from 'node-fetch';
import { AuthenticationOptions, Delete, DeleteProps, Guest, Session, SessionProps, Sessionv4, Sessionv4Props, SessionWithLogin, SessionWithLoginProps, Token } from '../typings';

export default class Authentication {
  apiKey: string;
  baseURL: string;

  constructor(options: AuthenticationOptions) {
    this.apiKey = process.env.TMDB_APIKEY || options.apiKey;
    this.baseURL = `${options.baseURL}/authentication`;
  }

  async createGuest(): Promise<Guest> {
    return await fetch(`${this.baseURL}/guest_session/new?api_key=${this.apiKey}`).then(r => r.json());
  }

  async createToken(): Promise<Token> {
    return await fetch(`${this.baseURL}/token/new?api_key=${this.apiKey}`).then(r => r.json());
  }

  async createSession({ body }: SessionProps): Promise<Session> {

    return await fetch(`${this.baseURL}/session/new?api_key=${this.apiKey}`, {
      method: 'POST',
      body: JSON.stringify({ request_token: body.request_token }),
    }).then(r => r.json());
  }

  async createSessionv4({ body }: Sessionv4Props): Promise<Sessionv4> {
    return await fetch(`${this.baseURL}/session/convert/4?api_key=${this.apiKey}`, {
      method: 'POST',
      body: JSON.stringify({ access_token: body.access_token }),
    }).then(r => r.json());
  }


  async createSessionWithLogin({ body }: SessionWithLoginProps): Promise<SessionWithLogin> {
    return await fetch(`${this.baseURL}/token/validate_with_login?api_key=${this.apiKey}`, {
      method: 'POST',
      body: JSON.stringify({
        password: body.password,
        request_token: body.request_token,
        username: body.username,
      }),
    }).then(r => r.json());
  }

  async deleteSession({ body }: DeleteProps): Promise<Delete> {
    return await fetch(`${this.baseURL}/session?api_key=${this.apiKey}`, {
      method: 'DELETE',
      body: JSON.stringify({ session_id: body.session_id }),
    }).then(r => r.json());
  }
}