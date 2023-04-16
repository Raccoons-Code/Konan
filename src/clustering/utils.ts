import cluster, { Worker } from "node:cluster";
import EventEmitter from "node:events";

export function waitClusterMessage<T>(callback: (worker: Worker, message: T) => boolean | void): Promise<T> {
  cluster.setMaxListeners(cluster.getMaxListeners() + 1);

  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      cluster.removeListener("message", listener);
      cluster.setMaxListeners((cluster.getMaxListeners() || 1) - 1);

      reject(new Error("Timeout"));
    }, 60_000);

    const listener = function (worker: Worker, message: any) {
      if (callback(worker, message)) {
        clearTimeout(timeout);

        cluster.removeListener("message", listener);
        cluster.setMaxListeners((cluster.getMaxListeners() || 1) - 1);

        if (message.error) {
          reject(new Error(message.error));
        }

        resolve(message);
      }

      return;
    };

    cluster.on("message", listener);
  });
}

export function waitMessageReady(emitter: EventEmitter) {
  emitter.setMaxListeners(emitter.getMaxListeners() + 1);

  return new Promise((resolve, _) => {
    const listener = function (message: any) {
      if (message !== "ready") return;

      emitter.removeListener("message", listener);

      emitter.setMaxListeners((emitter.getMaxListeners() || 1) - 1);

      resolve(message);
    };

    emitter.on("message", listener);
  });
}
