import { request } from 'undici';
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
    return request(this.baseURL + Routes.authenticationCreateGuestSession(), {
      query: {
        api_key: this.apiKey,
      },
    }).then(r => r.body.json());
  }

  async createRequestToken(): Promise<APIRequestToken> {
    return request(this.baseURL + Routes.authenticationCreateRequestToken(), {
      query: {
        api_key: this.apiKey,
      },
    }).then(r => r.body.json());
  }

  async createSession(props: PostCreateSession): Promise<APISession> {
    return request(this.baseURL + Routes.authenticationCreateSession(), {
      body: JSON.stringify({
        request_token: props.body.request_token,
      }),
      method: 'POST',
      query: {
        api_key: this.apiKey,
      },
    }).then(r => r.body.json());
  }

  async createSessionV4(props: PostCreateSessionV4): Promise<APISessionV4> {
    return request(this.baseURL + Routes.authenticationSessionV4(), {
      body: JSON.stringify({
        request_token: props.body.access_token,
      }),
      method: 'POST',
      query: {
        api_key: this.apiKey,
      },
    }).then(r => r.body.json());
  }


  async createSessionWithLogin(props: PostCreateSessionWithLogin): Promise<APISessionWithLogin> {
    return request(this.baseURL + Routes.authenticationSessionWithLogin(), {
      body: JSON.stringify({
        request_token: props.body.request_token,
      }),
      method: 'POST',
      query: {
        api_key: this.apiKey,
      },
    }).then(r => r.body.json());
  }

  async deleteSession(props: DeleteDeleteSession): Promise<APIDeleteSession> {
    return request(this.baseURL + Routes.authenticationSession(), {
      body: JSON.stringify({
        request_token: props.body.session_id,
      }),
      method: 'POST',
      query: {
        api_key: this.apiKey,
      },
    }).then(r => r.body.json());
  }
}