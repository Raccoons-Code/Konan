const { Command } = require('../../structures');
const { Restore } = require('../../BackupAPI');

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: 'backup',
      description: 'Bot restricted backup command.',
    });
  }

  async execute(message = this.Message) {
    const { args, author } = message;

    if (!author.bot) return;

    message.delete().catch(() => null);

    await this[args.shift()]?.(message);
  }

  async guilds(message = this.Message) {
    const { args, client } = message;

    await this.util.waitAsync(100);

    const { size } = client.guilds.cache;

    const { userId } = this.util.parseJSON(args.join(' '));

    await message.reply(`${JSON.stringify({ size, userId })}`);
  }

  async restore(message = this.Message) {
    const { args, client } = message;

    const { guildId, key, userId } = this.util.parseJSON(args.join(' '));

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

    await message.reply(JSON.stringify({ guildId, invite, key, userId }));

    setTimeout(async () => {
      if (newGuild.available) {
        const member = await newGuild.members.fetch(userId);

        if (member) return;
      }

      await newGuild.delete().then(async () => {
        console.log(newGuild.name, 'deleted!');

        await this.prisma.user.update({
          where: { id: userId },
          data: { newGuild: null, oldGuild: null },
        }).catch(() => null);
      }).catch(() => null);
    }, 60000);
  }
};