import axios from 'axios';
import type { APIDeleteSession, APIGuestSession, APIRequestToken, APISession, APISessionV4, APISessionWithLogin, AuthenticationOptions, DeleteDeleteSession, PostCreateSession, PostCreateSessionV4, PostCreateSessionWithLogin } from '../@types';
import Routes from '../Routes';

export default class Authentication {
  apiKey: string;
  baseURL: string;

  constructor(options: AuthenticationOptions) {
    this.apiKey = options.apiKey ?? process.env.TMDB_APIKEY;
    this.baseURL = options.baseURL;
  }

  async createGuestSession(): Promise<APIGuestSession> {
    return axios.get(Routes.authenticationCreateGuestSession(), {
      baseURL: this.baseURL,
      params: { apikey: this.apiKey },
    }).then(r => r.data);
  }

  async createRequestToken(): Promise<APIRequestToken> {
    return axios.get(Routes.authenticationCreateRequestToken(), {
      baseURL: this.baseURL,
      params: { apikey: this.apiKey },
    }).then(r => r.data);
  }

  async createSession(props: PostCreateSession): Promise<APISession> {
    const { body } = props;

    return axios.post(Routes.authenticationCreateSession(), {
      request_token: body.request_token,
    }, {
      baseURL: this.baseURL,
      params: { apikey: this.apiKey },
    }).then(r => r.data);
  }

  async createSessionV4(props: PostCreateSessionV4): Promise<APISessionV4> {
    const { body } = props;

    return axios.post(Routes.authenticationSessionV4(), {
      access_token: body.access_token,
    }, {
      baseURL: this.baseURL,
      params: { apikey: this.apiKey },
    }).then(r => r.data);
  }


  async createSessionWithLogin(props: PostCreateSessionWithLogin): Promise<APISessionWithLogin> {
    const { body } = props;

    return axios.post(Routes.authenticationSessionWithLogin(), {
      password: body.password,
      request_token: body.request_token,
      username: body.username,
    }, {
      baseURL: this.baseURL,
      params: { apikey: this.apiKey },
    }).then(r => r.data);
  }

  async deleteSession(props: DeleteDeleteSession): Promise<APIDeleteSession> {
    const { body } = props;

    return axios.delete(Routes.authenticationSession(), {
      baseURL: this.baseURL,
      data: {
        session_id: body.session_id,
      },
      params: { apikey: this.apiKey },
    }).then(r => r.data);
  }
}