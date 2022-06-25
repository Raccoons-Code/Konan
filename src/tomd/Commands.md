<!-- markdownlint-disable MD032 MD033 -->

# Commands

Last modified: June 24, 2022

## Application Commands (/) - 24

**Optional**: [`foo`]  
**Required**: <`foo`>  
**Sub Command Group | Sub Command**: {`foo`}

---

### General - 1

#### help [`command`]

> Show the help message.
- [`command`]: The command to show the help message for. - `Autocomplete`

---

### Game - 3

#### guess <`number`>

> You have 10 chances to guess the number from 1 to 100 that the bot set.
- <`number`>: Guess a number. - `Autocomplete`

#### jankenpon {`game`  | `spock`}

> Play a game of Jankenpon with your friends

- {`game`}: The normal game to play.

  - {`single`}: Human vs machine.
    - <`jankenpon`>: The jankenpon to play.

  - {`multiplayer`}: Human vs human.
    - <`opponent`>: Choose your opponent.

- {`spock`}: A Spock version of Jankenpon.

  - {`single`}: Human vs machine.
    - <`jankenpon`>: The jankenpon to play.

  - {`multiplayer`}: Human vs human.
    - <`opponent`>: Choose your opponent.

#### tictactoe [`opponent`]

> Play a game of Tic Tac Toe with your friends! - Powered by Discord TicTacToe.
- [`opponent`]: Choose an opponent.

---

### Fun - 5

#### echo <`message`>

> Echo your message.
- <`message`>: Message to echo back.

#### movies {`list`  | `search`}

> Search, list and see details of movies.

- {`list`}: List all movies.
  - [`page`]: The page of the list.

- {`search`}: Search the movies.
  - <`keyword`>: The keyword to search. - `Autocomplete`

#### news [`category`] [`language`] [`journal`] [`new`]

> Show news from a journal. Use `/news [category | language] <journal> <new>`
- [`category`]: Category of the journal. - `Autocomplete`
- [`language`]: Language of the journal. - `Autocomplete`
- [`journal`]: Journal to show the news from. - `Autocomplete`
- [`new`]: Show the new. Select a journal before. - `Autocomplete`

#### random [`type`]

> Replies with random images.
- [`type`]: Select the type of the random image.

#### say <`message`>

> Say something in TTS. - Powered by Google TTS.
- <`message`>: The message to say.

---

### Moderation - 7

#### ban {`single`  | `chunk`}

> Bans a user from the server.

- {`single`}: Bans a user.
  - <`user`>: Select a user to ban.
  - [`delete_messages`]: How much of that person's message history should be deleted.
  - [`reason`]: The reason for the ban.

- {`chunk`}: Bans a chunk of users from the server.
  - <`users`>: Input a chunk of users to ban.
  - [`delete_messages`]: How much of that person's message history should be deleted.
  - [`reason`]: The reason for the ban.

#### buttonroles {`create`  | `edit`  | `add`  | `remove`  | `bulk`}

> Manage button roles.

- {`create`}: Create a button role.
  - <`role`>: Select the role to use.
  - [`text`]: The Button Role text. Title {0,256} | Description {0,4096} - default: ButtonRoles
  - [`button_name`]: The name of the button. Button name {0,63} - default: <role>
  - [`button_emoji`]: The emoji of the button.
  - [`button_disabled`]: Whether the button is disabled.
  - [`button_style`]: Select the style of the button. default: PRIMARY
  - [`channel`]: Select the channel. default: <current channel>

- {`edit`}: Edit a button role.

  - {`message`}: Edit a text in a Button role.
    - <`channel`>: Select the channel.
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`text`>: Input new text. Title {0,256} | Description {0,4096}

  - {`button`}: Edit a button in a Button role.
    - <`channel`>: Select the channel.
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`button`>: Select the button. - `Autocomplete`
    - [`role`]: Select a new role.
    - [`button_name`]: Input a new name. {0,63}
    - [`button_style`]: Select a new style.
    - [`button_emoji`]: Input a new emoji.
    - [`button_disabled`]: Whether the button is disabled.

