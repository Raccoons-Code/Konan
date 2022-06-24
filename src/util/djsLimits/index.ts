export const djsLimits = new class DjsLimits {
  application: {
    command: {
      choices: 25,
      description: 100,
      name: 32,
      option: {
        name: 100,
        value: 100,
      },
      options: 25,
    },
  } = {
      command: {
        choices: 25,
        description: 100,
        name: 32,
        option: {
          name: 100,
          value: 100,
        },
        options: 25,
      },
    };

  applicationCommandChoices(subtract = 0) {
    return this.application.command.choices - subtract;
  }

  applicationCommandDescription(subtract = 0) {
    return this.application.command.description - subtract;
  }

  applicationCommandName(subtract = 0) {
    return this.application.command.name - subtract;
  }

  applicationCommandOptionName(subtract = 0) {
    return this.application.command.option.name - subtract;
  }

  applicationCommandOptionValue(subtract = 0) {
    return this.application.command.option.value - subtract;
  }

  applicationCommandOptions(subtract = 0) {
    return this.application.command.options - subtract;
  }

  button: {
    customId: 100,
    label: 80,
  } = {
      customId: 100,
      label: 80,
    };

  buttonCustomId(subtract = 0) {
    return this.button.customId - subtract;
  }

  buttonLabel(subtract = 0) {
    return this.button.label - subtract;
  }

  component: {
    buttons: 5,
    modals: 1,
    selectMenus: 1,
  } = {
      buttons: 5,
      modals: 1,
      selectMenus: 1,
    };

  componentButtons(subtract = 0) {
    return this.component.buttons - subtract;
  }

  componentModals(subtract = 0) {
    return this.component.modals - subtract;
  }

  componentSelectMenus(subtract = 0) {
    return this.component.selectMenus - subtract;
  }

  embed: {
    author: {
      name: 256,
    },
    description: 4096,
    field: {
      name: 256,
      value: 1024,
    },
    fields: 25,
    footer: {
      text: 2048,
    },
    title: 256,
    total: 6000,
  } = {
      author: {
        name: 256,
      },
      description: 4096,
      field: {
        name: 256,
        value: 1024,
      },
      fields: 25,
      footer: {
        text: 2048,
      },
      title: 256,
      total: 6000,
    };

  embedAuthorName(subtract = 0) {
    return this.embed.author.name - subtract;
  }

  embedDescription(subtract = 0) {
    return this.embed.description - subtract;
  }

  embedFieldName(subtract = 0) {
    return this.embed.field.name - subtract;
  }

  embedFieldValue(subtract = 0) {
    return this.embed.field.value - subtract;
  }

  embedFields(subtract = 0) {
    return this.embed.fields - subtract;
  }

  embedFooterText(subtract = 0) {
    return this.embed.footer.text - subtract;
  }

  embedTitle(subtract = 0) {
    return this.embed.title - subtract;
  }

  embedTotal(subtract = 0) {
    return this.embed.total - subtract;
  }

  message: {
    components: 5,
    content: 4096,
    embeds: 10,
  } = {
      components: 5,
      content: 4096,
      embeds: 10,
    };

  messageComponents(subtract = 0) {
    return this.message.components - subtract;
  }

  messageContent(subtract = 0) {
    return this.message.content - subtract;
  }

  messageEmbeds(subtract = 0) {
    return this.message.embeds - subtract;
  }

  modal: {
    customId: 100,
    label: 45,
    placeholder: 100,
    value: 4000,
  } = {
      customId: 100,
      label: 45,
      placeholder: 100,
      value: 4000,
    };

  modalCustomId(subtract = 0) {
    return this.modal.customId - subtract;
  }

  modalLabel(subtract = 0) {
    return this.modal.label - subtract;
  }

  modalPlaceholder(subtract = 0) {
    return this.modal.placeholder - subtract;
  }

  modalValue(subtract = 0) {
    return this.modal.value - subtract;
  }

  selectMenu: {
    customId: 100,
    option: {
      description: 100,
      label: 100,
      value: 100,
    },
    options: 25,
    placeholder: 150,
  } = {
      customId: 100,
      option: {
        description: 100,
        label: 100,
        value: 100,
      },
      options: 25,
      placeholder: 150,
    };

  selectMenuCustomId(subtract = 0) {
    return this.selectMenu.customId - subtract;
  }

  selectMenuOptionDescription(subtract = 0) {
    return this.selectMenu.option.description - subtract;
  }

  selectMenuOptionLabel(subtract = 0) {
    return this.selectMenu.option.label - subtract;
  }

  selectMenuOptionValue(subtract = 0) {
    return this.selectMenu.option.value - subtract;
  }

  selectMenuOptions(subtract = 0) {
    return this.selectMenu.options - subtract;
  }

  selectMenuPlaceholder(subtract = 0) {
    return this.selectMenu.placeholder - subtract;
  }
};

export default djsLimits;