export class JobQueue {
  #pending = [];
  #active = 0;
  #idleResolvers = [];

  constructor({ concurrency = 1 } = {}) {
    if (!Number.isSafeInteger(concurrency) || concurrency < 1) throw new TypeError("concurrency must be a positive integer");
    this.concurrency = concurrency;
  }

  add(task, { retries = 0 } = {}) {
    if (typeof task !== "function") throw new TypeError("task must be a function");
    if (!Number.isSafeInteger(retries) || retries < 0) throw new TypeError("retries must be a non-negative integer");
    return new Promise((resolve, reject) => {
      this.#pending.push({ task, retries, resolve, reject });
      this.#drain();
    });
  }

  onIdle() {
    if (!this.#pending.length && !this.#active) return Promise.resolve();
    return new Promise((resolve) => this.#idleResolvers.push(resolve));
  }

  #drain() {
    while (this.#active < this.concurrency && this.#pending.length) this.#run(this.#pending.shift());
    if (!this.#pending.length && !this.#active) this.#idleResolvers.splice(0).forEach((resolve) => resolve());
  }

  async #run(job) {
    this.#active += 1;
    try {
      job.resolve(await job.task());
    } catch (error) {
      if (job.retries > 0) this.#pending.push({ ...job, retries: job.retries - 1 });
      else job.reject(error);
    } finally {
      this.#active -= 1;
      this.#drain();
    }
  }
}
