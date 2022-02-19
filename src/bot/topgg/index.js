if (!process.env.TOPGG_TOKEN) return;

const { AutoPoster } = require('topgg-autoposter');

module.exports = class {
  static AutoPoster(client) {
    /* const ap =  */AutoPoster(process.env.TOPGG_TOKEN, client);

    /* ap.on('posted', () => {
      console.log('Posted stats to Top.gg!');
    }); */
  }
};