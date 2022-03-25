import { BackupData } from 'discord-backup/lib/types';
import { filterObjectByKeys } from '../util';
import { guild, roles } from './defaults';

export default class Restore {
  backup: BackupData;
  options: any;
  private data!: Partial<BackupData>;

  constructor(backup: any, options: any) {
    this.backup = backup?.data || backup;
    this.options = options;
  }

  /** @private */
  create(backup = this.backup) {
    this.data = backup;
    this.data.channels = this.channelsDefaults() as any;
    this.data = this.guildDefaults();

    delete this.data.roles;
    return this;
  }

  channelsDefaults(backup = this.backup) {
    const { type, name } = backup.channels.categories[0].children[0];

    return [{ name, type }];
  }

  rolesDefaults(backup: any = this.backup) {
    return backup.roles.map((role: any) => filterObjectByKeys(role, roles));
  }

  guildDefaults(backup = this.backup) {
    return filterObjectByKeys(backup, guild);
  }

  static create(backup: any, options: any) {
    const restore = new Restore(backup, options);

    restore.create();

    return restore;
  }

  static filter(backup: any, options: any) {
    const restore = new Restore(backup, options);

    restore.guildDefaults();

    return restore;
  }
}