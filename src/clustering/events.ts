import cluster from "node:cluster";
import { BaseProcessMessage } from "../@types";
import actions, { ActionConditionType, ActionType, actionConditionTypes, actionConditions, actionTypes } from "./actions";

cluster.on("fork", (worker) => {
  worker.on("message", async (message: BaseProcessMessage) => {
    if (!message?.id) return;

    if (actionTypes.includes(<ActionType>message.action)) {
      if (actionConditionTypes.includes(<ActionConditionType>message.action)) {
        if (actionConditions[<ActionConditionType>message.action](message)) {
          await actions[<ActionType>message.action](message, worker);
          return;
        }
      } else {
        await actions[<ActionType>message.action](message, worker);
        return;
      }
    }

    if (message.replyWorker) {
      message.fromWorker = worker.id;
      const replyWorker = message.replyWorker;
      delete message.replyWorker;
      cluster.workers?.[replyWorker]?.emit("message", message);
      return;
    }

    if (message.toWorker) {
      message.fromWorker = worker.id;
      const toWorker = message.toWorker;
      delete message.toWorker;
      cluster.workers?.[toWorker]?.emit("message", message);
      return;
    }

    worker.send(message, () => null);
  });
});
