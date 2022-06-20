export const Authentication = new class Authentication {
  /**
   * - GET `/authentication/guest_session/new`
   */
  createGuestSession(): '/authentication/guest_session/new' {
    return '/authentication/guest_session/new';
  }

  /**
   * - GET `/authentication/token/new`
   */
  createRequestToken(): '/authentication/token/new' {
    return '/authentication/token/new';
  }

  /**
   * - POST `/authentication/session/new`
   */
  createSession(): '/authentication/session/new' {
    return '/authentication/session/new';
  }

  guestSession(): '/authentication/guest_session' {
    return '/authentication/guest_session';
  }

  requestToken(): '/authentication/token' {
    return '/authentication/token';
  }

  /**
   * - DELETE `/authentication/session`
   */
  session(): '/authentication/session' {
    return '/authentication/session';
  }

  /**
   * - POST `/authentication/session/convert/4`
   */
  sessionV4(): '/authentication/session/convert/4' {
    return '/authentication/session/convert/4';
  }

  /**
   * - POST `/authentication/token/validate_with_login`
   */
  sessionWithLogin(): '/authentication/token/validate_with_login' {
    return '/authentication/token/validate_with_login';
  }
};