import cluster from "node:cluster";
import { BaseProcessMessage } from "../@types";

cluster.on("fork", (worker) => {
  worker.on("message", async (message: BaseProcessMessage) => {
    if (!message?.id) return;

    if (message.replyWorker) {
      const replyWorker = message.replyWorker;
      delete message.replyWorker;
      cluster.workers?.[replyWorker]?.emit("message", message);
      return;
    }

    if (message.toWorker) {
      const toWorker = message.toWorker;
      delete message.toWorker;
      cluster.workers?.[toWorker]?.emit("message", message);
      return;
    }

    worker.send(message, () => null);
  });
});
