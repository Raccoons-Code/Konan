import { Base } from '.';

export type AuthenticationOptions = Base

/** url: /session?api_key= */
export interface Delete {
  success: boolean
}

export interface DeleteProps {
  body: { session_id: string }
}

/** url: /guest_session/new?api_key= */
export interface Guest {
  expires_at: string
  guest_session_id: string
  success: boolean
}

/** url: /session/new?api_key= */
export interface Session {
  session_id: string
  success: boolean
}

/** url: /session/convert/4?api_key= */
export type SessionV4 = Session

/** url: /token/validate_with_login?api_key= */
export interface SessionWithLogin {
  expires_at: string
  request_token: string
  success: boolean
}

export interface SessionProps {
  body: { request_token: string }
}

export interface SessionV4Props {
  body: { access_token: string }
}

export interface SessionWithLoginProps {
  body: {
    username: string,
    password: string,
    request_token: string
  }
}

/** url: /token/new?api_key= */
export interface Token {
  expires_at: string
  request_token: string
  success: string
}