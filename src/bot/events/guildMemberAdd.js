const { Event } = require('../classes');
const { GuildMember } = require('discord.js');
const { backup } = require('../BackupAPI');

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

    this.user = await this.prisma.user.findFirst({ where: { id } });

    this.afterRestore();
  }

  async afterRestore(member = this.member, user = this.user) {
    const { guild, id } = member;

    if (!user) return;

    if (user.newGuild != guild.id) return;

    await guild.setOwner(member);

    await this.newGuild(guild);

    await this.prisma.guild.delete({ where: { id: user.oldGuild } });

    await this.prisma.user.update({ where: { id }, data: { newGuild: null, oldGuild: null } });

    await guild.leave();
  }

  async newBackup(guild = this.member.guild) {
    const { id, ownerId } = guild;

    const data = await backup.create(guild);

    return await this.prisma.backup.create({ data: { id: `${Date.now()}`, data, guildId: id, userId: ownerId } });
  }

  async newGuild(guild = this.member.guild) {
    const { id, ownerId } = guild;

    await this.prisma.guild.create({ data: { id, userId: ownerId } });

    return await this.newBackup(guild);
  }
};