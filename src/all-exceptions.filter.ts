import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response as ExpressResponse } from 'express';
import { LoggerService } from './logger/logger.service';

type Response = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new LoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();
    const request = ctx.getRequest<Request>();

    const responseBody: Response = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      responseBody.statusCode = exception.getStatus();
      responseBody.response = exception.getResponse();
    } else {
      responseBody.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody.response = 'Internal Server Error';
    }

    response.status(responseBody.statusCode).send(responseBody);

    const errorMessage =
      exception instanceof Error ? exception.message : 'Unknown error';

    this.logger.error(
      { type: responseBody.response, error: errorMessage },
      AllExceptionsFilter.name,
    );

    super.catch(exception, host);
  }
}
