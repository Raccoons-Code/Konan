const fetch = require('node-fetch');

module.exports = class {
  constructor(options) {
    this.apiKey = options.apiKey || process.env.TMDB_APIKEY;
    this.baseURL = `${options.baseURL}/authentication`;
  }

  /**
   * @returns {Promise<Guest>}
   */
  async createGuest() {
    return await fetch(`${this.baseURL}/guest_session/new?api_key=${this.apiKey}`).then(r => r.json());
  }

  /**
   * @returns {Promise<Token>}
   */
  async createToken() {
    return await fetch(`${this.baseURL}/token/new?api_key=${this.apiKey}`).then(r => r.json());
  }

  /**
   * @param {SessionProps} props
   * @returns {Promise<Session>}
   */
  async createSession(props) {
    const { body } = props;

    return await fetch(`${this.baseURL}/session/new?api_key=${this.apiKey}`, {
      method: 'POST',
      body: { request_token: body.request_token },
    }).then(r => r.json());
  }

  /**
   * @param {Sessionv4Props} props
   * @returns {Promise<Sessionv4>}
   */
  async createSessionv4(props) {
    const { body } = props;

    return await fetch(`${this.baseURL}/session/convert/4?api_key=${this.apiKey}`, {
      method: 'POST',
      body: { access_token: body.access_token },
    }).then(r => r.json());
  }

  /**
   * @param {SessionWithLoginProps} props
   * @returns {Promise<SessionWithLogin>}
   */
  async createSessionWithLogin(props) {
    const { body } = props;

    return await fetch(`${this.baseURL}/token/validate_with_login?api_key=${this.apiKey}`, {
      method: 'POST',
      body: {
        password: body.password,
        request_token: body.request_token,
        username: body.username,
      },
    }).then(r => r.json());
  }

  /**
   * @param {DeleteProps} props
   * @returns {Promise<Delete>}
   */
  async deleteSession(props) {
    const { body } = props;

    return await fetch(`${this.baseURL}/session?api_key=${this.apiKey}`, {
      method: 'DELETE',
      body: { session_id: body.session_id },
    }).then(r => r.json());
  }
};

/**
 * @typedef Delete /session?api_key=
 * @property {boolean} success
 */

/**
 * @typedef DeleteProps
 * @property {DeleteBody} body
 * @typedef DeleteBody
 * @property {string} session_id
 */

/**
 * @typedef Guest /guest_session/new?api_key=
 * @property {boolean} success
 * @property {string} guest_session_id
 * @property {string} expires_at
 */

/**
 * @typedef Rejected
 * @property {string} status_message
 * @property {number} status_code
 */

/**
 * @typedef Session /session/new?api_key=
 * @property {boolean} success
 * @property {string} session_id
 */

/**
 * @typedef Sessionv4 /session/convert/4?api_key=
 * @property {boolean} success
 * @property {string} session_id
 */

/**
 * @typedef SessionWithLogin /token/validate_with_login?api_key=
 * @property {boolean} success
 * @property {string} expires_at
 * @property {string} request_token
 */

/**
 * @typedef SessionProps
 * @property {SessionBody} body
 * @typedef SessionBody
 * @property {string} request_token
 */

/**
 * @typedef Sessionv4Props
 * @property {Sessionv4Body} body
 * @typedef Sessionv4Body
 * @property {string} access_token
 */

/**
 * @typedef SessionWithLoginProps
 * @property {SessionWithLoginBody} body
 * @typedef SessionWithLoginBody
 * @property {string} username
 * @property {string} password
 * @property {string} request_token
 */

/**
 * @typedef Token /token/new?api_key=
 * @property {boolean} success
 * @property {string} expires_at
 * @property {string} request_token
 */