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

    if (backup) {
      if (!backup.premium)
        backup.data.emojis = [];

      await Backup.load(backup.data, guild, {
        clearGuildBeforeRestore: true,
        maxMessagesPerChannel: backup.premium ? 50 : 0,
      });
    }

    const m = backup?.data.channels.categories.reduce((pca, cca) =>
      pca + (cca.children?.reduce((pch, cch) => pch + (cch.messages?.length || 0) || 0), 0), 0) || 0;

    setTimeout(async () => {
      await guild.setOwner(member);

      await this.prisma.user.update({ where: { id }, data: { newGuild: null, oldGuild: null } });

      await guild.leave();
    }, isNaN(m) ? 0 : m * 1000);
  }
};