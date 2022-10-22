import { Response, Request, NextFunction } from 'express';
import { HttpError } from './http-error.class.js';

export interface IExceptionFilter {
	catch: (err: Error | HttpError, req: Request, res: Response, next: NextFunction) => void;
}
