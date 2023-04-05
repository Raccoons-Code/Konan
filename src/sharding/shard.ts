import "../@prototypes";
import eventHandler from "../handlers/EventHandler";
import client from "./../client";

eventHandler.load()
  .then(() => client.login());

/* setTimeout(() => process.exit(0), 1000 * 60 * 60); */
