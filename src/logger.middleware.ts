import { randomBytes } from 'node:crypto';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new LoggerService(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = randomBytes(8).toString('hex');
    const startTime = new Date();

    // 🔐 Логування тіла лише якщо НЕ multipart
    const isMultipart = req.headers['content-type']?.startsWith(
      'multipart/form-data',
    );

    if (!isMultipart) {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        if (body) {
          this.logger.req(
            {
              reqId: requestId,
              method: req.method,
              url: req.url,
              headers: { ...req.headers, authorization: '[Redacted]' },
              msg: 'incoming request',
              // body: JSON.parse(body), // можна розкоментувати, якщо хочеш
            },
            LoggerMiddleware.name,
          );
        }
      });
    }

    res.on('finish', () => {
      const endTime = new Date();
      const responseTime = endTime.getTime() - startTime.getTime();
      this.logger.res(
        {
          reqId: requestId,
          statusCode: res.statusCode,
          responseTime,
          msg: 'request completed',
        },
        LoggerMiddleware.name,
      );
    });

    next();
  }
}
