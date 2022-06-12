import { ButtonInteraction, Client } from 'discord.js';
import { BanCustomId } from '../../@types';
import { ButtonComponentInteraction } from '../../structures';

export default class Ban extends ButtonComponentInteraction {
  constructor(client: Client) {
    super(client, {
      name: 'ban',
      description: 'Ban Button Component',
    });
  }

  async execute(interaction: ButtonInteraction<'cached'>) {
    const { customId } = interaction;

    const { sc } = <BanCustomId>JSON.parse(customId);

    this[<'chunk'>sc]?.(interaction);
  }

  async chunk(interaction: ButtonInteraction<'cached'>) {
    const { guild, member, message } = interaction;

    const usersId = message.embeds[0].description?.match(/\d{17,}/g) ?? [];

    const reason = `${member.displayName}: ${message.embeds[0].fields[0].value}`.slice(0, 512);

    const days = parseInt(message.embeds[0].fields[1].value);

    const failed: string[] = [];

    const banUsers = usersId.map(id => guild.members.fetch(id).then(user =>
      (user.bannable && this.isBannable({ author: member, guild, target: user })) ?
        guild.bans.create(id, { days, reason }).catch(() => failed.push(`<@${id}>`) && undefined) :
        failed.push(`<@${id}>`) && undefined));

    const bannedUsers = await Promise.all(banUsers)
      .then(bans => bans.filter(ban => ban));

    message.embeds[0]
      .setDescription(failed.length ? `Failed: ${failed.join(' ')}.`.slice(0, 4096) : '')
      .setFields([{
        name: 'Amount of banned users',
        value: `${bannedUsers.length}/${usersId.length}`,
      }])
      .setTitle('Chunk Ban Result');

    await interaction.update({ components: [], embeds: message.embeds });
  }
}