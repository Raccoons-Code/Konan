module.exports = new class {
  constructor(options) {
    this.apiKey = process.env.TMDB_APIKEY;
    this.baseURL = 'https://image.tmdb.org/t/p';
    this.language = 'en-US';
  }

  /**
   * @param {ImageURLProps} props
   */
  imageURL(props) {
    const { path, size = 'original' } = props;

    const imageURLProps = [
      this.baseURL,
      '/', typeof size === 'number' ? `w${size}` : size,
      path,
    ];

    return imageURLProps.join('');
  }
};

/**
 * @typedef ImageURLProps
 * @property {string} path
 * @property {string|number} [size='original']
 */