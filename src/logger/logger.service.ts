import { Injectable, ConsoleLogger } from '@nestjs/common';
import { promises as fsPromises, existsSync } from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService extends ConsoleLogger {
  async logToFile(entry: any) {
    const level = entry.level;
    const date = entry.time.toISOString().split('T')[0];
    const dateString = date.split('-').reverse().join('_');
    try {
      if (!existsSync(path.join(__dirname, '..', '..', 'logs'))) {
        await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'));
      }
      if (!existsSync(path.join(__dirname, '..', '..', `logs/${dateString}`))) {
        await fsPromises.mkdir(
          path.join(__dirname, '..', '..', `logs/${dateString}`),
        );
      }
      await fsPromises.appendFile(
        path.join(__dirname, '..', '..', `logs/${dateString}`, `${level}.log`),
        `${JSON.stringify(entry)}\n`,
      );
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  }

  log(message: any, context?: string) {
    const entry = {
      level: 'info',
      time: new Date(),
      context,
      msg: message,
    };
    this.logToFile(entry);
    super.log(message, context);
  }

  error(message: any, stackOrContext?: string) {
    const entry = {
      level: 'error',
      time: new Date(),
      context: stackOrContext,
      msg: message,
    };
    this.logToFile(entry);
    super.error(message, stackOrContext);
  }

  warn(message: any, context?: string) {
    const entry = {
      level: 'warn',
      time: new Date(),
      context,
      msg: message,
    };
    this.logToFile(entry);
    super.warn(message, context);
  }

  debug(message: any, context?: string) {
    const entry = {
      level: 'debug',
      time: new Date(),
      context,
      msg: message,
    };
    this.logToFile(entry);
    super.debug(message, context);
  }

  verbose(message: any, context?: string) {
    const entry = {
      level: 'verbose',
      time: new Date(),
      context,
      msg: message,
    };
    this.logToFile(entry);
    super.verbose(message, context);
  }

  fatal(message: any, context?: string) {
    const entry = {
      level: 'fatal',
      time: new Date(),
      context,
      msg: message,
    };
    this.logToFile(entry);
    super.fatal(message, context);
  }

  req(message: any, context?: string) {
    const entry = {
      level: 'info',
      time: new Date(),
      context,
      req: message,
    };
    this.logToFile(entry);
    super.log(message, context);
  }

  res(message: any, context?: string) {
    const entry = {
      level: 'info',
      time: new Date(),
      context,
      res: message,
    };
    this.logToFile(entry);
    super.log(message, context);
  }
}
