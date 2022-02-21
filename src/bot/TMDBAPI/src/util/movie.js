module.exports = new class {
  constructor(options) {
    this.apiKey = process.env.TMDB_APIKEY;
    this.baseURL = 'https://www.themoviedb.org/movie';
    this.language = 'en-US';
  }

  /**
   * @param {MovieURLProps} props
   */
  movieURL(props) {
    const { id } = props;

    const movieURLProps = [
      this.baseURL,
      '/', id,
    ];

    return movieURLProps.join('');
  }
};

/**
 * @typedef MovieURLProps
 * @property {number} id
 */