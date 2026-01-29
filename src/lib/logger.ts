/**
 * Structured Logging Utility
 *
 * Provides centralized logging with JSON output for production monitoring.
 * Supports log levels, contextual data, and request correlation.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service?: string;
  correlationId?: string;
  [key: string]: unknown;
}

interface LogContext {
  [key: string]: unknown;
}

interface Logger {
  debug: (message: string, context?: LogContext) => void;
  info: (message: string, context?: LogContext) => void;
  warn: (message: string, context?: LogContext) => void;
  error: (message: string, error?: unknown, context?: LogContext) => void;
  child: (defaultContext: LogContext) => Logger;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const getMinLogLevel = (): LogLevel => {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel | undefined;
  if (envLevel && envLevel in LOG_LEVELS) {
    return envLevel;
  }
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
};

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] >= LOG_LEVELS[getMinLogLevel()];
};

const formatError = (error: unknown): Record<string, unknown> => {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
  return { errorMessage: String(error) };
};

const createLogEntry = (
  level: LogLevel,
  message: string,
  service?: string,
  context?: LogContext,
  error?: unknown
): LogEntry => {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  if (service) {
    entry.service = service;
  }

  if (context) {
    Object.assign(entry, context);
  }

  if (error) {
    Object.assign(entry, formatError(error));
  }

  return entry;
};

const writeLog = (entry: LogEntry): void => {
  const output = JSON.stringify(entry);

  switch (entry.level) {
    case 'error':
      console.error(output);
      break;
    case 'warn':
      console.warn(output);
      break;
    case 'debug':
      console.debug(output);
      break;
    default:
      console.log(output);
  }
};

/**
 * Creates a logger instance with optional service name context
 */
export const createLogger = (service?: string, defaultContext?: LogContext): Logger => {
  const log = (
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: unknown
  ): void => {
    if (!shouldLog(level)) return;

    const mergedContext = { ...defaultContext, ...context };
    const entry = createLogEntry(level, message, service, mergedContext, error);
    writeLog(entry);
  };

  return {
    debug: (message: string, context?: LogContext) => log('debug', message, context),
    info: (message: string, context?: LogContext) => log('info', message, context),
    warn: (message: string, context?: LogContext) => log('warn', message, context),
    error: (message: string, error?: unknown, context?: LogContext) =>
      log('error', message, context, error),
    child: (childContext: LogContext) =>
      createLogger(service, { ...defaultContext, ...childContext }),
  };
};

/**
 * Default logger instance for general use
 */
export const logger = createLogger();

/**
 * Pre-configured loggers for common services
 */
export const apiLogger = createLogger('api');
export const authLogger = createLogger('auth');
export const paymentLogger = createLogger('payment');
export const emailLogger = createLogger('email');
export const calendarLogger = createLogger('calendar');

/**
 * Request logger helper - creates a child logger with request context
 */
export const createRequestLogger = (
  baseLogger: Logger,
  request: Request
): Logger => {
  const url = new URL(request.url);
  return baseLogger.child({
    method: request.method,
    path: url.pathname,
    correlationId: crypto.randomUUID(),
  });
};

export type { Logger, LogContext, LogLevel, LogEntry };
