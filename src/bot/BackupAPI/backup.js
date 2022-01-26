module.exports = class {
  constructor(guild) {
    this.guild = guild;
  }

  /** @private */
   newBackup() {
    this.backup = this.guild.toJSON();
    this.backup.icon = this.guild.iconURL();
    this.backup.channels = this.getChannels();
    this.backup.roles = this.getRoles();
    return this.backup;
  }

  getChannels(guild = this.guild) {
    this.channels = guild.channels.cache;
    if (!this.channels) return this.channels;
    this.channels = this.channels.map(channel => {
      if (!channel.permissionOverwrites.cache) return channel.toJSON();
      channel.permissionOverwrites = channel.permissionOverwrites.cache.map(permission => {
        permission.deny = permission.deny.toJSON();
        permission.allow = permission.allow.toJSON();
        return permission = permission.toJSON();
      });
      return channel.toJSON();
    });
    return this.channels;
  }

  getRoles(guild = this.guild) {
    return this.roles = guild.roles.cache.map(role => role.toJSON());
  }

  static create(guild) {
    const backup = new this(guild);
    backup.newBackup();
    return backup.backup;
  }
};