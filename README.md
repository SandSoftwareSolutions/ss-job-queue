# @sandsoftwaresolutions/job-queue

Minimal promise queue for background work inside a Node process, worker or script.

```js
import { JobQueue } from "@sandsoftwaresolutions/job-queue";

const queue = new JobQueue({ concurrency: 4 });
await queue.add(() => sendEmail(customer), { retries: 2 });
await queue.onIdle();
```

This queue is in-memory by design; use a durable queue for jobs that must survive a process restart.
