const { AutoPoster } = require('topgg-autoposter');

module.exports = class {
  constructor(client) {
    this.client = client;

    this.TOPGG_TOKEN = process.env.TOPGG_TOKEN;
  }

  AutoPoster(client = this.client, token = this.TOPGG_TOKEN) {
    AutoPoster(token, client);
  }

  static AutoPoster(client) {
    if (!process.env.TOPGG_TOKEN) return;

    new this(client).AutoPoster(client);
  }
};