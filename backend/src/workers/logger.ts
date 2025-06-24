import chalk, { ChalkInstance } from "chalk";

// hijack the vanilla js console functions
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;
const originalConsoleDebug = console.debug;

type logTypes = "log" | "error" | "warn" | "info" | "debug";

const logColors: Record<logTypes, ChalkInstance> = {
  log: chalk.bold.bgGreen,
  error: chalk.bold.bgRed,
  warn: chalk.bold.bgYellow,
  info: chalk.bold.bgBlue,
  debug: chalk.bold.bgMagenta,
};

function consoleTypeFlag(type: logTypes): string {
  return logColors[type](`[${type.toUpperCase()}]`);
}

function consoleDateTime(): string {
  return chalk.dim(new Date().toISOString());
}

export function hijackConsole() {
  console.log = (...args) => {
    originalConsoleLog(consoleDateTime(), consoleTypeFlag("log"), ...args);
    // Here you can add code to send logs to a server or save them
  };

  console.error = (...args) => {
    originalConsoleError(consoleDateTime(), consoleTypeFlag("error"), ...args);
    // Here you can add code to send error logs to a server or save them
  };

  console.warn = (...args) => {
    originalConsoleWarn(consoleDateTime(), consoleTypeFlag("warn"), ...args);
    // Here you can add code to send warning logs to a server or save them
  };

  console.info = (...args) => {
    originalConsoleInfo(consoleDateTime(), consoleTypeFlag("info"), ...args);
    // Here you can add code to send info logs to a server or save them
  };

  console.debug = (...args) => {
    originalConsoleDebug(consoleDateTime(), consoleTypeFlag("debug"), ...args);
    // Here you can add code to send debug logs to a server or save them
  };
}
