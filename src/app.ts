import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './users/user.controller.js';
import { ILoggerService } from './logger/logger.interface.js';
import { inject, injectable } from 'inversify';
import { TYPES } from './types.js';
import { IExceptionFilter } from './errors/exception.filter.interface.js';
import 'reflect-metadata';

@injectable()
export default class App {
	private _app: Express;
	private _server: Server;
	private _port: number;

	constructor(
		@inject(TYPES.ILoggerService) private logger: ILoggerService,
		@inject(TYPES.IUserController) private userController: UserController,
		@inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
		port = 8000,
	) {
		this._app = express();
		this._port = port;
	}

	get server(): Server {
		return this._server;
	}

	get port(): number {
		return this._port;
	}

	useRoutes(): void {
		this._app.use('/users', this.userController.router);
	}

	useExceptionFilters(): void {
		this._app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useRoutes();
		this.useExceptionFilters();
		this._server = this._app.listen(this._port, () => {
			this.logger.log(`Server started as http://localhost:${this._port}`);
		});
	}
}
