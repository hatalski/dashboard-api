import { BaseController } from '../common/base.controller';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILoggerService } from '../logger/logger.interface';
import 'reflect-metadata';
import { IUserController } from './user.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILoggerService) private loggerService: ILoggerService) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/login', method: 'post', func: this.login },
			{ path: '/register', method: 'post', func: this.register },
		]);
	}

	public login(req: Request, res: Response, next: NextFunction): void {
		next(new HttpError(401, 'authorization error'));
	}

	public register(req: Request, res: Response, next: NextFunction): void {
		this.send(res, 201, 'user registered');
	}
}
