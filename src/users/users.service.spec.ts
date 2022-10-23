import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';
import { ILoggerService } from '../logger/logger.interface';
import { Logger } from 'tslog';

const configServiceMock: IConfigService = {
	get: jest.fn(),
};

const usersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const loggerMock: ILoggerService = {
	logger: new Logger(),
	log: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersService: IUserService;
let usersRepository: IUsersRepository;
let logger: ILoggerService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.IUserService).to(UserService);
	container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(configServiceMock);
	container.bind<IUsersRepository>(TYPES.IUsersRepository).toConstantValue(usersRepositoryMock);
	container.bind<ILoggerService>(TYPES.ILoggerService).toConstantValue(loggerMock);

	logger = container.get<ILoggerService>(TYPES.ILoggerService);
	configService = container.get<IConfigService>(TYPES.IConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.IUsersRepository);
	usersService = container.get<IUserService>(TYPES.IUserService);
});

let createdUser: UserModel | null;

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);

		createdUser = await usersService.createUser({
			email: 'a.m@gmail.com',
			name: 'alex melki',
			password: '1',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validateUser success', async () => {
		const user = createdUser;
		if (!user) {
			throw new Error('user has not been created');
		}

		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const userValid = await usersService.validateUser({
			email: 'a.m@gmail.com',
			password: '1',
		});

		expect(userValid).toBeTruthy();
	});

	it('validateUser invalid user', async () => {
		const user = createdUser;
		if (!user) {
			throw new Error('user has not been created');
		}

		usersRepository.find = jest.fn().mockReturnValueOnce(null);

		const result = await usersService.validateUser({
			email: 'am@gmail.com',
			password: '1',
		});

		expect(result).toBeFalsy();
	});

	it('validateUser invalid password', async () => {
		const user = createdUser;
		if (!user) {
			throw new Error('user has not been created');
		}

		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const result = await usersService.validateUser({
			email: 'a.m@gmail.com',
			password: '2',
		});

		expect(result).toBeFalsy();
	});
});
