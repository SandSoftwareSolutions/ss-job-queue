import assert from "node:assert/strict";
import test from "node:test";
import { JobQueue } from "./src/index.js";
test("limits concurrent work", async () => {
  const queue = new JobQueue({ concurrency: 2 }); let active = 0; let peak = 0;
  await Promise.all(Array.from({ length: 5 }, () => queue.add(async () => { active++; peak = Math.max(peak, active); await new Promise((r) => setTimeout(r, 5)); active--; })));
  assert.equal(peak, 2);
});
test("retries failed jobs", async () => {
  const queue = new JobQueue(); let attempts = 0;
  assert.equal(await queue.add(() => { attempts++; if (attempts < 2) throw new Error("retry"); return "done"; }, { retries: 1 }), "done");
});
