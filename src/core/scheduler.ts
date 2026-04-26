export interface Scheduler {
  start(): void;
  stop(): void;
}

export function createScheduler(interval: number, task: () => void): Scheduler {
  let timer: ReturnType<typeof window.setInterval> | null = null;

  return {
    start() {
      if (timer !== null) return;
      timer = window.setInterval(task, interval);
    },
    stop() {
      if (timer === null) return;
      window.clearInterval(timer);
      timer = null;
    },
  };
}
