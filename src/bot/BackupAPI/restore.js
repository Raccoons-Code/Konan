const defaults = require('./defaults.json');

module.exports = class {
  constructor(backup) {
    this.backup = backup;
  }

  /** @private */
  newRestore(backup = this.backup) {
    this.restore = backup;
    this.restore.channels = this.channelsDefaults();
    this.restore.roles = this.rolesDefaults();
    this.restore = this.guildDefaults();
    return this.restore;
  }

  channelsDefaults(backup = this.backup) {
    this.channels_filtered = [];

    backup.channels.forEach(channel => {
      const _channel_filtered = {};

      defaults.channels.forEach(key => {
        const _permissions = [];

        if (typeof channel[key] !== 'undefined')
          Object.assign(_channel_filtered, { [key]: channel[key] });

        if (key === 'permissionOverwrites')
          defaults.permissionOverwrites.forEach(_key => {
            if (typeof channel[key][_key] !== 'undefined')
              _permissions.push({ [_key]: channel[key][key] });
          });

        _channel_filtered.permissionOverwrites = _permissions;
      });

      this.channels_filtered.push(_channel_filtered);
    });

    return this.channels_filtered;
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

  static create(backup) {
    const restore = new this(backup);
    restore.newRestore();
    return restore.restore;
  }
};