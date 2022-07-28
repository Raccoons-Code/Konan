import { APIRole, Role } from 'discord.js';

export interface ManageButtonRolesOptions {
  roles: (APIRole | Role)[];
}

export interface ManageSelectRolesOptions {
  roles: (APIRole | Role)[];
  defaultRole?: Role | null;
  menuPlaceholder?: string | null;
}