<!-- markdownlint-disable MD032 MD033 -->

# Commands

Last modified: April 21, 2022

## Application Commands (/) - 24

**Optional**: [`foo`]  
**Required**: <`foo`>  
**Sub Command Group | Sub Command**: {`foo`}

---

### General - 1

#### help [`command`]

> Replies with Help!
- [`command`]: Select a command - `Autocomplete`

---

### Game - 3

#### guess <`number`>

> You have 10 chances to guess the number from 1 to 100 that the bot set.
- <`number`>: Integer - `Autocomplete`

#### jankenpon {`game`  | `spock`}

> Play a game of Jankenpon with your opponent.

- {`game`}: Play a game of Jankenpon with your friends!

  - {`single`}: Human vs machine.
    - <`jankenpon`>: Jankenpon.

  - {`multiplayer`}: Human vs human.
    - <`opponent`>: Choose your opponent.

- {`spock`}: A Spock version of Jankenpon.

  - {`single`}: Human vs machine.
    - <`jankenpon`>: Jankenpon.

  - {`multiplayer`}: Human vs human.
    - <`opponent`>: Choose your opponent.

#### tictactoe [`opponent`]

> Play a game of TicTacToe with your friends! - Powered by Discord TicTacToe.
- [`opponent`]: Choose your opponent

---

### Fun - 5

#### echo <`message`>

> Replies with your message!
- <`message`>: Message to echo back.

#### movies {`list`  | `search`}

> Search, list and see details of movies.

- {`list`}: List movies.
  - [`page`]: Page number.

- {`search`}: Search movies.
  - <`keyword`>: Search keyword. - `Autocomplete`

#### news [`category`] [`language`] [`journal`] [`new`]

> Show news from a journal. Use `/news [category | language] <journal> <new>`
- [`category`]: Category of the journal. - `Autocomplete`
- [`language`]: Language of the journal. - `Autocomplete`
- [`journal`]: Journal to show news from. - `Autocomplete`
- [`new`]: New to search. Select a journal before. - `Autocomplete`

#### random [`type`]

> Replies with random images.
- [`type`]: Select a type

#### say <`message`>

> Say something in TTS. - Powered by Google TTS.
- <`message`>: The message to say

---

### Moderation - 7

#### ban {`single`  | `chunk`}

> Bans a user from the server.

- {`single`}: Bans a user from the server.
  - <`user`>: The user to be banned.
  - [`delete_messages`]: How much of that person's message history should be deleted.
  - [`reason`]: The reason for banishment, if any.

- {`chunk`}: Bans a chunk of users from the server.
  - <`users`>: The list of users to ban.
  - [`delete_messages`]: How much of that person's message history should be deleted.
  - [`reason`]: The reason for the ban, if any.

#### buttonroles {`setup`  | `edit`  | `add`  | `remove`}

> A command to create a button role.

- {`setup`}: Create a button role.
  - <`role`>: Role.
  - [`text`]: Text: Title {0,256} | Description {0,4096} - default: ButtonRoles
  - [`button_name`]: Button name {0,63} - default: <role>
  - [`button_emoji`]: Button emoji
  - [`button_disabled`]: Set disabled - default: false
  - [`button_style`]: Button style - default: PRIMARY
  - [`channel`]: Channel - default: <current channel>

- {`edit`}: Edit a button role.

  - {`message`}: Edit a text in a Button role.
    - <`channel`>: Select a channel
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`text`>: Text: Title {1,256} | Description {0,4096}

  - {`button`}: Edit a button in a Button role.
    - <`channel`>: Select a channel
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`button`>: Button - `Autocomplete`
    - [`role`]: Select a role
    - [`button_name`]: Button name {0,63}
    - [`button_style`]: Button style
    - [`button_emoji`]: Button emoji
    - [`button_disabled`]: Set disabled

- {`add`}: Add to Button role.

  - {`button`}: Add a new button in a Button role
    - <`channel`>: Select a channel
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`role`>: Select a role
    - [`button_name`]: Button name {0,63} - default: <role>
    - [`button_style`]: Button style - default: PRIMARY
    - [`button_emoji`]: Button emoji
    - [`button_disabled`]: Set disabled - default: false

- {`remove`}: Remove from a Button role.

  - {`button`}: Remove a button from a Button role
    - <`channel`>: Select a channel
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`button`>: Button - `Autocomplete`

#### clear <`amount`> [`channel`]

> Deletes up to 1000 channel messages at once.
- <`amount`>: Amount of messages.
- [`channel`]: Select a channel to clear.

#### kick <`user`> [`reason`]

> Kicks a user from the server.
- <`user`>: The user to kick.
- [`reason`]: Reason for kick.

#### selectroles {`setup`  | `edit`  | `add`  | `remove`}

> A command to create a select menu for roles.

