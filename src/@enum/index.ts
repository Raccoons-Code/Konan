export * from "./structures";
export * from "./translator";

export const enum CommandTypes {
  ApplicationAutocomplete = "autocomplete",
  ApplicationChatInput = "application.chatinput",
  ApplicationContextMessage = "application.context.message",
  ApplicationContextUser = "application.context.user",
  ChatInput = "chatinput",
  ComponentButton = "component.button",
  ComponentSelectChannel = "component.select.channel",
  ComponentSelectMentionable = "component.select.mentionable",
  ComponentSelectRole = "component.select.role",
  ComponentSelectString = "component.select.string",
  ComponentSelectUser = "component.select.user",
  ComponentTextInput = "component.textinput",
  Modal = "modal"
}
