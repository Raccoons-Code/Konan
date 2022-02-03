const { Command } = require('../../classes');
const { Restore } = require('../../BackupAPI');
const Backup = require('discord-backup');

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

    const { guildId, key, userId } = JSON.parse(args.join(' '));

    if (!guildId || !key || !userId) return;

    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      include: { backups: { where: { id: key } } },
    });

    if (!user.backups.length) return;

    const [backup] = user.backups;

    const restore = Restore.create(backup);

    const newGuild = await client.guilds.create(backup.data.name, restore.data);

    await this.prisma.user.update({
      where: { id: userId },
      data: { newGuild: newGuild.id, oldGuild: guildId },
    }).catch(() => null);

    const channel = newGuild.channels.cache.find(c => c.type === 'GUILD_TEXT');

    const invite = await channel.createInvite();

    await this.util.waitAsync(100);

    await message.reply(`${invite}`);

    setTimeout(async () => {
      const member = newGuild.members.resolve(userId) ||
        await newGuild.members.fetch(userId);

      if (newGuild.available && member) return;

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