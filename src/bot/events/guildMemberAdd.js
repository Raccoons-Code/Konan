const { Event } = require('../classes');
const Backup = require('discord-backup');

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      intents: ['GUILD_MEMBERS'],
      name: 'guildMemberAdd',
      partials: ['GUILD_MEMBER', 'USER'],
    });
  }

  async execute(member = this.GuildMember) {
    const { id } = member;

    const user = this.user = await this.prisma.user.findFirst({
      where: { id },
      include: { backups: true, guilds: true },
    });

    this.afterRestore(member, user);
  }

  async afterRestore(member = this.GuildMember, user = this.user) {
    const { guild, id } = member;

    if (!user) return;

    if (user.newGuild != guild.id) return;

    const backup = user.backups.find(b => b.guildId === user.oldGuild);

    if (!backup.premium)
      backup.data.emojis = [];

    await Backup.load(backup.data, guild, {
      clearGuildBeforeRestore: true,
      maxMessagesPerChannel: backup.premium ? 50 : 0,
    });

    await guild.setOwner(member);

    await this.prisma.user.update({ where: { id }, data: { newGuild: null, oldGuild: null } });

    await guild.leave();
  }
};