const { Guild, GuildChannel } = require('discord.js');
const Backup = require('discord-backup');
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
    this.roles_filtered = [];

    backup.roles.forEach(role => {
      const role_filtered = {};

      defaults.roles.forEach(key => {
        if (typeof role[key] !== 'undefined')
          Object.assign(role_filtered, { [key]: role[key] });
      });

      this.roles_filtered.push(role_filtered);
    });

    return this.roles_filtered;
  }

  guildDefaults(backup = this.backup) {
    this.guild_filtered = {};

    defaults.guild.forEach(value => {
      if (typeof backup[value] !== 'undefined')
        Object.assign(this.guild_filtered, { [value]: backup[value] });
    });

    return this.guild_filtered;
  }

  static create(backup, options) {
    const restore = new this(backup, options);

    restore.create();

    return restore;
  }
};