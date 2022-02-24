const { Guild, GuildChannel } = require('discord.js');
const { filterObjectByKeys } = require('../util');
const defaults = require('./defaults.json');

module.exports = class {
  constructor(backup, options) {
    this.backup = backup?.data || backup;
    this.options = options;
  }

  /** @private */
  create(backup = this.backup) {
    this.data = backup;
    this.data.channels = this.channelsDefaults();
    this.data = this.guildDefaults();

    delete this.data.roles;
    return this;
  }

  channelsDefaults(backup = this.backup) {
    const { type, name } = backup.channels.categories[0].children[0];

    return [{ name, type }];
  }

  rolesDefaults(backup = this.backup) {
    return backup.roles.map(role => filterObjectByKeys(role, defaults.roles));
  }

  guildDefaults(backup = this.backup) {
    return filterObjectByKeys(backup, defaults.guild);
  }

  static create(backup, options) {
    const restore = new this(backup, options);

    restore.create();

    return restore;
  }

  static filter(backup, options) {
    const restore = new this(backup, options);

    restore.guildDefaults();

    return restore;
  }
};