- {`setup`}: Create a select menu for roles.
  - <`role`>: Role.
  - [`item_name`]: Item name {0,83} - default: <role>
  - [`item_description`]: Item description {0,100}
  - [`item_emoji`]: Item emoji
  - [`menu_disabled`]: Set menu disabled - default: false
  - [`menu_place_holder`]: Menu place holder {0,150}
  - [`text`]: Text: Title {0,256} | Description {0,4096} - default: SelectRoles
  - [`channel`]: Channel - default: <current channel>

- {`edit`}: Edit a select menu for roles.

  - {`message`}: Edit a text in a Select menu role.
    - <`channel`>: Select a channel
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`text`>: Text: Title {0,256} | Description {0,4096}

  - {`menu`}: Edit a select menu.
    - <`channel`>: Select a channel
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`menu`>: Select menu - `Autocomplete`
    - [`menu_disabled`]: Set menu disabled
    - [`menu_place_holder`]: Menu place holder {0,150}

  - {`item`}: Edit a select menu item.
    - <`channel`>: Select a channel
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`menu`>: Select a menu. - `Autocomplete`
    - <`item`>: Select a menu item. - `Autocomplete`
    - [`role`]: Select a role
    - [`item_name`]: Item name {0,83}
    - [`item_description`]: Item description {0,100}
    - [`item_emoji`]: Item emoji

- {`add`}: Add to Select menu.

  - {`menu`}: Add a Select menu.
    - <`channel`>: Select a channel
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`role`>: Role.
    - [`item_name`]: Item name {0,83} - default: <role>
    - [`item_description`]: Item description {0,100}
    - [`item_emoji`]: Item emoji
    - [`menu_disabled`]: Set menu disabled - default: false
    - [`menu_place_holder`]: Menu place holder {0,150}

  - {`item`}: Add a item in a Select menu.
    - <`channel`>: Select a channel
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`menu`>: Select a menu. - `Autocomplete`
    - <`role`>: Select a role
    - [`item_name`]: Item name {0,83} - default: <role>
    - [`item_description`]: Item description {0,100}
    - [`item_emoji`]: Item emoji

- {`remove`}: Remove from a Select menu.

  - {`menu`}: Remove a Select menu.
    - <`channel`>: Select a channel
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`menu`>: Select a menu. - `Autocomplete`

  - {`item`}: Remove a item in a Select menu.
    - <`channel`>: Select a channel
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - <`menu`>: Select a menu. - `Autocomplete`
    - <`item`>: Select a menu item. - `Autocomplete`

#### timeout <`user`> <`time`> [`reason`]

> Temporarily mutes a user.
- <`user`>: The user to timeout.
- <`time`>: Time to timeout the user.
- [`reason`]: Reason for timeout.

#### unban <`user`> [`reason`]

> Revokes the ban from the selected user.
- <`user`>: User ID - `Autocomplete`
- [`reason`]: Reason to unban

---

### Utility - 8

#### avatar [`user`]

> Replies with the user's profile picture.
- [`user`]: Select user.

#### backup {`create`  | `delete`  | `list`  | `restore`  | `update`}

> Make backup for your server - Powered by Discord Backup.

- {`create`}: Create a new backup. Only on server!

- {`delete`}: If you are on a server, you will manage server backups.

  - {`server`}: Delete backups from a server.
    - <`id`>: Server ID - `Autocomplete`

  - {`backup`}: Delete backup.
    - <`key`>: Backup key - `Autocomplete`

- {`list`}: If you are on a server, this shows the backups for that server.

- {`restore`}: If you are on a server, you will manage server backups.

  - {`backup`}: Restore server
    - <`key`>: Backup key - `Autocomplete`
    - [`clear_server`]: Clear server before restore?

- {`update`}: Update a backup of server. Only on server!
  - <`key`>: Backup key - `Autocomplete`

#### embed {`send`  | `edit`}

> Send a embed message

- {`send`}: Send a message
  - <`embed`>: Set embed: Title {0,256} | Description {0,4096}
  - [`channel`]: Select a channel
  - [`content`]: Set content
  - [`image_url`]: Image URL

- {`edit`}: Edit

  - {`embed`}: Edit a embed.
    - <`channel`>: Select a channel
    - <`message_id`>: Message ID | Message URL - `Autocomplete`
    - [`embed`]: Set embed: Title {0,256} | Description {0,4096}
    - [`content`]: Set content
    - [`image_url`]: Image URL

#### info {`application`  | `channel`  | `role`  | `server`  | `user`}

> Server or user info.

- {`application`}: Bot info.

- {`channel`}: Channel info.
  - [`channel`]: Select channel.

- {`role`}: Role info.
  - <`role`>: Select role.

- {`server`}: Server info.

- {`user`}: User info.
  - [`user`]: Select user.

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
- <`activity`>: Select activity. - `Autocomplete`
- [`channel`]: Select a voice channel.
