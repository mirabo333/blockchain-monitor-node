export interface Logger {
  info(message: string, ...args: any[]): void;
  error(message: string, error?: any): void;
  warn(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

export const logger: Logger;