- {`add`}: Add to Button role.

  - {`button`}: Add a new button in a Button role.
    - <`channel`>: Select the channel.
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`role`>: Select the role.
    - [`button_name`]: Input the name of the button. {0,63} - default: <role>
    - [`button_style`]: Select the style of the button. default: PRIMARY
    - [`button_emoji`]: Input the emoji of the button.
    - [`button_disabled`]: Whether the button is disabled.

- {`remove`}: Remove from a Button role.

  - {`button`}: Remove a button from a Button role.
    - <`channel`>: Select the channel.
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`button`>: Select the button. - `Autocomplete`

- {`bulk`}: Bulk manage Button roles.

  - {`create`}: Create a bulk of buttons in a Button role.
    - <`roles`>: Input the roles.
    - [`text`]: The Button Role text. Title {0,256} | Description {0,4096} - default: ButtonRoles
    - [`channel`]: Select the channel. default: <current channel>

  - {`add`}: Add to a bulk of buttons in a Button role.
    - <`channel`>: Select the channel.
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`roles`>: Input the roles.

  - {`remove`}: Remove from a bulk of buttons in a Button role.
    - <`channel`>: Select the channel.
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`roles`>: Input the roles.

#### clear <`amount`> [`channel`]

> Deletes up to 1000 channel messages at once.
- <`amount`>: The amount of messages to delete.
- [`channel`]: Select a channel to clear.

#### kick <`user`> [`reason`]

> Kicks a user from the server.
- <`user`>: The user to kick.
- [`reason`]: The reason to kick.

#### selectroles {`create`  | `edit`  | `add`  | `remove`  | `bulk`}

> Manage roles with a select menu.

- {`create`}: Create a select menu.
  - <`role`>: Select a role to add to the select menu.
  - [`item_name`]: The name of the item. {0,83} - default: <role>
  - [`item_description`]: The description of the item. {0,100}
  - [`item_default`]: Used to always add this role with other roles.
  - [`item_emoji`]: The emoji of the item.
  - [`menu_disabled`]: Whether the menu is disabled.
  - [`menu_place_holder`]: The placeholder of the menu. {0,150}
  - [`text`]: The text of the message. Title {0,256} | Description {0,4096} - default: SelectRoles
  - [`channel`]: The channel of the setup. default: <current channel>

- {`edit`}: Edit the Select roles.

  - {`message`}: Edit a text in a Select role.
    - <`channel`>: Select the channel of the message.
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`text`>: The text of the message. Title {0,256} | Description {0,4096}

  - {`menu`}: Edit a select menu.Edit the menu of the Select roles.
    - <`channel`>: Select the channel of the menu.
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`menu`>: Select the menu. - `Autocomplete`
    - [`menu_disabled`]: Whether the menu is disabled.
    - [`menu_place_holder`]: The place holder of the menu. {0,150}

  - {`item`}: Edit the item of the Select roles.
    - <`channel`>: Select the channel of the item.
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`menu`>: Select the menu of the item. - `Autocomplete`
    - <`item`>: Select the item. - `Autocomplete`
    - [`role`]: Select a new role.
    - [`item_name`]: Input a new name for the item. {0,83}
    - [`item_description`]: Input a new description for the item. {0,100}
    - [`item_default`]: Used to always add this role with other roles.
    - [`item_emoji`]: Input a new emoji for the item.

- {`add`}: Add to the Select roles.

  - {`menu`}: Add a menu to the Select roles.
    - <`channel`>: Select the channel of the menu.
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`role`>: Select a role to add to the menu.
    - [`item_name`]: The name of the item. {0,83} - default: <role>
    - [`item_description`]: The description of the item. {0,100}
    - [`item_default`]: Used to always add this role with other roles.
    - [`item_emoji`]: The emoji of the item.
    - [`menu_disabled`]: Whether the menu is disabled.
    - [`menu_place_holder`]: The place holder of the menu. {0,150}

  - {`item`}: Add an item to the Select roles.
    - <`channel`>: Select the channel of the item.
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`menu`>: Select the menu of the item. - `Autocomplete`
    - <`role`>: Select a role to add to the item.
    - [`item_name`]: The name of the item. {0,83} - default: <role>
    - [`item_description`]: The description of the item. {0,100}
    - [`item_default`]: Used to always add this role with other roles.
    - [`item_emoji`]: The emoji of the item.

