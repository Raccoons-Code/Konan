import { Base } from '.';

export type AuthenticationOptions = Base

/**
 * https://developers.themoviedb.org/3/authentication/delete-session
 */
export interface APIDeleteSession {
  success: boolean
}

/**
 * https://developers.themoviedb.org/3/authentication/delete-session
 */
export interface DeleteDeleteSession {
  body: { session_id: string }
}

/**
 * https://developers.themoviedb.org/3/authentication/create-guest-session
 */
export interface APIGuestSession {
  expires_at: string
  guest_session_id: string
  success: boolean
}

/**
 * https://developers.themoviedb.org/3/authentication/create-session
 */
export interface APISession {
  session_id: string
  success: boolean
}

/**
 * https://developers.themoviedb.org/3/authentication/create-session-from-v4-access-token
 */
export type APISessionV4 = APISession

/**
 * https://developers.themoviedb.org/3/authentication/validate-request-token
 */
export interface APISessionWithLogin {
  expires_at: string
  request_token: string
  success: boolean
}

/**
 * https://developers.themoviedb.org/3/authentication/create-session
 */
export interface PostCreateSession {
  body: { request_token: string }
}

/**
 * https://developers.themoviedb.org/3/authentication/create-session-from-v4-access-token
 */
export interface PostCreateSessionV4 {
  body: { access_token: string }
}

export interface PostCreateSessionWithLogin {
  body: {
    username: string,
    password: string,
    request_token: string
  }
}

/**
 * https://developers.themoviedb.org/3/authentication/create-request-token
 */
export interface APIRequestToken {
  expires_at: string
  request_token: string
  success: string
}