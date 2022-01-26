const { Command } = require('../../classes');
const { Message } = require('discord.js');
const { Restore } = require('../../BackupAPI');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'backup',
      description: 'description',
    });
  }

  /** @param {Message} message */
  async execute(message) {
    this.message = message;

    const { args } = message;

    this[args.shift()]?.();
  }

  async guilds(message = this.message) {
    const { client } = message;

    await this.client.util.waitAsync(100);

    await message.reply(`${client.guilds.cache.size}`);
  }

  async restore(message = this.message) {
    const { args, client } = message;

    const guild_id = args.shift();
    const key = args.shift();

    const backup = await this.prisma.backup.findFirst({ where: { id: key, guildId: guild_id } });

    if (!backup) return;

    const backup_filtered = Restore.create(backup.data);

    const newGuild = await client.guilds.create(backup.data.name, backup_filtered);

    await this.prisma.user.update({
      where: { id: backup.userId },
      data: { newGuild: newGuild.id, oldGuild: backup.guildId },
    }).catch(() => null);

    const channels = newGuild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT');

    const invite = await channels.last().createInvite();

    await this.client.util.waitAsync(100);

    await message.reply(`${invite}`);

    setTimeout(async () => {
      newGuild.delete().then(async () => {
        console.log(newGuild.name, 'deleted!');

        await this.prisma.user.update({
          where: { id: backup.userId },
          data: { newGuild: null, oldGuild: null },
        }).catch(() => null);
      }).catch(() => null);
    }, 60000);
  }
};