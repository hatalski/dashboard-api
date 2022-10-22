import { Response, Request, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { ILoggerService } from '../logger/logger.interface.js';
import { TYPES } from '../types.js';
import { IExceptionFilter } from './exception.filter.interface.js';
import { HttpError } from './http-error.class.js';
import 'reflect-metadata';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILoggerService) private logger: ILoggerService) {}

	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpError) {
			this.logger.error(`[${err.context}] Error ${err.statusCode} ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(`${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
