import { get, set, del } from 'idb-keyval';

export type QueuedAction = {
  id: string;
  type: 'DELETE';
  payload: {
    postId: number;
  };
  timestamp: number;
}

const QUEUE_KEY = 'offline-queue';

export const queueService = {
  async addToQueue(action: Omit<QueuedAction, 'id' | 'timestamp'>) {
    const queue = await this.getQueue();
    const newAction: QueuedAction = {
      ...action,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
    };
    await set(QUEUE_KEY, [...queue, newAction]);
    return newAction;
  },

  async getQueue(): Promise<QueuedAction[]> {
    return await get(QUEUE_KEY) || [];
  },

  async removeFromQueue(actionId: string) {
    const queue = await this.getQueue();
    await set(
      QUEUE_KEY,
      queue.filter(action => action.id !== actionId)
    );
  },

  async processQueue(callback: (action: QueuedAction) => Promise<void>) {
    const queue = await this.getQueue();
    
    for (const action of queue) {
      try {
        await callback(action);
        await this.removeFromQueue(action.id);
      } catch (error) {
        console.error(`Failed to process action ${action.id}:`, error);
      }
    }
  },

  async clearQueue() {
    await del(QUEUE_KEY);
  },
  
  async getQueueLength(): Promise<number> {
    const queue = await this.getQueue();
    return queue.length;
  }
};