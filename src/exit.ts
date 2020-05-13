import { izzyProcess } from "./izzy";
import { giannaProcess } from "./gianna";
import * as logger from "./logger";

function killProcess(code = 0) {
  return () => {
    if (izzyProcess) {
      logger.log("Killing izzy...");
      izzyProcess.kill();
    }
    if (giannaProcess) {
      logger.log("Killing gianna...");
      giannaProcess.kill();
    }
    process.exit(code);
  };
}

export function applyExitHooks() {
  process.on("exit", killProcess(0));
  process.on("SIGTERM", killProcess(0));
  process.on("SIGINT", killProcess(0));
  process.on("SIGUSR1", killProcess(0));
  process.on("SIGUSR2", killProcess(0));
  process.on("uncaughtException", (e) => {
    console.log("Uncaught Exception...");
    console.log(e.stack);
    killProcess(99)();
  });
}
