const { Event } = require('../classes');
const { GuildMember } = require('discord.js');
const { restore } = require('../BackupAPI');

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      intents: ['GUILD_MEMBERS'],
      name: 'guildMemberAdd',
      partials: ['GUILD_MEMBER', 'USER'],
    });
  }

  /** @param {GuildMember} member */
  async execute(member) {
    this.member = member;

    const { id } = member;

    const user = this.user = await this.prisma.user.findFirst({
      where: { id },
      include: { backups: true, guilds: true },
    });

    this.afterRestore(member, user);
  }

  async afterRestore(member = this.member, user = this.user) {
    const { guild, id } = member;

    if (!user) return;

    if (user.newGuild != guild.id) return;

    await guild.setOwner(member);

    await this.prisma.user.update({ where: { id }, data: { newGuild: null, oldGuild: null } });
  }
};