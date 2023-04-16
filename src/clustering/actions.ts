import cluster, { Worker } from "node:cluster";

const actions = {
  getShard(message: any) {
    if (cluster.workers) {
      delete message.origin;
      const keys = Object.keys(cluster.workers)
        .filter(k => +k !== cluster.worker?.id);
      for (const key of keys) {
        cluster.workers[key]?.emit("message", message);
      }
      return;
    }
  },

  async getTotalWorkers(message: any, worker: Worker) {
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
  },

  ready(message: any, worker: Worker) {
    cluster.emit("message", worker, message);
  },
};

export const actionConditions = {
  getShard: function (message: any) {
    return Boolean(message.origin);
  },
};

export type ActionType = keyof typeof actions;

export const actionTypes = <ActionType[]>Object.keys(actions);

export type ActionConditionType = keyof typeof actionConditions;

export const actionConditionTypes = <ActionConditionType[]>Object.keys(actionConditions);

export default actions;
