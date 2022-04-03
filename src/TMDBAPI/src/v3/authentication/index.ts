import axios from 'axios';
import { AuthenticationOptions, Delete, DeleteProps, Guest, Session, SessionProps, Sessionv4, Sessionv4Props, SessionWithLogin, SessionWithLoginProps, Token } from '../typings';

export default class Authentication {
  apiKey: string;
  baseURL: string;

  constructor(options: AuthenticationOptions) {
    this.apiKey = process.env.TMDB_APIKEY ?? options.apiKey;
    this.baseURL = `${options.baseURL}/authentication`;
  }

  async createGuest(): Promise<Guest> {
    return await axios.get(`/guest_session/new?api_key=${this.apiKey}`, {
      baseURL: this.baseURL,
    }).then(r => r.data);
  }

  async createToken(): Promise<Token> {
    return await axios.get(`/token/new?api_key=${this.apiKey}`, {
      baseURL: this.baseURL,
    }).then(r => r.data);
  }

  async createSession(props: SessionProps): Promise<Session> {
    const { body } = props;

    return await axios.post(`/session/new?api_key=${this.apiKey}`, {
      request_token: body.request_token,
    }, {
      baseURL: this.baseURL,
    }).then(r => r.data);
  }

  async createSessionv4(props: Sessionv4Props): Promise<Sessionv4> {
    const { body } = props;

    return await axios.post(`/session/convert/4?api_key=${this.apiKey}`, {
      access_token: body.access_token,
    }, {
      baseURL: this.baseURL,
    }).then(r => r.data);
  }


  async createSessionWithLogin(props: SessionWithLoginProps): Promise<SessionWithLogin> {
    const { body } = props;

    return await axios.post(`/token/validate_with_login?api_key=${this.apiKey}`, {
      password: body.password,
      request_token: body.request_token,
      username: body.username,
    }, {
      baseURL: this.baseURL,
    }).then(r => r.data);
  }

  async deleteSession(props: DeleteProps): Promise<Delete> {
    const { body } = props;

    return await axios.delete(`/session?api_key=${this.apiKey}`, {
      baseURL: this.baseURL,
      data: {
        session_id: body.session_id,
      },
    }).then(r => r.data);
  }
}