# @sandsoftwaresolutions/job-queue

[![CI](https://github.com/SandSoftwareSolutions/ss-job-queue/actions/workflows/ci.yml/badge.svg)](https://github.com/SandSoftwareSolutions/ss-job-queue/actions/workflows/ci.yml)

A tiny promise queue for controlled concurrent work in Node.js scripts, workers and API processes.

## Install

```bash
npm install @sandsoftwaresolutions/job-queue
```

Works with `import` and `require()`, and ships TypeScript types for both.

## Usage

```js
import { JobQueue } from "@sandsoftwaresolutions/job-queue";

const queue = new JobQueue({ concurrency: 4 });

const results = await Promise.all(customers.map((customer) =>
  queue.add(() => sendEmail(customer), { retries: 2 })
));

await queue.onIdle();
```

## API

- `new JobQueue({ concurrency = 1 })` sets the maximum number of active jobs.
- `queue.add(task, { retries = 0 })` schedules a function and returns its result as a promise.
- `queue.onIdle()` resolves once all pending and active work has finished.

Retries happen immediately after a failure. This queue intentionally stores work only in memory: a restart loses queued jobs. Use a durable broker for payments, emails, or other work that must survive a crash.
