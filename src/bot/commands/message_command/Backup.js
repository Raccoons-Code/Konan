const { Command } = require('../../classes');
const { Message } = require('discord.js');
const { restore } = require('../../BackupAPI');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'backup',
      description: 'description',
    });
  }

  /** @param {Message} message */
  async execute(message) {
    message.delete().catch(() => null);
    this.message = message;

    const { args, author } = message;

    if (!author.bot) return;

    this[args.shift()]?.();
  }

  async guilds(message = this.message) {
    const { client } = message;

    await this.client.util.waitAsync(100);

    await message.reply(`${client.guilds.cache.size}`);
  }

  async restore(message = this.message) {
    const { args, client } = message;

    const [guildId, key, userId] = args;

    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      include: { backups: { where: { id: key } } },
    });

    if (!user.backups.length) return;

    const [backup] = user.backups;

    const backup_filtered = restore.create(backup.data);

    const newGuild = await client.guilds.create(backup.data.name, backup_filtered);

    await this.prisma.user.update({
      where: { id: backup.userId },
      data: { newGuild: newGuild.id, oldGuild: guildId },
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