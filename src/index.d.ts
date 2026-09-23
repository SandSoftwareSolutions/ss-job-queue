export interface JobQueueOptions { concurrency?: number; }
export interface JobOptions { retries?: number; }
export declare class JobQueue {
  readonly concurrency: number;
  constructor(options?: JobQueueOptions);
  add<T>(task: () => T | Promise<T>, options?: JobOptions): Promise<T>;
  onIdle(): Promise<void>;
}
