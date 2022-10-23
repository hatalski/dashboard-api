import express, { Express } from 'express';
import { Server } from 'http';
import { ILoggerService } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { IExceptionFilter } from './errors/exception.filter.interface';
import 'reflect-metadata';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { UserController } from './users/users.controller';
import { PrismaService } from './database/prisma.service';

@injectable()
export default class App {
	private _app: Express;
	private _server: Server;
	private _port: number;

	constructor(
		@inject(TYPES.ILoggerService) private logger: ILoggerService,
		@inject(TYPES.IUserController) private userController: UserController,
		@inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
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

	useMiddleware(): void {
		this._app.use(json());
	}

	useRoutes(): void {
		this._app.use('/users', this.userController.router);
	}

	useExceptionFilters(): void {
		this._app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		this.prismaService.connect();
		this._server = this._app.listen(this._port, () => {
			this.logger.log(`Server started as http://localhost:${this._port}`);
		});
	}
}