- {`remove`}: Remove from the Select roles.

  - {`menu`}: Remove a menu from the Select roles.
    - <`channel`>: Select the channel of the menu.
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`menu`>: Select the menu to remove. - `Autocomplete`

  - {`item`}: Remove an item from the Select roles.
    - <`channel`>: Select the channel of the item.
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`menu`>: Select the menu of the item. - `Autocomplete`
    - <`item`>: Select the item to remove. - `Autocomplete`

- {`bulk`}: Bulk manage Select roles.

  - {`create`}: Create a bulk of options in a Select role.
    - <`roles`>: Input the roles.
    - [`text`]: The Select Role text. Title {0,256} | Description {0,4096} - default: SelectRoles
    - [`channel`]: Select the channel. default: <current channel>
    - [`default_role`]: Select the default role.
    - [`menu_place_holder`]: The menu place holder. {0,150}

  - {`add`}: Add to a bulk of options in a Select role.
    - <`channel`>: Select the channel.
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`roles`>: Input the roles.
    - [`default_role`]: Select the default role.
    - [`menu_place_holder`]: The menu place holder. {0,150}

  - {`remove`}: Remove from a bulk of options in a Select role.
    - <`channel`>: Select the channel.
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`roles`>: Input the roles.

#### timeout <`user`> <`time`> [`reason`]

> Temporarily mute a user.
- <`user`>: The user to mute.
- <`time`>: The time to mute the user for.
- [`reason`]: The reason to mute the user.

#### unban <`user`> [`reason`]

> Revoke a user's ban.
- <`user`>: User ID - `Autocomplete`
- [`reason`]: The reason to unban.

---

### Utility - 8

#### avatar [`user`]

> Replies with the user's profile picture.
- [`user`]: Select a user to get their profile picture.

#### backup {`create`  | `delete`  | `list`  | `restore`  | `update`}

> Make backup for your server - Powered by Discord Backup.

- {`create`}: Create a new backup. Only on server!

- {`delete`}: If you are on a server, you will manage server backups.

  - {`server`}: Delete backups from a server.
    - <`id`>: The id of the server to delete. - `Autocomplete`

  - {`backup`}: Delete a backup.
    - <`key`>: The key of the backup to delete. - `Autocomplete`

- {`list`}: If you are on a server, this shows the backups for that server.

- {`restore`}: If you are on a server, you will manage server backups.

  - {`backup`}: Restore a backup.
    - <`key`>: The key of the backup to restore. - `Autocomplete`
    - [`clear_server`]: Clear the server before restoring?

- {`update`}: Update a backup. Only on server!
  - <`key`>: The key of the backup to update. - `Autocomplete`

#### embed {`send`  | `edit`}

> Send a embed message.

- {`send`}: Send an embed.
  - <`embed`>: The embed to send. Title {0,256} | Description {0,4096}
  - [`attachment`]: The attachment to send.
  - [`channel`]: The channel to send.
  - [`content`]: The content to send.

- {`edit`}: Edit an embed.

  - {`embed`}: Edit an embed.
    - <`channel`>: The channel of the embed.
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - [`attachment`]: The attachment of the embed.
    - [`embed`]: The embed to edit. Title {0,256} | Description {0,4096}
    - [`content`]: The content of the message.

#### info {`application`  | `channel`  | `role`  | `server`  | `user`}

> Show the info message.

- {`application`}: Show the bot info.

- {`channel`}: Show the channel info.
  - [`channel`]: Select a channel to show the info for.

- {`role`}: Role info.
  - <`role`>: Select a role to show the info for.

- {`server`}: Show the server info.

- {`user`}: Show the user info.
  - [`user`]: Select a user to show the info for.

#### number_is_prime <`number`>

> Verify if number is prime.
- <`number`>: Write a integer. Below 1,000,000,000 shows all numbers.

#### ping

> Replies with Pong!

#### translate <`from`> <`to`> <`text`>

> Translate text from one language to another. - Powered by Google Translate Api.
- <`from`>: The language to translate from. - `Autocomplete`
- <`to`>: The language to translate to. - `Autocomplete`
- <`text`>: The text to translate. - `Autocomplete`

#### party <`activity`> [`channel`]

> Create an activity party together - Powered by Discord Together.
- <`activity`>: Select an activity. - `Autocomplete`
- [`channel`]: Select a voice channel.
