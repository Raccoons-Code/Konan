const { Guild } = require('discord.js');

module.exports = class {
  /**
   * @param {Guild} guild
   * @param {options} [options]
   */
  constructor(guild, options) {
    this.guild = guild;
    this.options = options;
  }

  /**
   * @param {Guild} guild
   * @param {options} [options]
   */
  async create(guild = this.guild) {
    this.backup = guild.toJSON();
    this.backup.icon = guild.iconURL();
    this.backup.channels = await this.getChannels();
    this.backup.roles = this.getRoles();
    return this.backup;
  }

  async getChannels(guild = this.guild, options = this.options) {
    const channels = guild.channels.cache;

    if (!channels.size)
      return this.channels = channels.toJSON();

    this.channels = channels.toJSON();

    for (let i = 0; i < this.channels.length; i++) {
      const channel = this.channels[i];

      this.channel = channel.toJSON();

      if (channel.permissionOverwrites.cache) {
        this.channel.permissionOverwrites = channel.permissionOverwrites.cache.map(permission => {
          if (typeof permission.deny === 'object')
            permission.deny = permission.deny.toJSON();

          if (typeof permission.allow === 'object')
            permission.allow = permission.allow.toJSON();

          return permission.toJSON();
        });
      }

      if (options.premium) {
        if (channel.messages?.cache?.size) {
          const messages = await channel.messages.fetch();
          this.channel.messages = messages.map(message => message.toJSON());
        }
      }

      this.channels[i] = this.channel;
    }

    return this.channels;
  }

  getRoles(guild = this.guild) {
    return this.roles = guild.roles.cache.map(role => role.toJSON());
  }

  /**
   * @param {Guild} guild
   * @param {options} [options]
   */
  static async create(guild, options) {
    const backup = new this(guild, options || {});

    await backup.create();

    return backup.backup;
  }
};

const options = {
  premium: Boolean(),
};