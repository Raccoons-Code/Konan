import cluster from "node:cluster";
import { BaseProcessMessage } from "../@types";

cluster.on("fork", (worker) => {
  worker.on("message", async (message: BaseProcessMessage) => {
    if (!message?.id) return;

    if (message.action === "getTotalWorkers") {
      delete message.action;

      await new Promise((resolve) => {
        worker.setMaxListeners(worker.getMaxListeners() + 1);

        const listener = function (msg: any) {
          if (msg?.type !== "totalWorkers") return;

          worker.removeListener("message", listener);

          worker.setMaxListeners((worker.getMaxListeners() || 1) - 1);

          message.data = {
            totalWorkers: msg.totalWorkers,
          };
          message.replied = true;
          message.replyShard = message.fromShard;
          message.replyWorker = message.fromWorker;

          resolve(worker.send(message, () => null));
        };

        worker.on("message", listener);

        cluster.emit("message", worker, "getTotalWorkers");
      });

      return;
    }

    if (message.action === "getShard" && message.origin === "shard") {
      if (cluster.workers) {
        delete message.origin;
        const keys = Object.keys(cluster.workers)
          .filter(k => +k !== cluster.worker?.id);
        for (const key of keys) {
          cluster.workers?.[key]?.emit("message", message);
        }
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
