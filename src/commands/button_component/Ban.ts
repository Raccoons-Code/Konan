import { ButtonInteraction, Client, EmbedBuilder } from 'discord.js';
import { BanCustomId } from '../../@types';
import { ButtonComponentInteraction } from '../../structures';

export default class Ban extends ButtonComponentInteraction {
  [k: string]: any;

  constructor(client: Client) {
    super(client, {
      name: 'ban',
      description: 'Ban Button Component',
    });
  }

  async execute(interaction: ButtonInteraction<'cached'>) {
    const { customId } = interaction;

    const { sc } = <BanCustomId>JSON.parse(customId);

    this[sc]?.(interaction);
  }

  async chunk(interaction: ButtonInteraction<'cached'>) {
    const { guild, member, message } = interaction;

    const usersId = message.embeds[0].description?.match(/\d{17,}/g) ?? [];

    const reason = `${member.displayName}: ${message.embeds[0].fields?.[0].value}`.slice(0, 512);

    const deleteMessageDays = parseInt(`${message.embeds[0].fields?.[1].value}`);

    const failed: string[] = [];

    const banUsers = guild.members.fetch({ user: usersId })
      .then(collection => collection.toJSON().map(user =>
        (user.bannable && this.isBannable({ author: member, guild, target: user })) ?
          guild.bans.create(user.id, { deleteMessageDays, reason })
            .catch(() => failed.push(`<@${user.id}>`) && undefined) :
          failed.push(`<@${user.id}>`) && undefined));

    const bannedUsers = await Promise.resolve(banUsers.then(promises => Promise.all(promises)));

    const embeds = [
      new EmbedBuilder()
        .setDescription(failed.length ? `❌ ${failed.join(' ')}`.slice(0, 4096) : null)
        .setFields([{
          name: 'Amount of banned users',
          value: `${bannedUsers.length}/${usersId.length}`,
        }])
        .setTitle('Chunk Ban Result'),
    ];

    return interaction.update({ components: [], embeds });
  }
}