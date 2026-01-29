/**
 * Base Service Abstract Class
 *
 * Provides common functionality for all services:
 * - Structured logging
 * - Error handling
 * - Demo mode detection
 */

import { createLogger, Logger } from '@/lib/logger';
import { isDemoMode } from '@/lib/env';

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export abstract class BaseService {
  protected readonly logger: Logger;
  protected readonly serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.logger = createLogger(serviceName);
  }

  /**
   * Check if running in demo mode
   */
  protected isDemo(): boolean {
    return isDemoMode();
  }

  /**
   * Handle and log errors consistently
   */
  protected handleError(error: unknown, context: string): never {
    const message = error instanceof Error ? error.message : String(error);
    this.logger.error(`${context} failed`, error, { context });
    throw new Error(`${this.serviceName}: ${context} - ${message}`);
  }

  /**
   * Create a success result
   */
  protected success<T>(data: T): ServiceResult<T> {
    return { success: true, data };
  }

  /**
   * Create a failure result
   */
  protected failure<T>(error: string): ServiceResult<T> {
    return { success: false, error };
  }

  /**
   * Log an info message
   */
  protected logInfo(message: string, context?: Record<string, unknown>): void {
    this.logger.info(message, context);
  }

  /**
   * Log a warning message
   */
  protected logWarn(message: string, context?: Record<string, unknown>): void {
    this.logger.warn(message, context);
  }

  /**
   * Log a debug message
   */
  protected logDebug(message: string, context?: Record<string, unknown>): void {
    this.logger.debug(message, context);
  }

  /**
   * Get the service name
   */
  abstract getProviderName(): string;
}
