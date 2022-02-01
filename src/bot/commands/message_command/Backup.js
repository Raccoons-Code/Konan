const { Command } = require('../../classes');
const { restore } = require('../../BackupAPI');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'backup',
      description: 'Bot restricted backup command.',
    });
  }

  async execute(message = this.Message) {
    const { args, author } = message;

    if (!author.bot) return;

    message.delete().catch(() => null);

    this[args.shift()]?.(message);
  }

  async guilds(message = this.Message) {
    const { client } = message;

    await this.util.waitAsync(100);

    await message.reply(`${client.guilds.cache.size}`);
  }

  async restore(message = this.Message) {
    const { args, client, guild } = message;

    const [guildId, key, userId] = args;

    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      include: { backups: { where: { id: key } } },
    });

    if (!user.backups.length) return;

    const [backup] = user.backups;

    const backup_filtered = restore.create(backup);

    const newGuild = await client.guilds.create(backup.data.name, backup_filtered);

    await this.prisma.user.update({
      where: { id: userId },
      data: { newGuild: newGuild.id, oldGuild: guildId },
    }).catch(() => null);

    const channel = newGuild.channels.cache.find(_channel => _channel.type === 'GUILD_TEXT');

    const invite = await channel.createInvite();

    await this.util.waitAsync(100);

    await message.reply(`${invite}`);

    setTimeout(async () => {
      const member = guild.members.resolve(userId) ||
        await guild.members.fetch(userId);

      if (guild.available && member) {
        await guild.setOwner(userId);

        return await guild.leave();
      }

      newGuild.delete().then(async () => {
        console.log(newGuild.name, 'deleted!');

        await this.prisma.user.update({
          where: { id: userId },
          data: { newGuild: null, oldGuild: null },
        }).catch(() => null);
      }).catch(() => null);
    }, 60000);
  }
};