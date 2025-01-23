import { get, set, del } from "idb-keyval";
import { uuid } from "uuidv4";

export type QueueError = {
  status: number;
  message?: string;
};

export type QueuedAction = {
  id: string;
  type: "DELETE" | "CREATE";
  payload: {
    postId?: number;
    postData?: {
      title: string;
      body: string;
      userId: number;
    };
  };
  timestamp: number;
};

const QUEUE_KEY = "offline-queue";

export const queueService = {
  async addToQueue(action: Omit<QueuedAction, "id" | "timestamp">) {
    const queue = await this.getQueue();
    const newAction: QueuedAction = {
      ...action,
      id: uuid(),
      timestamp: Date.now(),
    };
    await set(QUEUE_KEY, [...queue, newAction]);
    return newAction;
  },

  async getQueue(): Promise<QueuedAction[]> {
    return (await get(QUEUE_KEY)) || [];
  },

  async removeFromQueue(actionId: string) {
    const queue = await this.getQueue();
    await set(
      QUEUE_KEY,
      queue.filter((action) => action.id !== actionId)
    );
  },

  async processQueue(callback: (action: QueuedAction) => Promise<void>) {
    const queue = await this.getQueue();
    for (const action of queue) {
      try {
        await callback(action);
        await this.removeFromQueue(action.id);
      } catch (error) {
        const queueError = error as QueueError;
        if (queueError.status === 404) {
          await this.removeFromQueue(action.id);
        }
      }
    }
  },

  async clearQueue() {
    await del(QUEUE_KEY);
  },

  async getQueueLength(): Promise<number> {
    const queue = await this.getQueue();
    return queue.length;
  },
};
